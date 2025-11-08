// components/TradeHistory.jsx
export default function TradeHistory({ history }) {
  if (!history || history.length === 0) return null

  return (
    <div id="history" className="bg-[#141419] rounded-2xl p-4 overflow-x-auto">
      <h4 className="text-orange-400 font-semibold mb-3">Trade History</h4>
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="text-left py-1">Time</th>
            <th className="text-left py-1">Pair</th>
            <th className="text-left py-1">Side</th>
            <th className="text-left py-1">Price</th>
            <th className="text-left py-1">Amount</th>
            <th className="text-left py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {history.map((trade, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="py-1 text-gray-400">{trade.time || new Date().toLocaleTimeString()}</td>
              <td className="py-1">{trade.pair}</td>
              <td className={`py-1 ${trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{trade.side}</td>
              <td className="py-1">{trade.price}</td>
              <td className="py-1">{trade.amount}</td>
              <td className="py-1">{(trade.amount * trade.price).toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
