"use client"
import { useState } from "react"
import { ALL_MARKETS } from "@/lib/tokens"

export default function MarketList({ markets = ALL_MARKETS, onSelectMarket, allowCustomToken }) {
  const [search, setSearch] = useState("")
  const [customMarkets, setCustomMarkets] = useState([])

  const combinedMarkets = [...markets, ...customMarkets]

  const filtered = combinedMarkets.filter(
    (m) =>
      m.base.toLowerCase().includes(search.toLowerCase()) ||
      m.quote.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = () => {
    if (/^0x[a-fA-F0-9]{40}$/.test(search)) {
      // User entered a valid ERC20 address
      const newPair = {
        base: search.slice(0, 6) + "..." + search.slice(-4),
        quote: "ETH",
        price: "0.000000",
        change: 0,
        volume: 0,
        address: search,
      }
      setCustomMarkets((prev) => [...prev, newPair])
      setSearch("")
    }
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-2">Markets</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search or paste token address..."
          className="flex-1 bg-black/30 rounded-lg px-2 py-1 text-sm focus:outline-none border border-white/10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-black px-3 rounded-lg text-sm"
        >
          Add
        </button>
      </div>

      <div className="space-y-1 max-h-[500px] overflow-auto">
        {filtered.map((m, i) => (
          <div
            key={i}
            onClick={() => onSelectMarket(m)}
            className="flex justify-between py-1 px-2 rounded-lg cursor-pointer hover:bg-orange-500/20 transition"
          >
            <span>{m.base}/{m.quote}</span>
            <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
              {m.change > 0 ? "+" : ""}
              {m.change}%
            </span>
          </div>
        ))}

        {!filtered.length && (
          <div className="text-gray-500 text-sm py-2 text-center">
            No matching market
          </div>
        )}
      </div>
    </div>
  )
}
