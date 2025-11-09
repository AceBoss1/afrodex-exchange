// components/Sidebar.jsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const short = (addr) => addr?.slice(0, 6) + "..." + addr?.slice(-4);

  return (
    <aside
      className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between transition-all duration-300 p-4 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo + Tagline */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/afrodex_logo.jpg"
              alt="AfroDex"
              width={36}
              height={36}
              className="rounded-full"
            />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">AfroDex</h1>
                <p className="text-xs italic font-bold text-gray-400 -mt-1">
                  Africa’s Biggest DEX
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-orange-400"
          >
            {collapsed ? "⮞" : "⮜"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="hover:text-orange-400">
            🏠 {collapsed ? "" : "DEX"}
          </Link>
          <a
            href="https://afrodex-staking.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400"
          >
            💎 {collapsed ? "" : "Stake"}
          </a>
          <Link href="#" className="hover:text-orange-400">
            🔁 {collapsed ? "" : "Swap (Coming Soon)"}
          </Link>
          <Link href="#" className="hover:text-orange-400">
            📘 {collapsed ? "" : "Trading Guide"}
          </Link>
          <Link href="#" className="hover:text-orange-400">
            ⚙️ {collapsed ? "" : "Settings"}
          </Link>
        </nav>
      </div>

      {/* Connect Wallet Button */}
      <div className="mt-6">
        {!isConnected ? (
          <button
            onClick={() => open()}
            className="bg-black border border-orange-500 text-[#F97316] rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2"
          >
            🔐 Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => open()}
            className="bg-orange-500 hover:bg-orange-600 text-black rounded-lg py-2 px-3 w-full font-semibold"
          >
            {short(address)}
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs border-t border-gray-700 text-gray-400">
        © 2019–Present <span className="text-orange-400">AFRODEX</span>. All rights reserved.
        <br />
        ❤️ Donations:{" "}
        <span className="text-orange-400">
          0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A
        </span>
      </footer>
    </aside>
  );
}
