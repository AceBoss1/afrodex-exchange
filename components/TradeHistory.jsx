// components/TradeHistory.jsx
"use client"
import { useEffect, useState } from "react"
import { fetchTradeHistory } from "@/lib/afrodexClient"

export default function TradeHistory({ market }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (!market) return
    const load = async () => setHistory(await fetchTradeHistory(market.base, market.quote))
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [market])

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-3">Trade History (last 10)</h4>
      <div className="grid grid-cols-5 text-gray-500 font-semibold text-xs border-b border-white/10 pb-1 mb-2">
        <span>Time</span><span>Pair</span><span>Side</span><span>Price</span><span>Amount</span>
      </div>
      <div className="max-h-72 overflow-auto space-y-1 text-sm text-gray-300">
        {history.length ? (
          history.map((t, i) => (
            <div key={i} className="grid grid-cols-5">
              <span>{new Date(t.time).toLocaleTimeString()}</span>
              <span>{t.pair}</span>
              <span className={t.side === "Buy" ? "text-green-400" : "text-red-400"}>{t.side}</span>
              <span>{t.price}</span>
              <span>{t.amount}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-3">No recent trades</div>
        )}
      </div>
    </div>
  )
}
