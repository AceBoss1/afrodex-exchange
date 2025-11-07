// components/ChartHeader.jsx
export default function ChartHeader({ market }) {
  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">{market.base} / {market.quote}</div>
          <div className="text-xs text-gray-400">Last Price ({market.quote})</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold text-orange">{market.price}</div>
          <div className={market.change >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{market.change>0?'+':''}{market.change}%</div>
        </div>
      </div>

      <div className="mt-3 h-48 bg-[#0f1114] rounded-lg border border-white/6 flex items-center justify-center text-gray-500">
        TradingView Chart Placeholder
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-[#0f1114] p-3 rounded-lg text-sm text-gray-300">Open Orders: <span className="font-semibold text-white">0</span></div>
        <div className="bg-[#0f1114] p-3 rounded-lg text-sm text-gray-300">24h Volume: <span className="font-semibold text-white">{Number(market.volume).toLocaleString()}</span></div>
      </div>
    </div>
  )
}
