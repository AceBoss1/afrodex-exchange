// components/Sidebar.jsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Sidebar({ onCollapse }) {
  const [collapsed, setCollapsed] = useState(false)
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const short = (addr) => (addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '')

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
    if (onCollapse) onCollapse(!collapsed)
  }

  return (
    <aside
      className={`bg-[#141419] text-white rounded-2xl flex flex-col justify-between
      transition-all duration-500 ease-in-out shadow-lg ${collapsed ? 'w-20 px-2' : 'w-64 p-4'}`}
    >
      {/* Logo + Toggle */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/afrodex_logo.jpg"
              alt="AfroDex"
              width={collapsed ? 32 : 40}
              height={collapsed ? 32 : 40}
              className="rounded-full"
            />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">AfroDex</h1>
                <p className="text-xs italic font-bold text-gray-400">Africa&apos;s Biggest DEX</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-orange-400 transition"
          >
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/" className="hover:text-orange-400 flex items-center gap-2">
            🏠 {!collapsed && 'DEX'}
          </Link>
          <a
            href="https://afrodex-staking.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 flex items-center gap-2"
          >
            💎 {!collapsed && 'Stake'}
          </a>
          <Link href="#" className="hover:text-orange-400 flex items-center gap-2">
            🔁 {!collapsed && 'Swap (Coming Soon)'}
          </Link>
          <Link href="#" className="hover:text-orange-400 flex items-center gap-2">
            📘 {!collapsed && 'Trading Guide'}
          </Link>
          <Link href="#" className="hover:text-orange-400 flex items-center gap-2">
            ⚙️ {!collapsed && 'Settings'}
          </Link>
        </nav>
      </div>

      {/* Connect Wallet */}
      <div className="mt-6">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[1] })}
            className="bg-black border border-orange-500 hover:bg-orange-500 hover:text-black 
            text-[#F97316] rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          >
            🔐 {!collapsed && 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="bg-orange-500 hover:bg-orange-600 text-black rounded-lg py-2 px-3 w-full font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          >
            {!collapsed && short(address)} {!collapsed && '• Disconnect'}
            {collapsed && '🔓'}
          </button>
        )}
      </div>

      {/* Footer */}
      <footer
        className={`mt-6 text-center text-xs border-t border-gray-700 text-gray-400 pt-3 ${
          collapsed ? 'text-[9px]' : ''
        }`}
      >
        {!collapsed ? (
          <>
            © 2019–Present <span className="text-orange-500 font-semibold">AFRODEX</span>
            <br />
            ❤️ Donations:{' '}
            <span className="text-orange-400 break-all">
              0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A
            </span>
          </>
        ) : (
          <span className="text-orange-500">©</span>
        )}
      </footer>
    </aside>
  )
}

}
