import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import AfroDexABI from './abi/AfroDexABI.json'

const CONTRACT_ADDRESS = '0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.REACT_APP_RPC_URL || 'https://eth-llamarpc.com'),
})

// Read balances
export async function getBalance(userAddress, token) {
  return await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: AfroDexABI,
    functionName: 'balanceOf',
    args: [token, userAddress],
  })
}

// Get orderbook
export async function getOrderBook(tokenGet, tokenGive) {
  // Implement based on your contract's functions
}
