// components/ChartHeader.jsx
"use client"
import { useEffect, useState } from "react"
import { fetchMarketStats } from "@/lib/afrodexClient"

export default function ChartHeader({ market }) {
  const [stats, setStats] = useState({ volume: 0, lastPrice: 0 })

  useEffect(() => {
    if (!market) return
    const load = async () => setStats(await fetchMarketStats(market.base, market.quote))
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [market])

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">
          {market.base}/{market.quote}
        </h3>
        <div className="text-gray-400 text-sm">AfroDex Main Market</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-orange-400">
          {stats.lastPrice.toFixed(6)}
        </div>
        <div className="text-gray-400 text-sm">Vol: {stats.volume}</div>
      </div>
    </div>
  )
}
