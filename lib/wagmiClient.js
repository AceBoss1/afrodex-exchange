// lib/wagmiClient.js
import { createClient, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { mainnet } from 'viem/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit' // optional if you want rainbowkit UI
import { connectorsForWallets } from '@rainbow-me/rainbowkit/wallets'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID

// configure chains — default to mainnet
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: ALCHEMY_KEY }),
    publicProvider()
  ]
)

// Basic connectors: Injected + WalletConnect
const connectors = [
  new (await import('wagmi/connectors/injected')).InjectedConnector({ chains }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: WC_PROJECT_ID,
      showQrModal: true,
    },
  }),
]

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})
