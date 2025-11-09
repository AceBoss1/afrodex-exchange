'use client'
import { useState, useMemo } from 'react'

export default function MarketList({ markets = [], onSelect }) {
  const [search, setSearch] = useState('')

  // Safely filter even if markets is empty
  const filtered = useMemo(() => {
    if (!Array.isArray(markets)) return []
    return markets.filter(
      (m) =>
        m.base.toLowerCase().includes(search.toLowerCase()) ||
        m.quote.toLowerCase().includes(search.toLowerCase())
    )
  }, [markets, search])

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-orange-400 mb-2">Markets</h3>

      <input
        type="text"
        placeholder="Search token..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white mb-3 focus:outline-none"
      />

      <div className="space-y-2 max-h-[480px] overflow-y-auto custom-scroll">
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <div
              key={`${m.base}/${m.quote}`}
              onClick={() => onSelect && onSelect(m)}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-orange-500/20 cursor-pointer transition-all"
            >
              <div>
                <div className="font-semibold text-white">{m.base}/{m.quote}</div>
                <div className="text-xs text-gray-400">Vol {m.volume.toLocaleString()}</div>
              </div>
              <div className={`font-semibold ${m.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {m.change >= 0 ? '+' : ''}{m.change}%
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm text-center py-6">No markets found</div>
        )}
      </div>
    </div>
  )
}
