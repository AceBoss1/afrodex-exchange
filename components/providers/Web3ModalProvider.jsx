<<<<<<< HEAD
"use client"

import { useEffect } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { metaMask, walletConnect } from "wagmi/connectors"
import { createWeb3Modal } from "@web3modal/wagmi/react"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(rpcUrl)
  },
  connectors: [
    metaMask({ shimDisconnect: true }),
    walletConnect({ projectId, showQrModal: true })
  ]
})

const queryClient = new QueryClient()

export default function Web3ModalProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      createWeb3Modal({
        wagmiConfig,
        projectId,
        defaultChain: mainnet,
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#ff6600"
        }
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </QueryClientProvider>
  )
=======
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
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
}
