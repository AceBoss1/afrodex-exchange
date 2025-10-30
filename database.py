import os
import time
from firestore_helpers import get_firestore_client, get_collection_path
from google.cloud.firestore import Client, transactional
from google.cloud.firestore_v1.base_query import FieldFilter, Query, Direction
from decimal import Decimal

# --- INITIALIZATION ---
# Assumes get_firestore_client() is defined in firestore_helpers.
# NOTE: In a real Vercel environment, this client setup needs to be robust,
# potentially initializing a global client instance for performance.
db_client: Client = get_firestore_client()
app_id = os.environ.get("AFRODEX_APP_ID", "default-afrodex-app-id")

# --- FILE-SPECIFIC CONSTANTS ---
# Using the public collection path where all orders are saved
ORDERS_COLLECTION = get_collection_path(app_id, "public", "orders")

# --- ORDER MATCHING FUNCTIONS (Existing Core Logic) ---

def get_orders_for_matching(token_get: str, token_give: str, max_price_ratio: float):
    """
    Queries the database for open orders that match the counter-party tokens
    and have a favorable price (best price first).
    """
    # 1. Filter by status (must be open)
    q = db_client.collection(ORDERS_COLLECTION).where(filter=FieldFilter("status", "==", "OPEN"))
    
    # 2. Filter by counter-tokens: the existing order must be SELL_tokenGive for BUY_tokenGet
    q = q.where(filter=FieldFilter("tokenGet", "==", token_get))
    q = q.where(filter=FieldFilter("tokenGive", "==", token_give))
    
    # 3. Filter by price: existing price must be <= max_price_ratio
    # The price is defined as amountGive / amountGet
    q = q.where(filter=FieldFilter("price_ratio", "<=", max_price_ratio)) 
    
    # Order by best price for the new order (taker)
    q = q.order_by("price_ratio", direction=Direction.DESCENDING) 
    q = q.limit(10) # Limit to the top 10 matches to process

    orders = []
    try:
        docs = q.stream()
        for doc in docs:
            order_data = doc.to_dict()
            order_data['id'] = doc.id
            orders.append(order_data)
        return orders
    except Exception as e:
        print(f"Error fetching matching orders: {e}")
        return []

@transactional
def update_orders_after_match(transaction, maker_order_id: str, taker_order_id: str, trade_amount: int):
    """
    Updates the fill status of two orders within a single Firestore transaction
    after a successful trade execution on the smart contract.
    """
    orders_ref = db_client.collection(ORDERS_COLLECTION)
    
    maker_ref = orders_ref.document(maker_order_id)
    taker_ref = orders_ref.document(taker_order_id)
    
    # Fetch documents within the transaction
    maker_doc = maker_ref.get(transaction=transaction)
    taker_doc = taker_ref.get(transaction=transaction)
    
    if not maker_doc.exists or not taker_doc.exists:
        raise Exception("One or both orders not found during transaction.")

    # Simple logic: mark both as filled for this version
    maker_fill_amount = maker_doc.to_dict().get("fillAmount", 0) + trade_amount
    taker_fill_amount = taker_doc.to_dict().get("fillAmount", 0) + trade_amount
    
    # Update Maker
    transaction.update(maker_ref, {
        "status": "FILLED",
        "fillAmount": maker_fill_amount,
        "updatedAt": int(time.time())
    })
    
    # Update Taker
    transaction.update(taker_ref, {
        "status": "FILLED",
        "fillAmount": taker_fill_amount,
        "updatedAt": int(time.time())
    })
    
    print(f"Orders {maker_order_id} and {taker_order_id} updated with trade amount {trade_amount}")


# --- NEW ORDER BOOK FEED FUNCTIONS ---

def get_open_orders_for_pair(token_get: str, token_give: str, is_bid: bool, limit=50):
    """
    Fetches open orders for the Order Book (Bids or Asks).
    
    Bids (Buy): tokenGet=B, tokenGive=A. Sort price (B/A) DESC.
    Asks (Sell): tokenGet=A, tokenGive=B. Sort price (B/A) ASC.
    """
    q = db_client.collection(ORDERS_COLLECTION).where(filter=FieldFilter("status", "==", "OPEN"))
    
    # Filter by the token pair
    q = q.where(filter=FieldFilter("tokenGet", "==", token_get))
    q = q.where(filter=FieldFilter("tokenGive", "==", token_give))
    
    # Determine sort direction based on whether it's a Bid or Ask (price_ratio is amountGive/amountGet)
    if is_bid:
        # Bids (Buy orders): highest price (best deal for seller) first
        q = q.order_by("price_ratio", direction=Direction.DESCENDING)
    else:
        # Asks (Sell orders): lowest price (best deal for buyer) first
        q = q.order_by("price_ratio", direction=Direction.ASCENDING)
    
    q = q.limit(limit)

    orders = []
    try:
        docs = q.stream()
        for doc in docs:
            order_data = doc.to_dict()
            order_data['id'] = doc.id
            orders.append(order_data)
        return orders
    except Exception as e:
        print(f"Error fetching open orders: {e}")
        return []

def get_trade_history_for_pair(token_a: str, token_b: str, limit=50):
    """
    Fetches the most recent FILLED orders involving the two tokens.
    Uses separate queries to handle the OR condition on token pairs.
    """
    # Query 1: Trades where A is GIVEN and B is GOT
    q1 = db_client.collection(ORDERS_COLLECTION).where(filter=FieldFilter("status", "==", "FILLED"))
    q1 = q1.where(filter=FieldFilter("tokenGive", "==", token_a))
    q1 = q1.where(filter=FieldFilter("tokenGet", "==", token_b))
    
    # Query 2: Trades where B is GIVEN and A is GOT
    q2 = db_client.collection(ORDERS_COLLECTION).where(filter=FieldFilter("status", "==", "FILLED"))
    q2 = q2.where(filter=FieldFilter("tokenGive", "==", token_b))
    q2 = q2.where(filter=FieldFilter("tokenGet", "==", token_a))
    
    all_trades = []
    try:
        # Fetch results and combine
        for doc in q1.stream():
            trade_data = doc.to_dict()
            trade_data['id'] = doc.id
            all_trades.append(trade_data)
        
        for doc in q2.stream():
            trade_data = doc.to_dict()
            trade_data['id'] = doc.id
            all_trades.append(trade_data)
            
        # Sort all trades by the time they were filled (newest first)
        all_trades.sort(key=lambda x: x.get('updatedAt', 0), reverse=True)
        
        return all_trades[:limit]
    except Exception as e:
        print(f"Error fetching trade history: {e}")
        return []
