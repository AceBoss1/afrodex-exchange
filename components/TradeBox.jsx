// components/TradeBox.jsx
import { useState } from 'react'
import TokenInfoCard from './TokenInfoCard'

export default function TradeBox({ market }) {
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex flex-col justify-between h-full">
      <div>
        {/* Buy / Sell Switch */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-md ${side === 'Buy' ? 'bg-green-500 text-black' : 'bg-white/10'}`}
            onClick={() => setSide('Buy')}
          >Buy</button>
          <button
            className={`px-3 py-1 rounded-md ${side === 'Sell' ? 'bg-red-500 text-black' : 'bg-white/10'}`}
            onClick={() => setSide('Sell')}
          >Sell</button>
        </div>

        {/* Inputs */}
        <label className="text-xs text-gray-400">Price ({market.quote})</label>
        <input className="w-full bg-black/20 border border-white/10 rounded-md p-2 mt-1 mb-3" />

        <label className="text-xs text-gray-400">Amount ({market.base})</label>
        <input className="w-full bg-black/20 border border-white/10 rounded-md p-2 mt-1 mb-3" />
      </div>

      <button className="mt-4 w-full py-2 bg-orange-500 font-semibold rounded-lg hover:bg-orange-600">
        Place Order
      </button>

      {/* ✅ Token Info Card (Dynamic) */}
      <TokenInfoCard token={{ symbol: market.base }} />
    </div>
  )
}
