"use client";
import React, { useState } from "react";

export default function PlaceOrder({ market }) {
  const [side, setSide] = useState("Buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const handleOrder = () => {
    alert(`${side} order placed for ${amount} ${market.base} @ ${price} ${market.quote}`);
  };

  return (
    <div className="bg-[#141419] rounded-2xl p-5 shadow-lg flex flex-col space-y-4">
      <h3 className="text-orange-400 font-semibold text-lg">
        Place Order ({market.base}/{market.quote})
      </h3>

      {/* BUY / SELL Switch */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSide("Buy")}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
            side === "Buy"
              ? "bg-orange-500 text-black"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("Sell")}
          className={`flex-1 py-2 rounded-lg font-semibold border transition-all ${
            side === "Sell"
              ? "bg-black text-orange-400 border-orange-500"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Inputs */}
      <div className="flex flex-col space-y-3">
        <div>
          <label className="text-sm text-gray-400">Price ({market.quote})</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full bg-[#0f0f13] border border-white/10 rounded-lg p-2 mt-1 focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Amount ({market.base})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-[#0f0f13] border border-white/10 rounded-lg p-2 mt-1 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleOrder}
        className={`mt-3 w-full rounded-lg py-2 font-semibold ${
          side === "Buy"
            ? "bg-orange-500 text-black hover:bg-orange-600"
            : "bg-black text-orange-400 border border-orange-500 hover:bg-[#1a1a1a]"
        }`}
      >
        {side} {market.base}
      </button>
    </div>
  );
}
