"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function WalletButton({ collapsed }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  return (
    <button
      onClick={() => open()}
      className="
        w-full bg-[#ff7b1c] text-black font-bold 
        py-2 rounded-md shadow-md hover:bg-[#ffa24a] transition
      "
    >
      {isConnected
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : collapsed
        ? "…"
        : "Connect Wallet"}
    </button>
  );
}
