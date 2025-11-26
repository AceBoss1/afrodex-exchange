'use client'

import '@/styles/globals.css'
import { ReactNode } from 'react'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || ''

// Configure chains
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: alchemyKey }),
    publicProvider(),
  ]
)

// Get wallets
const { connectors } = getDefaultWallets({
  appName: 'AfroDex',
  projectId,
  chains,
})

// Create wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>AfroDex - Africa's Biggest DEX</title>
        <meta name="description" content="AfroDex Decentralized Exchange" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0b0b0f] text-white">
        <WagmiConfig client={wagmiClient}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider chains={chains}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
