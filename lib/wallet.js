import { http, createConfig } from 'wagmi'
import { mainnet } from 'viem/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'
import { createPublicClient } from 'viem'

// Required for WalletConnect v3
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId,
      metadata: {
        name: 'AfroDex DEX',
        description: 'Africa’s Biggest DEX',
        url: 'https://afrodex.vercel.app',
        icons: ['https://afrodex.vercel.app/favicon.ico'],
      },
    }),
    coinbaseWallet({ appName: 'AfroDex DEX' }),
  ],
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  }),
})
