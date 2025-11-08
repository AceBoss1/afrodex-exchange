// components/TradeBox.jsx
import { useState } from 'react'

export default function TradeBox({ market }) {
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Buy')

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-3">
        {side} {market.base}
      </h4>

      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#0b0b0f] rounded-lg p-2 w-full text-white outline-none"
        />
        <button
          onClick={() => alert(`${side} ${amount} ${market.base}/${market.quote}`)}
          className={`rounded-lg py-2 font-semibold ${side === 'Buy' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {side}
        </button>

        <button
          onClick={() => setSide(side === 'Buy' ? 'Sell' : 'Buy')}
          className="text-gray-300 text-sm underline mt-1"
        >
          Switch to {side === 'Buy' ? 'Sell' : 'Buy'}
        </button>
      </div>
    </div>
  )
}
