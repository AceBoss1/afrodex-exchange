# lib/nounce.py

from typing import Optional
from web3 import Web3 # Assuming you use Web3 to interact with the blockchain

# Placeholder for your contract instance utility (similar to Next.js file)
def get_contract_instance():
    """
    Returns the instantiated smart contract object.
    (This is a placeholder and should contain the logic to connect to the contract.)
    """
    # Replace with actual contract connection logic
    # Example: w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL'))
    # contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    return None 

def get_user_nonce(user_address: str) -> int:
    """
    Retrieves the current nonce for a given user's address from the smart contract.
    The nonce is used to sign orders and prevent replay attacks.
    
    Args:
        user_address: The wallet address of the user.

    Returns:
        The current nonce as an integer.
    """
    try:
        # Get your smart contract instance
        contract = get_contract_instance()
        
        if contract is None:
            # In a real app, this should raise an error if contract is not available
            print("Error: Smart contract instance not available.")
            return 0 

        # Assuming your contract has a view function called 'nonces' 
        # that maps addresses to their current nonce value.
        nonce = contract.functions.nonces(user_address).call()
        
        return nonce

    except Exception as e:
        print(f"Error fetching nonce for {user_address}: {e}")
        # Return 0 or raise the exception depending on your error handling strategy
        return 0
