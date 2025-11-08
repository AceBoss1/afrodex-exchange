// pages/index.js
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChartHeader from '../components/ChartHeader'
import MarketList from '../components/MarketList'
import { ALL_MARKETS } from '../lib/tokens'
import { generateLocalOrderbook, generateLocalHistory } from '../lib/utils'

// Client-side components
const OrderBook = dynamic(() => import('../components/OrderBook'), { ssr: false })
const TradeBox = dynamic(() => import('../components/TradeBox'), { ssr: false })
const TradeHistory = dynamic(() => import('../components/TradeHistory'), { ssr: false })

export default function Home() {
  const [market, setMarket] = useState(ALL_MARKETS[0])
  const [orderbook, setOrderbook] = useState(null)
  const [history, setHistory] = useState(null)

  useEffect(() => {
    setOrderbook(generateLocalOrderbook(market.price))
    setHistory(generateLocalHistory(market))
  }, [market])

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-12 gap-4 p-4">
        {/* Markets Section */}
        <section className="col-span-3">
          <MarketList markets={ALL_MARKETS} onSelect={setMarket} />
        </section>

        {/* Center Chart and Trading Box */}
        <section className="col-span-9 space-y-4">
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
        </section>
      </main>
    </div>
  )
}
