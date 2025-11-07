// pages/_app.js
import '../styles/globals.css'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet } from 'viem/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicClient } from 'viem'
import Layout from '../components/Sidebar'

const ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const WC_PROJECT = process.env.NEXT_PUBLIC_WC_PROJECT_ID

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: ALCHEMY }), publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new (await import('wagmi/connectors/injected')).InjectedConnector({ chains }),
    new WalletConnectConnector({ chains, options: { projectId: WC_PROJECT } })
  ],
  publicClient: provider,
  webSocketPublicClient: webSocketProvider,
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  )
}
