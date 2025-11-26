'use client'

import '@/styles/globals.css'
import { ReactNode } from 'react'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

const { connectors } = getDefaultWallets({
  appName: 'AfroDex',
  projectId,
  chains: [mainnet],
})

const config = createConfig({
  connectors,
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || 
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    ),
  },
})

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>AfroDex - Africa's Biggest DEX</title>
        <meta name="description" content="AfroDex Decentralized Exchange" />
      </head>
      <body className="bg-[#0b0b0f] text-white">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
