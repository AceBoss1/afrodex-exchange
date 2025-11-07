// components/OrderBook.jsx
export default function OrderBook({ orderbook, mid }) {
  return (
    <div className="bg-[#141419] rounded-2xl p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-orange font-semibold">Order Book</h4>
        <div className="text-sm text-gray-400">Spread: <span className="font-semibold">0.0006</span></div>
      </div>

      <div className="grid grid-cols-3 text-xs text-gray-400 mb-2"><div>Price</div><div>Amount</div><div>Total</div></div>

      <div id="orderBookSell" className="space-y-1 max-h-40 overflow-auto mb-2">
        {orderbook.sells.map((s,i)=>(
          <div key={i} className="grid grid-cols-3 text-sm text-red-400"><div>{s.price}</div><div>{s.amount}</div><div>{s.total}</div></div>
        ))}
      </div>

      <div className="text-center text-orange font-semibold">Mid: <span id="midPrice">{mid}</span></div>

      <div id="orderBookBuy" className="space-y-1 max-h-40 overflow-auto mt-2">
        {orderbook.buys.map((b,i)=>(
          <div key={i} className="grid grid-cols-3 text-sm text-green-400"><div>{b.price}</div><div>{b.amount}</div><div>{b.total}</div></div>
        ))}
      </div>
    </div>
  )
}
