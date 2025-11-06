import { useEffect } from 'react'
import { createPublicClient, webSocket } from 'viem'
import { mainnet } from 'viem/chains'
import ABI from '../lib/abi.json'

export function useOrderEvents() {
  useEffect(() => {
    const client = createPublicClient({
      chain: mainnet,
      transport: webSocket(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`)
    })

    const unsub = client.watchEvent({
      address: process.env.PUBLIC_CONTRACT_ADDRESS,
      abi: ABI,
      eventName: 'Trade',
      onLogs: (logs) => {
        console.log('New Trade Event', logs)
      }
    })
    return () => unsub()
  }, [])
}
