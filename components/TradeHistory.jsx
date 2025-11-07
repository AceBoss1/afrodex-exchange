// components/TradeHistory.jsx
export default function TradeHistory({ history }) {
  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-orange font-semibold">Trade History</h4>
        <div className="text-sm text-gray-400">Recent trades</div>
      </div>

      <div className="overflow-auto max-h-40">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400">
            <tr><th className="text-left">Time</th><th className="text-left">Pair</th><th>Side</th><th className="text-right">Price</th><th className="text-right">Amount</th><th className="text-right">Total</th></tr>
          </thead>
          <tbody>
            {history.map((t,i)=>(
              <tr key={i} className={i%2? 'bg-white/2':'bg-white/3'}>
                <td className="py-1">{t.time}</td>
                <td>{t.pair}</td>
                <td className={`text-center ${t.side==='Buy' ? 'text-green-300' : 'text-red-300'}`}>{t.side}</td>
                <td className="text-right">{t.price}</td>
                <td className="text-right">{t.amount}</td>
                <td className="text-right">{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
