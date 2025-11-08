// pages/_app.js
import '@/styles/globals.css'
import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wallet'   // <-- your wagmi config file
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </QueryClientProvider>
  )
}
