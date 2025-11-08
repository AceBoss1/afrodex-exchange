// components/Sidebar.jsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Sidebar({ onSelect }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} p-4`}>
      {/* Logo and toggle */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/afrodex_logo.jpg" alt="AfroDex" width={36} height={36} className="rounded-full" />
            {!collapsed && <h1 className="text-lg font-semibold">AfroDex</h1>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-orange-400">
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="hover:text-orange-400">🏠 {collapsed ? '' : 'Markets'}</Link>
          <a href="https://afrodex-staking.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
            💎 {collapsed ? '' : 'Stake'}
          </a>
          <Link href="#history" className="hover:text-orange-400">📈 {collapsed ? '' : 'Trade History'}</Link>
          <Link href="#" className="hover:text-orange-400">⚙️ {collapsed ? '' : 'Settings'}</Link>
        </nav>
      </div>

      {/* Wallet Connect Button */}
      <div className="mt-6">
        <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-3 w-full font-semibold">
          {collapsed ? '💰' : 'Connect Wallet'}
        </button>
      </div>

      {/* Footer */}
        <footer className="p-4 text-center text-xs border-t border-gray-700 text-gray-400">
          © 2019-Present <span className="text-orange">AFRODEX</span>. All rights reserved<br/>
          ❤️ Donations: <span className="text-orange">0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A</span>
        </footer>
      </aside>
  )
}
