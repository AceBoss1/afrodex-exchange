// components/Sidebar.jsx
<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Home,
  Diamond,
  Repeat,
  BookOpen,
  Settings,
  Lock,
  Wallet as WalletIcon,
  Menu,
  X,
} from 'lucide-react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function Sidebar({ collapsed = false, onToggle = () => {} }) {
  const [isCollapsed, setIsCollapsed] = useState(Boolean(collapsed))
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { openConnectModal } = useConnectModal()

  useEffect(() => {
    setIsCollapsed(Boolean(collapsed))
  }, [collapsed])

  function toggle() {
    const next = !isCollapsed
    setIsCollapsed(next)
    onToggle(next)
    // close settings on collapse
    if (next) setSettingsOpen(false)
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/afrodex_logo.jpg" width={36} height={36} alt="AfroDex" style={{ borderRadius: 8 }} />
          {!isCollapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>
                <span style={{ color: 'var(--neon-orange)' }}>Afro</span>DEX
              </div>
              <div style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 11, color: 'var(--text-gray)' }}>
                Africa's Biggest DEX
              </div>
            </div>
          )}
        </div>

        <button onClick={toggle} aria-label="Toggle sidebar" className="btn-icon" style={{ background: 'transparent', border: 'none', color: 'var(--text-gray)' }}>
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="sidebar-item" role="button" tabIndex={0}>
          <Home className="icon" />
          <span className="item-text">DEX</span>
        </div>

        <a href="https://afrodex-staking.vercel.app/" target="_blank" rel="noreferrer" className="sidebar-item">
          <Diamond className="icon" />
          <span className="item-text">Stake</span>
        </a>

        <div className="sidebar-item" title="Coming soon">
          <Repeat className="icon" />
          <span className="item-text">Swap (Coming Soon)</span>
        </div>

        <div className="sidebar-item">
          <BookOpen className="icon" />
          <span className="item-text">Trading Guide</span>
        </div>

        <div className="sidebar-item" onClick={() => setSettingsOpen(s => !s)} style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Settings className="icon" />
            <span className="item-text">Settings</span>
          </div>
          {!isCollapsed && <span style={{ fontSize: 12, color: 'var(--text-gray)' }}>{settingsOpen ? '▾' : '▸'}</span>}
        </div>

        {/* Settings children */}
        {settingsOpen && !isCollapsed && (
          <div style={{ paddingLeft: 12, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => openConnectModal?.()}
              className="btn-primary"
              style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Lock size={14} />
              <WalletIcon size={14} />
              <span>Connect Wallet</span>
            </button>
          </div>
        )}
      </nav>

      <footer style={{ marginTop: 'auto', textAlign: 'center', fontSize: 12, color: 'var(--text-gray)' }}>
        © 2019-Present <span style={{ color: 'var(--neon-orange)'}}>AFRODEX</span><br />
        Donations: <span style={{ color: 'var(--neon-orange)' }}>0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A</span>
=======
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
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
      </footer>
    </aside>
  )
}

}
