// components/Sidebar.jsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <aside
      className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between transition-all duration-300 
      ${collapsed ? 'w-20' : 'w-64'} p-4`}
    >
      {/* Logo and toggle */}
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
                <h1 className="text-lg font-semibold leading-tight">AfroDex</h1>
                <p className="text-xs italic font-semibold text-gray-400">
                  Africa&apos;s Biggest DEX
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-orange-400"
          >
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="hover:text-orange-400">
            🏦 {collapsed ? '' : 'Dex'}
          </Link>

          <a
            href="https://afrodex-staking.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400"
          >
            💎 {collapsed ? '' : 'Stake'}
          </a>

          <button
            disabled
            className="text-gray-400 cursor-not-allowed text-left"
            title="Coming soon"
          >
            🔁 {collapsed ? '' : 'Swap (Coming Soon)'}
          </button>

          <Link href="#" className="hover:text-orange-400">
            📘 {collapsed ? '' : 'Trading Guide'}
          </Link>

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="hover:text-orange-400 text-left"
          >
            ⚙️ {collapsed ? '' : 'Settings'}
          </button>

          {/* Connect Wallet (inside settings toggle) */}
          {settingsOpen && !collapsed && (
            <div className="mt-2 pl-5">
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2">
                🔐 Connect Wallet
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs border-t border-gray-700 text-gray-400 pt-3 mt-4">
        © 2019-Present <span className="text-orange-400">AFRODEX</span>.<br />
        All rights reserved ❤️<br />
        Donations:{' '}
        <span className="text-orange-400">
          0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A
        </span>
      </footer>
    </aside>
  )
}
