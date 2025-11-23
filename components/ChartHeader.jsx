// components/ChartHeader.jsx
'use client'
export default function ChartHeader({ market }) {
  const price =
    typeof market?.price === 'number'
      ? market.price
      : parseFloat(market?.price || '0')

  return (
    <div className="p-3 bg-[#111] rounded-xl border border-[var(--border-gray)] flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold text-[var(--neon-orange)]">
          {market?.base || 'Select'}/{market?.quote || 'Market'}
        </h3>
        <div className="text-gray-400 text-sm">AfroDex Main Market</div>
      </div>
      <div className="text-right mt-2 sm:mt-0">
        <div className="text-2xl font-bold">
          {price.toFixed(6)}
        </div>
        <div className={`text-sm ${price >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {price >= 0 ? '+0.00%' : '-0.00%'}
        </div>
      </div>
    </div>
  )
}
