export default function OrderBook({ orders = [] }) {
  return (
    <div className="card">

      <div className="grid grid-cols-3 text-xs text-gray-400 mb-1">
        <span>Price (ETH)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>
      <div className="max-h-48 overflow-y-auto text-sm">
        {orders.length > 0 ? (
          orders.map((o, i) => (
            <div key={i} className="grid grid-cols-3 py-0.5">
              <span className="text-red-400">{o.price}</span>
              <span>{o.amount}</span>
              <span>{o.total}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">No open orders</p>
        )}
      </div>
    </div>
  )
}
