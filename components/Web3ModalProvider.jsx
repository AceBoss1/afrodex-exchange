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

export default function Web3ModalProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      createWeb3Modal({
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

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </QueryClientProvider>
  );
}
