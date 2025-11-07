// components/Sidebar.jsx
import React, { useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex min-h-screen">
      <aside className={`bg-transparent ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/afrodex_logo.jpg" alt="logo" className={`h-10 ${collapsed ? 'hidden' : 'block'}`} />
            {!collapsed && <div><div className="text-2xl font-extrabold text-orange">Afro<span className="text-white">DEX</span></div>
            <div className="text-xs text-gray-400">Africa's Biggest DEX</div></div>}
          </div>
          <button onClick={()=>setCollapsed(!collapsed)} className="p-2 rounded-md border border-white/6 text-gray-300 hover:bg-white/3">☰</button>
        </div>

        <nav className="px-3 mt-4 space-y-2">
          <div className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>🧭</span>{!collapsed && <span>Trade</span>}
          </div>
          <div onClick={()=>window.open('https://afrodex-staking.vercel.app/','_blank')} className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>💎</span>{!collapsed && <span>Stake</span>}
          </div>
          <div className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>🔁</span>{!collapsed && <span>Swap</span>}
          </div>
          <div className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>🔐</span>{!collapsed && <span>Connect Wallet</span>}
          </div>
          <div className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>📖</span>{!collapsed && <span>Read Guide Document</span>}
          </div>
          <div className="px-3 py-2 rounded-md text-gray-200 hover:bg-white/2 flex items-center gap-2 cursor-pointer">
            <span>⚙️</span>{!collapsed && <span>Settings</span>}
          </div>
        </nav>

        <footer className="p-4 text-center text-xs border-t border-gray-700 text-gray-400">
          © 2019-Present <span className="text-orange">AFRODEX</span>. All rights reserved<br/>
          ❤️ Donations: <span className="text-orange">0xC54f68D1eD99e0B51C162F9a058C2a0A88D2ce2A</span>
        </footer>
      </aside>

      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
