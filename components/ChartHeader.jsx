// components/ChartHeader.jsx
'use client'
export default function ChartHeader({ market }) {
  const price =
    typeof market?.price === 'number'
      ? market.price
      : parseFloat(market?.price || '0')

  return (
    <div className="p-3 bg-[#111] rounded-xl border border-[var(--border-gray)] flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold text-[var(--neon-orange)]">
          {market?.base || 'Select'}/{market?.quote || 'Market'}
        </h3>
        <div className="text-gray-400 text-sm">AfroDex Main Market</div>
      </div>
      <div className="text-right mt-2 sm:mt-0">
        <div className="text-2xl font-bold">
          {price.toFixed(6)}
        </div>
        <div className={`text-sm ${price >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {price >= 0 ? '+0.00%' : '-0.00%'}
        </div>
=======
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
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
      </div>
    </div>
  )
}
