'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null // ✅ Fixes hydration mismatch

  const short = (addr) => addr?.slice(0, 6) + '...' + addr?.slice(-4)

  return (
    <aside className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between transition-all duration-300 p-4 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo + Collapse Button */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/afrodex_logo.jpg" alt="AfroDex" width={36} height={36} className="rounded-full" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">AfroDex</h1>
                <p className="text-xs italic text-gray-400">Africa's Biggest DEX</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-orange-400">
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/" className="hover:text-orange-400">🏦 {!collapsed && 'Dex'}</Link>
          <a href="https://afrodex-staking.vercel.app/" target="_blank" className="hover:text-orange-400">💎 {!collapsed && 'Stake'}</a>
          <button disabled className="text-gray-500 cursor-not-allowed">🔄 {!collapsed && 'Swap (coming soon)'}</button>
          <Link href="/guide" className="hover:text-orange-400">📘 {!collapsed && 'Trading Guide'}</Link>
          <Link href="/settings" className="hover:text-orange-400">⚙️ {!collapsed && 'Settings'}</Link>
        </nav>
      </div>

      {/* Wallet Connect */}
      <div className="mt-6">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors.find(c => c.id === 'walletConnect') })}
            className="bg-black border border-orange-500 text-[#F97316] rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2"
          >
            🔐 {!collapsed && 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="bg-black border border-red-500 text-red-400 rounded-lg py-2 px-3 w-full font-semibold"
          >
            {collapsed ? '⛔' : `${short(address)} • Disconnect`}
          </button>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <footer className="pt-4 text-center text-xs text-gray-400 border-t border-white/5">
          © 2019-Present <span className="text-orange-400 font-semibold">AFRODEX</span><br/>
          ❤️ 0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A
        </footer>
      )}
    </aside>
  )
}
