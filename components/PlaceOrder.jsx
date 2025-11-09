// components/PlaceOrder.jsx
import { useState } from "react";

export default function PlaceOrder({ market }) {
  const [side, setSide] = useState("Buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [expires, setExpires] = useState(10000);

  const total = amount && price ? (amount * price).toFixed(6) : "0.000000";

  const handleSubmit = () => {
    console.log(`${side} order placed`, { amount, price, total, expires });
  };

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-orange-400 text-lg">Place Order</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSide("Buy")}
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              side === "Buy"
                ? "bg-orange-500 text-black"
                : "bg-black border border-orange-400 text-orange-400"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("Sell")}
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              side === "Sell"
                ? "bg-red-600 text-white"
                : "bg-black border border-red-400 text-red-400"
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>{market.base}</span>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#0b0b0f] rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="flex justify-between">
          <span>{market.base}/{market.quote}</span>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-[#0b0b0f] rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="flex justify-between">
          <span>{market.quote}</span>
          <input
            type="text"
            readOnly
            value={total}
            className="bg-[#0b0b0f] rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="flex justify-between">
          <span>Expires</span>
          <input
            type="number"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            className="bg-[#0b0b0f] rounded px-2 py-1 w-32 text-right"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-2 mt-2 rounded-lg font-semibold transition ${
          side === "Buy"
            ? "bg-orange-500 text-black hover:bg-orange-400"
            : "bg-red-600 text-white hover:bg-red-500"
        }`}
      >
        {side === "Buy" ? `Buy ${market.base}` : `Sell ${market.base}`}
      </button>
    </div>
  );
}
