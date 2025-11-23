// components/TradeBox.jsx
<<<<<<< HEAD
import { useState } from 'react'
=======
import { useState } from "react"
import TokenInfoCard from "./TokenInfoCard"
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d

export default function TradeBox({ market }) {
  const [price, setPrice] = useState(market?.price || '0.000000')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')

<<<<<<< HEAD
  if (!market) {
    return (
      <div className="card">
        <h3>Trade</h3>
        <p className="text-sm text-gray-400">Select a Market to view trade data</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>{market?.base || 'Select Market'} / {market?.quote || 'ETH'}</h3>
      <div className="space-y-2">
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 rounded bg-black border border-gray-700"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 rounded bg-black border border-gray-700"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setSide('Buy')}
            className={`flex-1 ${side === 'Buy' ? 'btn-primary' : 'btn-outline'}`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('Sell')}
            className={`flex-1 ${side === 'Sell' ? 'btn-primary' : 'btn-outline'}`}
          >
            Sell
          </button>
        </div>
        <button className="w-full btn-primary">
          {side} {market?.base || 'Token'}
        </button>
=======
  const placeOrder = () => {
    alert(`${side} Order Submitted: ${amount} ${market.base} @ ${price}`)
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex flex-col h-full text-gray-200 space-y-6">

      {/* Header + Buy/Sell Toggle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[var(--orange)] font-semibold">Place Order</h4>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setSide("Buy")}
              className={`px-4 py-1.5 rounded-md transition font-semibold ${
                side === "Buy"
                  ? "bg-[var(--orange)] text-black"
                  : "bg-transparent text-[var(--orange)] border border-[var(--orange)] hover:bg-[var(--orange)] hover:text-black"
              }`}
            >
              Buy
            </button>

            <button
              onClick={() => setSide("Sell")}
              className={`px-4 py-1.5 rounded-md transition font-semibold ${
                side === "Sell"
                  ? "bg-[var(--orange)] text-black"
                  : "bg-transparent text-[var(--orange)] border border-[var(--orange)] hover:bg-[var(--orange)] hover:text-black"
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="text-xs text-gray-400">Price ({market.quote})</label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full mt-1 p-2 bg-[#0f1114] border border-white/10 rounded-md"
          />
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label className="text-xs text-gray-400">Amount ({market.base})</label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full mt-1 p-2 bg-[#0f1114] border border-white/10 rounded-md"
          />
        </div>

        {/* Submit */}
        <button
          onClick={placeOrder}
          className="w-full mt-3 py-2 rounded-lg bg-[var(--orange)] hover:bg-orange-600 text-black font-semibold"
        >
          {side} {market.base}
        </button>
      </div>

      {/* ✅ Token Information Section */}
      <div className="border-t border-white/10 pt-4">
        <TokenInfoCard token={{ symbol: market.base }} />
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
      </div>

    </div>
  )
}
