import '@/styles/globals.css'
import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wallet'

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
