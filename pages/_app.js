import "@/styles/globals.css";
import { useState } from "react";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { walletConnect } from "wagmi/connectors";

// ✅ Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ✅ Initialize React Query Client
const queryClient = new QueryClient();

// ✅ Create Wagmi Configuration (Ethereum Mainnet)
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "AfroDex Exchange",
        description: "Africa’s Biggest DEX",
        url: process.env.NEXT_PUBLIC_API_URL,
        icons: ["https://afrodex-exchange.vercel.app/afrodex_logo.jpg"],
      },
    }),
  ],
  ssr: true, // allows SSR hydration without mismatch
});

// ✅ App Wrapper
export default function App({ Component, pageProps }) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <WagmiConfig config={wagmiConfig}>
        {/* ✅ Optionally expose Supabase globally */}
        <Component {...pageProps} supabase={supabase} />
      </WagmiConfig>
    </QueryClientProvider>
  );
}
