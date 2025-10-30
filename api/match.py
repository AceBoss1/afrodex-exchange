import json
import os
import time
from http import HTTPStatus
from web3 import Web3
from web3.exceptions import TransactionNotFound
from database import db_client, get_orders_for_matching, update_orders_after_match

# --- CONFIGURATION (Ensure these environment variables are set on Vercel) ---
PRIVATE_KEY = os.environ.get("RELAYER_PRIVATE_KEY")
NODE_URL = os.environ.get("MAINNET_NODE_URL")
CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS")
CONTRACT_ABI = json.loads(os.environ.get("CONTRACT_ABI_JSON", "[]")) # ABI of your AfroDEX smart contract

# Initialize Web3
if not NODE_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    # Use placeholder values if ENV vars are missing (for local testing without full setup)
    print("WARNING: Required environment variables are missing. Using mock Web3 connection.")
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545")) 
    w3_connected = False
else:
    w3 = Web3(Web3.HTTPProvider(NODE_URL))
    w3_connected = w3.is_connected()

RELAYER_ADDRESS = w3.eth.account.from_key(PRIVATE_KEY).address if PRIVATE_KEY else None

def match_and_execute_trade(new_order_data: dict):
    """
    Finds a matching order, calculates trade amounts, and executes the trade on the smart contract.
    """
    if not w3_connected or not RELAYER_ADDRESS:
        return {"success": False, "message": "Relayer or Web3 connection is not configured correctly."}, HTTPStatus.INTERNAL_SERVER_ERROR

    # 1. FIND MATCHING ORDERS
    # The new_order_data is the taker's order (the one that is executing the match).
    # We look for opposite, open orders in the database.
    try:
        # A match must meet these criteria:
        # 1. tokenGet (new) == tokenGive (existing)
        # 2. tokenGive (new) == tokenGet (existing)
        # 3. Existing order must be OPEN and not expired
        matching_orders_query = get_orders_for_matching(
            token_get=new_order_data['tokenGive'],
            token_give=new_order_data['tokenGet'],
            max_price_ratio=new_order_data['amountGive'] / new_order_data['amountGet']
        )
        
        if not matching_orders_query:
            return {"success": False, "message": "No immediate matching orders found. Order placed in book."}, HTTPStatus.OK
        
        # In a real DEX, you'd iterate through sorted orders. 
        # For simplicity, we assume the first order returned is the best match.
        match_order = matching_orders_query[0]
        
    except Exception as e:
        print(f"Database query error: {e}")
        return {"success": False, "message": f"Database search failed: {str(e)}"}, HTTPStatus.INTERNAL_SERVER_ERROR

    # 2. CALCULATE TRADE AMOUNTS
    # amount_get_new = amount token the new order WANTS
    # amount_give_new = amount token the new order WILL PAY
    # amount_get_match = amount token the matched order WANTS
    # amount_give_match = amount token the matched order WILL PAY
    
    # We execute the trade based on the MINIMUM of the two orders' available amounts.
    # The trade amount will be the maximum that both orders can cover.
    
    # Calculate how much of tokenGet (new) can be purchased by the matched order
    # amount_get_match_available = min(match_order['amountGet'], new_order_data['amountGive'] * match_order['price_ratio'])
    
    # For simplicity, we will assume a full fill if the price is right and amounts are available,
    # but the smart contract will ultimately validate and cap the execution.
    # We propose a trade for the MINIMUM of the tokens being traded by the counter-party.
    # The 'amount' parameter in the trade function is the amount of tokenGive of the NEW order
    # that the match_order's user wants to trade.
    
    trade_amount = min(
        new_order_data['amountGet'],  # Amount the taker wants to BUY
        match_order['amountGive'] * (new_order_data['amountGet'] / new_order_data['amountGive']) # Equivalent amount the maker can SELL
    )
    
    # NOTE: The trade function on the smart contract takes one order (the 'maker')
    # and the amount of the maker's tokenGive that is being bought by the taker.
    # We will submit the MATCH_ORDER as the Maker, and the NEW_ORDER as the Taker.
    # 'trade_amount' is the amount of MATCH_ORDER's tokenGive that the NEW_ORDER is buying.

    # 3. CONSTRUCT AND SUBMIT TRANSACTION
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        nonce = w3.eth.get_transaction_count(RELAYER_ADDRESS)
        gas_price = w3.eth.gas_price # Use current gas price

        # Prepare the transaction data for the 'trade' function
        # The trade function parameters must be for the MAKER (match_order) and TAKER (new_order is implicit)
        # Parameters (all from MATCH_ORDER)
        # tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount
        
        trade_tx = contract.functions.trade(
            Web3.to_checksum_address(match_order['tokenGet']), 
            match_order['amountGet'],
            Web3.to_checksum_address(match_order['tokenGive']),
            match_order['amountGive'],
            match_order['expires'],
            match_order['nonce'],
            Web3.to_checksum_address(match_order['user']),
            match_order['v'],
            match_order['r'],
            match_order['s'],
            int(trade_amount) # The amount of the match_order's tokenGive that is being traded
        ).build_transaction({
            'from': RELAYER_ADDRESS,
            'nonce': nonce,
            'gasPrice': gas_price,
            'gas': 500000, # Conservative gas limit for a DEX trade
        })

        # Sign the transaction
        signed_tx = w3.eth.account.sign_transaction(trade_tx, private_key=PRIVATE_KEY)
        
        # Send the transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for the transaction to be mined (optional but good for feedback)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        if receipt['status'] == 1:
            # 4. UPDATE DATABASE (Mark orders as partially or fully filled)
            update_orders_after_match(
                match_order['id'], 
                new_order_data['id'], 
                trade_amount
            )
            
            return {
                "success": True,
                "message": "Trade executed successfully.",
                "txHash": tx_hash.hex(),
                "tradeAmount": str(trade_amount)
            }, HTTPStatus.OK
        else:
            raise Exception("Transaction failed on-chain.")

    except TransactionNotFound:
        return {"success": False, "message": "Transaction submitted but timed out while waiting for confirmation."}, HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        print(f"Trade execution error: {e}")
        return {"success": False, "message": f"Trade execution failed: {str(e)}"}, HTTPStatus.INTERNAL_SERVER_ERROR


# Vercel entry point (handles the POST request from api/order.py)
def handler(request):
    """
    Vercel entry point for the Order Matching Engine.
    Called internally by the /api/order function after an order is saved.
    """
    if request.method != 'POST':
        return {"success": False, "message": "Method Not Allowed"}, HTTPStatus.METHOD_NOT_ALLOWED

    try:
        data = request.json
        
        if not data:
            return {"success": False, "message": "Invalid JSON payload"}, HTTPStatus.BAD_REQUEST

        # We receive the order data that was just saved by /api/order
        # NOTE: This assumes /api/order is correctly passing the full saved order data
        
        response, status = match_and_execute_trade(data)
        return json.dumps(response), status, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Handler general error: {e}")
        return json.dumps({
            "success": False, 
            "message": f"Internal server error: {str(e)}"
        }), HTTPStatus.INTERNAL_SERVER_ERROR
