'use client'

import { useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'
import AfroDexPlatform from '@/components/AfroDexPlatform'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'default'
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'demo'

const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: alchemyKey }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'AfroDex',
  projectId,
  chains,
})

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
})

const queryClient = new QueryClient()

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <AfroDexPlatform collapsed={collapsed} onToggle={setCollapsed} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
