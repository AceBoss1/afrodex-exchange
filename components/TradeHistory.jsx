// components/TradeHistory.jsx
export default function TradeHistory({ history }) {
  if (!history || history.length === 0) return null

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-3">Recent Trades</h4>
      <div className="space-y-1 max-h-60 overflow-y-auto text-sm">
        {history.map((trade, i) => (
          <div key={i} className="flex justify-between">
            <span className={trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>
              {trade.side}
            </span>
            <span>{trade.price}</span>
            <span>{trade.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
