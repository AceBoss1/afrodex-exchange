// components/OrderBook.jsx
export default function OrderBook({ orderbook, mid }) {
  if (!orderbook) return null
  const { bids, asks } = orderbook

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-3">Order Book</h4>
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {asks.map((a, i) => (
          <div key={`ask-${i}`} className="flex justify-between text-red-400">
            <span>{a.price}</span>
            <span>{a.amount}</span>
            <span>{a.total}</span>
          </div>
        ))}
      </div>

      <div className="text-center my-2 text-gray-300">{mid}</div>

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {bids.map((b, i) => (
          <div key={`bid-${i}`} className="flex justify-between text-green-400">
            <span>{b.price}</span>
            <span>{b.amount}</span>
            <span>{b.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
