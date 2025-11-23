// components/TradeBox.jsx
import { useState } from 'react'

export default function TradeBox({ market }) {
  const [price, setPrice] = useState(market?.price || '0.000000')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')

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
      </div>
    </div>
  )
}
