import json
from http import HTTPStatus
from database import get_open_orders_for_pair, get_trade_history_for_pair
from decimal import Decimal

# Helper function to convert large integers/decimals for JSON serialization
def serialize_order(order):
    """Converts Decimal objects and large integers in an order dictionary to strings."""
    for key, value in order.items():
        if isinstance(value, Decimal):
            order[key] = str(value)
        elif isinstance(value, int) and value > 2**53: # Handle large numbers if not using Decimal
            order[key] = str(value)
    return order

def handler(request):
    """
    Vercel entry point for the Order Book and Trade History Feed.
    Supports GET requests with query parameters.
    """
    if request.method != 'GET':
        return {"success": False, "message": "Method Not Allowed"}, HTTPStatus.METHOD_NOT_ALLOWED

    try:
        # 1. Extract Query Parameters
        query_params = request.args
        
        token_a = query_params.get('tokenA')
        token_b = query_params.get('tokenB')
        feed_type = query_params.get('type', 'orderbook') # 'orderbook' or 'history'

        if not token_a or not token_b:
            return json.dumps({
                "success": False, 
                "message": "Missing required parameters: tokenA and tokenB."
            }), HTTPStatus.BAD_REQUEST

        if feed_type == 'orderbook':
            # 2. Fetch Open Order Book
            # Fetch Buy orders (Bids): buying tokenB with tokenA
            # Fetch Sell orders (Asks): selling tokenB for tokenA
            
            # Note: We group the orders into Bids (Buy) and Asks (Sell)
            
            # BIDS: Users offering to GIVE tokenA to GET tokenB
            bids = get_open_orders_for_pair(
                token_get=token_b, 
                token_give=token_a,
                is_bid=True # Sort price descending
            )
            
            # ASKS: Users offering to GIVE tokenB to GET tokenA
            asks = get_open_orders_for_pair(
                token_get=token_a, 
                token_give=token_b,
                is_bid=False # Sort price ascending
            )
            
            # 3. Aggregate and Format Response
            response_data = {
                "success": True,
                "tokenA": token_a,
                "tokenB": token_b,
                # Format for frontend display (price/amount aggregation is deferred to frontend for simplicity)
                "bids": [serialize_order(order) for order in bids],
                "asks": [serialize_order(order) for order in asks],
                "timestamp": int(time.time() * 1000)
            }
        
        elif feed_type == 'history':
            # 4. Fetch Trade History
            history = get_trade_history_for_pair(token_a, token_b)
            
            response_data = {
                "success": True,
                "tokenA": token_a,
                "tokenB": token_b,
                "history": [serialize_order(order) for order in history],
                "timestamp": int(time.time() * 1000)
            }

        else:
            return json.dumps({
                "success": False, 
                "message": "Invalid feed type. Must be 'orderbook' or 'history'."
            }), HTTPStatus.BAD_REQUEST
        
        return json.dumps(response_data), HTTPStatus.OK, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Orderbook handler error: {e}")
        return json.dumps({
            "success": False, 
            "message": f"Internal server error: {str(e)}"
        }), HTTPStatus.INTERNAL_SERVER_ERROR
