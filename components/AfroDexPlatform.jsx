'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const SUPPORTED_TOKENS = {
  ETH: { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  AfroX: { symbol: 'AfroX', address: '0x08130635368AA28b217a4dfb68E1bF8dC525621C', decimals: 18 },
  USDT: { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  BUSD: { symbol: 'BUSD', address: '0x4fabb145d64652a948d72533023f6e7a623c7c53', decimals: 6 },
}

const MOCK_MARKETS = [
  { base: 'AfroX', quote: 'ETH', price: '0.000345', change: '+2.15%' },
  { base: 'USDT', quote: 'ETH', price: '0.000259', change: '-0.50%' },
  { base: 'BUSD', quote: 'ETH', price: '0.000258', change: '-0.55%' },
]

export default function AfroDexPlatform({ collapsed = false, onToggle = () => {} }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(collapsed)
  const [selectedMarket, setSelectedMarket] = useState(MOCK_MARKETS[0])
  const [amount, setAmount] = useState('')
  const [activeTab, setActiveTab] = useState('deposit')

  function toggle() {
    const next = !sidebarCollapsed
    setSidebarCollapsed(next)
    onToggle(next)
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              background: 'var(--neon-orange)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'black',
            }}>
              A
            </div>
            {!sidebarCollapsed && (
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

          <button onClick={toggle} style={{ background: 'transparent', border: 'none', color: 'var(--text-gray)', cursor: 'pointer' }}>
            {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="sidebar-item">
            <span>🏠</span>
            <span className="item-text">DEX</span>
          </div>
          <div className="sidebar-item">
            <span>💎</span>
            <span className="item-text">Stake</span>
          </div>
          <div className="sidebar-item">
            <span>📘</span>
            <span className="item-text">Trading Guide</span>
          </div>
        </nav>

        <footer style={{ marginTop: 'auto', textAlign: 'center', fontSize: 12, color: 'var(--text-gray)' }}>
          © 2024 <span style={{ color: 'var(--neon-orange)' }}>AFRODEX</span>
        </footer>
      </aside>

      {/* Main Content */}
      <main className={`main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 20, height: '100%' }}>
          {/* LEFT: Markets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div className="card">
              <h3 className="title-orange">📊 Markets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                {MOCK_MARKETS.map((market) => (
                  <button
                    key={`${market.base}/${market.quote}`}
                    onClick={() => setSelectedMarket(market)}
                    style={{
                      background: selectedMarket.base === market.base ? 'var(--neon-orange)' : 'var(--bg-hover)',
                      color: selectedMarket.base === market.base ? 'black' : 'var(--text-white)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      textAlign: 'left',
                      fontWeight: selectedMarket.base === market.base ? 700 : 500,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{market.base}/{market.quote}</span>
                      <span style={{ color: market.change.startsWith('+') ? '#3dff99' : '#ff4e4e' }}>
                        {market.change}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: 4 }}>{market.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Trading Interface */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div className="card">
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
                {selectedMarket.base}/{selectedMarket.quote}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--neon-orange)' }}>
                  {selectedMarket.price}
                </span>
                <span style={{ color: selectedMarket.change.startsWith('+') ? '#3dff99' : '#ff4e4e' }}>
                  {selectedMarket.change}
                </span>
              </div>
            </div>

            <div className="card">
              <h3 className="title-orange">📊 Order Book</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                <p style={{ marginTop: 10 }}>Connect wallet to view order book</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Swap Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div className="card" style={{ position: 'sticky', top: 0 }}>
              <h3 className="title-orange">🔄 Place Order</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>Amount ({selectedMarket.base})</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ marginTop: 6 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>You will receive</label>
                  <div style={{ background: '#0b0b0e', border: '1px solid var(--border-strong)', padding: '10px', borderRadius: 'var(--radius)', marginTop: 6, color: 'var(--text-white)' }}>
                    {amount && !isNaN(amount) ? (parseFloat(amount) / parseFloat(selectedMarket.price)).toFixed(6) : '0.00'} {selectedMarket.quote}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Price:</span>
                    <span>{selectedMarket.price}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    style={{
                      background: '#3dff99',
                      color: 'black',
                      fontWeight: 700,
                      padding: '12px',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                  >
                    Buy
                  </button>
                  <button
                    style={{
                      background: '#ff4e4e',
                      color: 'white',
                      fontWeight: 700,
                      padding: '12px',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                  >
                    Sell
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--warning)', background: 'rgba(255, 204, 0, 0.15)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>
                  ⚠️ Connect wallet to trade
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
