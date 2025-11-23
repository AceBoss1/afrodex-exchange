// lib/wallet.js
import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    ),
  },
})
