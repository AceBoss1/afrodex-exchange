// pages/index.js
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import MarketList from '../components/MarketList'
import ChartHeader from '../components/ChartHeader'
import OrderBook from '../components/OrderBook'
import TradeBox from '../components/TradeBox'
import TradeHistory from '../components/TradeHistory'
import BalanceCard from '../components/BalanceCard'
import { ALL_MARKETS } from '../lib/tokens'
import { generateLocalOrderbook, generateLocalHistory } from '../lib/utils'

export default function Home() {
  const [market, setMarket] = useState(ALL_MARKETS[0])
  const [orderbook, setOrderbook] = useState(generateLocalOrderbook(ALL_MARKETS[0].price))
  const [history, setHistory] = useState(generateLocalHistory(ALL_MARKETS[0]))

  useEffect(() => {
    // Refresh orderbook and trade history when market changes
    setOrderbook(generateLocalOrderbook(market.price))
    setHistory(generateLocalHistory(market))
  }, [market])

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex">
      {/* ✅ Sidebar (Leftmost fixed area) */}
      <div className="w-64 p-4">
        <Sidebar />
      </div>

      {/* ✅ Main trading layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        
        {/* ✅ Left Column: Balance + Markets + My Orders */}
        <section className="col-span-3 space-y-4">
          {/* Balance panel */}
          <BalanceCard market={market} />

          {/* Market list */}
          <MarketList markets={ALL_MARKETS || []} onSelect={setMarket} />

          {/* My Orders below Markets */}
          <div className="bg-[#141419] rounded-2xl p-4">
            <h4 className="text-orange-400 font-semibold">My Orders</h4>
            <div className="text-sm text-gray-300 mt-2">No open orders yet</div>
          </div>
        </section>

        {/* ✅ Center Column: Trading core */}
        <main className="col-span-9 space-y-4">
          <ChartHeader market={market} />

          <div className="flex gap-4">
            <div className="flex-1">
              <OrderBook orderbook={orderbook} mid={market.price} />
            </div>
            <aside className="w-80">
              <TradeBox market={market} />
            </aside>
          </div>

          <TradeHistory history={history} />
        </main>
      </div>
    </div>
  )
}
