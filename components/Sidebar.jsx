// components/Sidebar.jsx
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
      </footer>
    </aside>
  )
}
