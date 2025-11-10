"use client";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Wallet, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function BalanceCard({ market }) {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState("Deposit");

  const balanceData = [
    { token: market.base, wallet: "0.000", dex: "0.000" },
    { token: market.quote, wallet: "0.000", dex: "0.000" },
  ];

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-orange-400 font-semibold flex items-center gap-2">
          <Wallet size={18} /> BALANCE
        </h4>
        <div className="flex gap-2 text-xs">
          {["Deposit", "Withdraw", "Transfer"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                tab === t
                  ? "bg-orange-500 text-black"
                  : "bg-black text-orange-400 border border-orange-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Balance Table */}
      <div className="text-sm text-gray-300 border-t border-white/10 pt-3">
        <div className="grid grid-cols-3 font-semibold mb-1 text-gray-400">
          <span>Token</span>
          <span>Wallet</span>
          <span>AfroDex</span>
        </div>
        {balanceData.map((b, i) => (
          <div key={i} className="grid grid-cols-3 py-1">
            <span>{b.token}</span>
            <span>{b.wallet}</span>
            <span>{b.dex}</span>
          </div>
        ))}
      </div>

      {/* ⚠️ Token Warning */}
      <div className="mt-4 text-xs text-yellow-400 flex gap-2 items-center">
        <AlertTriangle size={14} />
        Make sure <strong>{market.base}</strong> is the token you intend to {tab.toLowerCase()}.
        Multiple tokens can share the same name.
      </div>
    </div>
  );
}
