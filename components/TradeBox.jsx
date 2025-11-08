// components/TradeBox.jsx
import { useState } from "react"
import TokenInfoCard from "./TokenInfoCard"

export default function TradeBox({ market }) {
  const [price, setPrice] = useState(market.price)
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')

  const placeOrder = () => {
    alert(`${side} Order Submitted: ${amount} ${market.base} @ ${price}`)
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex flex-col h-full text-gray-200 space-y-6">
      
      {/* Header + Buy/Sell Toggle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-orange-400 font-semibold">Place Order</h4>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setSide("Buy")}
              className={`px-3 py-1 rounded-md transition ${
                side==="Buy" ? "bg-orange-500 text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("Sell")}
              className={`px-3 py-1 rounded-md transition ${
                side==="Sell" ? "bg-orange-500 text-black" : "bg-white/10 hover:bg-white/20"
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
          className="w-full mt-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-semibold"
        >
          {side} {market.base}
        </button>
      </div>

      {/* ✅ Token Information Section */}
      <div className="border-t border-white/10 pt-4">
        <TokenInfoCard token={{ symbol: market.base }} />
      </div>

    </div>
  )
}
