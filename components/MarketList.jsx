"use client";
import { useState } from "react";

export default function MarketList({ markets = [], onSelect }) {
  const [search, setSearch] = useState("");

  if (!markets || markets.length === 0) {
    return (
      <div className="bg-[#141419] rounded-2xl p-4">
        <h3 className="text-orange-400 font-semibold">Markets</h3>
        <p className="text-gray-400 text-sm mt-3">No markets available.</p>
      </div>
    );
  }

  const filtered = markets.filter(
    (m) =>
      m.base.toLowerCase().includes(search.toLowerCase()) ||
      m.quote.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h3 className="text-orange-400 font-semibold mb-2">Markets</h3>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#0d0d10] border border-white/10 rounded-lg p-2 text-sm mb-3 focus:outline-none focus:border-orange-400"
      />
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map((m, i) => (
          <div
            key={i}
            onClick={() => onSelect(m)}
            className="flex justify-between items-center py-1 px-2 rounded-md hover:bg-[#1b1b1f] cursor-pointer text-sm"
          >
            <span>{m.base}/{m.quote}</span>
            <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
              {m.change > 0 ? "+" : ""}
              {m.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
