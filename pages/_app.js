// pages/_app.js
import "@/styles/globals.css";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { walletConnect, coinbaseWallet, metaMask } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!projectId) throw new Error("❌ WalletConnect Project ID missing!");

/** ✅ Create Wagmi Config */
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ||
        `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
    ),
  },
  connectors: [
    walletConnect({ projectId }),
    metaMask(),
    coinbaseWallet({ appName: "AfroDex Exchange" }),
  ],
  ssr: true,
});

/** ✅ Initialize Web3Modal */
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeVariables: {
    "--w3m-accent": "#f97316",
    "--w3m-background-color": "#141419",
  },
});

/** ✅ Initialize Supabase */
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} supabase={supabase} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}
