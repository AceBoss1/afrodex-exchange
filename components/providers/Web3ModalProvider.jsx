// components/providers/Web3ModalProvider.jsx
"use client"

import { useEffect } from "react"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { mainnet } from "viem/chains"
import { http, WagmiConfig, createConfig } from "wagmi"

// --- Wagmi Configuration ---
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  ssr: true,
})

// --- Web3Modal Setup ---
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  console.warn("⚠️ WalletConnect Project ID missing. Set NEXT_PUBLIC_WC_PROJECT_ID in .env.local")
}

createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: mainnet,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#F97316",
    "--w3m-font-family": "Poppins, sans-serif",
    "--w3m-accent": "#F97316",
  },
})

export default function Web3ModalProvider({ children }) {
  useEffect(() => {
    console.log("✅ Web3Modal Initialized")
  }, [])

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
