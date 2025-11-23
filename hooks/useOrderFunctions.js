// hooks/useOrderFunctions.js
import { useCallback } from 'react'
import { useWriteContract } from 'wagmi'
import AfroDexABI from '@/lib/abi/AfroDexABI.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

/**
 * React hook for AfroDex contract write functions
 * Works with wagmi v2 + viem
 */
export default function useOrderFunctions() {
  const { writeContractAsync } = useWriteContract()

  // Create a new order on the DEX
  const order = useCallback(async (tokenGet, amountGet, tokenGive, amountGive, expires, nonce) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: AfroDexABI,
        functionName: 'order',
        args: [tokenGet, amountGet, tokenGive, amountGive, expires, nonce],
      })
      console.log('Order placed:', tx)
      return tx
    } catch (err) {
      console.error('Error creating order:', err)
    }
  }, [writeContractAsync])

  // Execute a trade
  const trade = useCallback(async (tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: AfroDexABI,
        functionName: 'trade',
        args: [tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount],
      })
      console.log('Trade executed:', tx)
      return tx
    } catch (err) {
      console.error('Error executing trade:', err)
    }
  }, [writeContractAsync])

  // Cancel an order
  const cancelOrder = useCallback(async (tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: AfroDexABI,
        functionName: 'cancelOrder',
        args: [tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s],
      })
      console.log('Order canceled:', tx)
      return tx
    } catch (err) {
      console.error('Error canceling order:', err)
    }
  }, [writeContractAsync])

  return { order, trade, cancelOrder }
}
