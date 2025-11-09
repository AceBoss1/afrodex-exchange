import "@/styles/globals.css";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { walletConnect } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ✅ Initialize React Query
const queryClient = new QueryClient();

// ✅ Create Wagmi Config
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      showQrModal: false, // Web3Modal will handle the modal
      metadata: {
        name: "AfroDex Exchange",
        description: "Africa’s Biggest DEX",
        url: process.env.NEXT_PUBLIC_API_URL,
        icons: ["https://afrodex-exchange.vercel.app/afrodex_logo.jpg"],
      },
    }),
  ],
  ssr: true,
});

// ✅ Initialize Web3Modal with Wagmi config
createWeb3Modal({
  wagmiConfig,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  themeVariables: {
    "--w3m-accent": "#f97316",
    "--w3m-background": "#0b0b0f",
  },
});

// ✅ Main App Component
export default function App({ Component, pageProps }) {
  const [client] = useState(() => queryClient);

  // optional log for debugging
  useEffect(() => {
    console.log("WalletConnect Project ID:", process.env.NEXT_PUBLIC_WC_PROJECT_ID);
  }, []);

  return (
    <QueryClientProvider client={client}>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} supabase={supabase} />
      </WagmiConfig>
    </QueryClientProvider>
  );
}
