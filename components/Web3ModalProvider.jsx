"use client";

import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask, walletConnect } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect } from "react";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(rpcUrl)
  },
  connectors: [
    metaMask(),
    walletConnect({ projectId })
  ]
});

const queryClient = new QueryClient();
=======
// components/Web3ModalProvider.jsx
"use client"

import { useEffect } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { metaMask, walletConnect } from "wagmi/connectors"
import { createWeb3Modal } from "@web3modal/wagmi/react"

// Env
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http(rpcUrl || "https://eth.llamarpc.com") },
  connectors: [
    metaMask({ shimDisconnect: true }),
    walletConnect({ projectId, showQrModal: true })
  ]
})

const queryClient = new QueryClient()
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d

export default function Web3ModalProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      createWeb3Modal({
<<<<<<< HEAD
        projectId,
        wagmiConfig,
        defaultChain: mainnet,
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#ff7b1c"
        }
      });
    }
  }, []);
=======
        wagmiConfig,
        projectId,
        defaultChain: mainnet,
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#ff7a18",
          "--w3m-background-color": "#141419"
        }
      })
    }
  }, [])
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </QueryClientProvider>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
}
