import useAfroDexContract from './useAfroDexContract'
import { parseUnits } from 'ethers/lib/utils'
import { useAccount } from 'wagmi'

export function useOrder() {
  const { write } = useAfroDexContract()
  const { address } = useAccount()

  async function placeOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce) {
    try {
      const tx = await write.order(tokenGet, parseUnits(amountGet, 18), tokenGive, parseUnits(amountGive, 18), expires, nonce)
      await tx.wait()
      console.log('✅ Order placed')
      return tx
    } catch (e) {
      console.error('❌ Order failed', e)
    }
  }

  return { placeOrder }
}
