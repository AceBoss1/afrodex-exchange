'use client'

import { useState } from 'react'

export default function BalanceCard({ market = null, token = null }) {
  const [tab, setTab] = useState('Deposit')
  const [amount, setAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')

  const selected = token
    ? token
    : market
    ? { symbol: market.base, address: market.address, decimals: market.decimals ?? 18 }
    : { symbol: 'ETH', address: null, decimals: 18 }

  return (
    <div className="bg-[#141419] rounded-2xl p-4 text-sm border border-[rgba(255,255,255,0.05)]">
      <h3 className="text-[#F97316] font-semibold mb-3">Balance & Transactions</h3>

      <div className="flex gap-2 mb-3">
        {['Deposit', 'Withdraw', 'Transfer'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              tab === t ? 'bg-white text-black' : 'bg-[#ff7a1a] text-black/90'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-black/40 p-2 rounded-md mb-3 text-xs text-yellow-300">
        ⚠️ Make sure <span className="text-white font-bold">{selected.symbol}</span> is the correct token.
      </div>

      <div className="mb-2">
        <label className="text-xs text-gray-400">Amount ({selected.symbol})</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full mt-1 p-2 rounded-md bg-black border border-gray-700 text-white text-sm"
        />
      </div>

      {tab === 'Transfer' && (
        <div className="mb-3">
          <label className="text-xs text-gray-400">To (address)</label>
          <input
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            placeholder="0x..."
            className="w-full mt-1 p-2 rounded-md bg-black border border-gray-700 text-white text-sm"
          />
        </div>
      )}

      <button className="flex-1 py-2 rounded-md font-semibold btn-primary w-full">
        {tab} {selected.symbol}
      </button>

      <div className="mt-3 text-xs text-gray-400">
        Connect wallet to enable {tab.toLowerCase()}.
      </div>
    </div>
  )
}
