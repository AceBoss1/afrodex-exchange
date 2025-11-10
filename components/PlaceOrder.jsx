"use client";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

export default function PlaceOrder({ market }) {
  const [side, setSide] = useState("Buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const handlePlaceOrder = () => {
    console.log(`${side} ${amount} ${market.base} at ${price} ${market.quote}`);
  };

  return (
    <div className="bg-[#141419] rounded-2xl p-4 text-sm">
      <h4 className="text-orange-400 font-semibold mb-3">PLACE ORDER</h4>

      {/* Buy/Sell Switch */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSide("Buy")}
            className={`px-4 py-1 rounded-md font-semibold ${
              side === "Buy"
                ? "bg-orange-500 text-black"
                : "bg-black border border-orange-500 text-orange-400"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("Sell")}
            className={`px-4 py-1 rounded-md font-semibold ${
              side === "Sell"
                ? "bg-black border border-orange-500 text-orange-400"
                : "bg-orange-500 text-black"
            }`}
          >
            Sell
          </button>
        </div>
        <ArrowLeftRight className="text-gray-400" size={16} />
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div>
          <label className="text-gray-400 block mb-1">Price ({market.quote})</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black text-white rounded-md px-3 py-2 border border-gray-700 focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-gray-400 block mb-1">Amount ({market.base})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black text-white rounded-md px-3 py-2 border border-gray-700 focus:border-orange-400 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className={`mt-4 w-full py-2 rounded-lg font-semibold transition-all ${
          side === "Buy"
            ? "bg-orange-500 text-black hover:bg-orange-400"
            : "bg-black border border-orange-500 text-orange-400 hover:bg-[#1a1a1d]"
        }`}
      >
        {side} {market.base}
      </button>
    </div>
  );
}
