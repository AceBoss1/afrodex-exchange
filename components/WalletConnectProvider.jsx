// components/WagmiProvider.jsx
import { WagmiConfig } from 'wagmi'
import { wagmiClient } from '../lib/wagmiClient'

export default function WagmiProvider({ children }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
