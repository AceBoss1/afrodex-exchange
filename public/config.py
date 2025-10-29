import os

# ----------------------------------------------------------------------
# 1. DATABASE CONFIGURATION (Supabase Migration)
# ----------------------------------------------------------------------

# WARNING: The actual connection string should be set as an environment 
# variable named 'DATABASE_URL' on your hosting platform (Render/Vercel).
# This provides security and flexibility.

# Safely get the database URL. If the environment variable is NOT set, 
# it falls back to the placeholder URL.
DATABASE_URL = os.getenv(
    'DATABASE_URL', 
    'postgresql://postgres:postgresql://postgres:m$X3Q5q-.mSzKEJ@db.rrqdkozbnqxaneuvuvxq.supabase.co:5432/postgres'
)

# ----------------------------------------------------------------------
# 2. BLOCKCHAIN CONFIGURATION (AfroDEX Operational)
# ----------------------------------------------------------------------

# Your RPC node URL (Alchemy, Infura, etc.) for the blockchain listener.
# If targeting Ethereum Mainnet, ensure this URL points to a Mainnet provider.
# Updated to use Alchemy's common URL structure as a placeholder.
RPC_NODE_URL = os.getenv(
    'RPC_NODE_URL', 
    'https://eth-mainnet.g.alchemy.com/v2/QBlE7l38OhjxW7iqdJhu_' 
)

# Address of the deployed AfroDEX Exchange Smart Contract
EXCHANGE_CONTRACT_ADDRESS = os.getenv(
    'EXCHANGE_CONTRACT_ADDRESS', 
    '0xE8FfF15bB5E14095bFdfA8Bb85D83cC900c23C56'
)

# Network ID for Web3 utility (1 = Ethereum Mainnet)
NETWORK_ID = int(os.getenv('NETWORK_ID', 1))

# ----------------------------------------------------------------------
# 3. BACKEND SERVER CONFIG
# ----------------------------------------------------------------------

# The server port (e.g., 8000 for FastAPI/Flask)
SERVER_PORT = int(os.getenv('SERVER_PORT', 8000))

# Environment flag (e.g., 'development' or 'production')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
