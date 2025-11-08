// components/Sidebar.jsx
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const short = (addr) => addr?.slice(0, 6) + '...' + addr?.slice(-4)

  return (
    <aside className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between transition-all duration-300 p-4 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/afrodex_logo.jpg" width={36} height={36} alt="AfroDex" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">AfroDex</h1>
                <p className="text-[10px] italic text-gray-400">Africa's Biggest DEX</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-orange-400">
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/" className="hover:text-orange-400">🏦 {!collapsed && 'DEX'}</Link>
          <a href="https://afrodex-staking.vercel.app/" target="_blank" className="hover:text-orange-400">💎 {!collapsed && 'Stake'}</a>
          <span className="opacity-40 cursor-not-allowed">🔄 {!collapsed && 'Swap (Coming Soon)'}</span>
          <Link href="#" className="hover:text-orange-400">📚 {!collapsed && 'Trading Guide'}</Link>
          <Link href="#" className="hover:text-orange-400">⚙️ {!collapsed && 'Settings'}</Link>
        </nav>
      </div>

      {/* CONNECT WALLET */}
      <div className="mt-6">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-orange-500 hover:bg-orange-600 text-black rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2"
          >
            🔐 {collapsed ? '' : 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="bg-black border border-orange-500 text-orange-400 rounded-lg py-2 px-3 w-full font-semibold"
          >
            {collapsed ? '⛔' : `${short(address)} • Disconnect`}
          </button>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <footer className="text-[11px] mt-4 text-center text-gray-500">
          © 2019-Present <span className="text-orange-400 font-semibold">AFRODEX</span><br/>
          ❤️ 0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A
        </footer>
      )}

    </aside>
  )
}
