// pages/index.js
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import MarketList from '../components/MarketList'
import ChartHeader from '../components/ChartHeader'
import { ALL_MARKETS } from '../lib/tokens'
import { generateLocalOrderbook, generateLocalHistory } from '../lib/utils'

// Dynamically import components that use client-side or random data
const OrderBook = dynamic(() => import('../components/OrderBook'), { ssr: false })
const TradeBox = dynamic(() => import('../components/TradeBox'), { ssr: false })
const TradeHistory = dynamic(() => import('../components/TradeHistory'), { ssr: false })

export default function Home() {
  const [market, setMarket] = useState(ALL_MARKETS[0])
  const [orderbook, setOrderbook] = useState(null)
  const [history, setHistory] = useState(null)

  // Only generate random data on the client
  useEffect(() => {
    setOrderbook(generateLocalOrderbook(market.price))
    setHistory(generateLocalHistory(market))
  }, [market])

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left sidebar - Markets */}
        <section className="col-span-3">
          <MarketList markets={ALL_MARKETS} onSelect={setMarket} />
        </section>

        {/* Main content */}
        <main className="col-span-6 space-y-4">
          <ChartHeader market={market} />

          <div className="flex gap-4">
            <div className="flex-1">
              {orderbook && <OrderBook orderbook={orderbook} mid={market.price} />}
            </div>

            <aside className="w-80">
              <TradeBox market={market} />
            </aside>
          </div>

          {history && <TradeHistory history={history} />}
        </main>

        {/* Right sidebar */}
        <aside className="col-span-3 space-y-4">
          <div className="bg-[#141419] rounded-2xl p-4">
            <h4 className="text-orange-400 font-semibold">My Orders</h4>
            <div className="text-sm text-gray-300 mt-2">No open orders yet</div>
          </div>

          <div className="bg-[#141419] rounded-2xl p-4">
            <h4 className="text-orange-400 font-semibold">Top Markets</h4>
            <div className="mt-3 text-sm text-gray-300">
              {ALL_MARKETS.slice(0, 5).map((m) => (
                <div key={`${m.base}/${m.quote}`} className="flex justify-between py-1">
                  <div>{m.base}/{m.quote}</div>
                  <div className={m.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {m.change > 0 ? '+' : ''}{m.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
