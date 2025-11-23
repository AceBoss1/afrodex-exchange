// components/PlaceOrder.jsx

"use client"
import { useState, useEffect } from "react"

export default function PlaceOrder({ market }) {
  const [price, setPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [side, setSide] = useState("Buy")

  useEffect(() => {
    if (market && market.price) {
      setPrice(String(market.price))
    }
  }, [market])

  if (!market)
    return (
      <p className="text-sm text-gray-500 py-2">
        Select a market to place trades.
      </p>
    )

  const submit = () => {
    alert(
      `${side} order created: ${amount} ${market.base} @ ${price} ${market.quote}`
    )
  }

  return (
    <div className="flex flex-col gap-4">

      {/* BUY / SELL */}
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded-md font-semibold ${
            side === "Buy" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setSide("Buy")}
        >
          Buy
        </button>

        <button
          className={`flex-1 py-2 rounded-md font-semibold ${
            side === "Sell" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setSide("Sell")}
        >
          Sell
        </button>
      </div>

      {/* AMOUNT */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Amount ({market.base})
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Price ({market.quote})
        </label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.0000"
        />
      </div>

      <button className="btn-primary py-2 rounded-md" onClick={submit}>
        {side} {market.base}
      </button>
    </div>
  )
}
