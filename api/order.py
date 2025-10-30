# lib/order.py

from web3 import Web3
from eth_abi import encode

# Define constants (should match your contract)
ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
ORDER_TYPEHASH = Web3.keccak(text='Order(address maker,address sellToken,address buyToken,uint256 sellAmount,uint256 buyAmount,uint256 expires,uint256 nonce)')

class Order:
    """
    Represents a single trading order with fields matching the smart contract struct.
    """
    def __init__(self, 
                 maker: str, 
                 sellToken: str, 
                 buyToken: str, 
                 sellAmount: int, 
                 buyAmount: int, 
                 expires: int, 
                 nonce: int):
        self.maker = maker
        self.sellToken = sellToken
        self.buyToken = buyToken
        self.sellAmount = sellAmount
        self.buyAmount = buyAmount
        self.expires = expires
        self.nonce = nonce

    def get_hash(self) -> bytes:
        """
        Calculates the EIP-712 compliant hash of the order struct. 
        This is the hash that the user needs to sign off-chain.
        
        NOTE: The encoding and hashing logic MUST perfectly match the smart contract's EIP-712 logic.
        """
        
        # 1. ABI-encode the data fields
        encoded_data = encode(
            # Define the types to match the struct definition exactly
            ['address', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
            # Provide the values in the exact order of the types
            [
                Web3.to_checksum_address(self.maker),
                Web3.to_checksum_address(self.sellToken),
                Web3.to_checksum_address(self.buyToken),
                self.sellAmount,
                self.buyAmount,
                self.expires,
                self.nonce
            ]
        )
        
        # 2. Hash the encoded data
        data_hash = Web3.keccak(encoded_data)
        
        # 3. Hash the TypeHash and the Data Hash (the EIP-712 'struct hash')
        struct_hash = Web3.keccak(ORDER_TYPEHASH + data_hash)
        
        return struct_hash

def hash_order(order: Order) -> str:
    """
    Public utility function to get the hex string of the order hash.
    """
    return order.get_hash().hex()

# Example Usage (for testing purposes)
if __name__ == '__main__':
    # Replace these with real values for testing
    test_order = Order(
        maker='0x1234567890123456789012345678901234567890',
        sellToken='0xC02aaA39b223FE8D0A0e5C4F27EAD9083C756Cc2', # WETH
        buyToken='0x08130635368aa28b217a4dfb68e1bf8dc525621c', # AfroX
        sellAmount=100000000, # 100 WETH (assuming 6 decimals)
        buyAmount=99000000000000000000, # 9019279 Afrox (assuming 18 decimals)
        expires=1678886400, # Example Unix timestamp
        nonce=1
    )
    
    order_hash = hash_order(test_order)
    print(f"Generated Order Hash: 0x{order_hash}")
