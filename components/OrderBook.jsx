"use client";
import React, { useState, useEffect } from "react";

export default function OrderBook({ market }) {
  const [orderbook, setOrderbook] = useState({ buys: [], sells: [] });

  // Simulate loading orderbook (replace this later with API or socket feed)
  useEffect(() => {
    // Example simulated data — replace with live WebSocket later
    const dummy = {
      buys: [
        { price: "1.1432", amount: "120.5", total: "137.00" },
        { price: "1.1420", amount: "85.3", total: "97.47" },
        { price: "1.1400", amount: "62.1", total: "70.83" },
      ],
      sells: [
        { price: "1.1450", amount: "50.2", total: "57.43" },
        { price: "1.1465", amount: "90.1", total: "103.31" },
        { price: "1.1482", amount: "110.8", total: "127.17" },
      ],
    };
    setOrderbook(dummy);
  }, [market]);

  return (
    <div className="bg-[#141419] rounded-2xl p-5 shadow-lg h-full flex flex-col transition-all duration-300">
      <h3 className="text-orange-400 font-semibold text-lg mb-3">
        Order Book ({market?.base}/{market?.quote})
      </h3>

      {/* --- Sells --- */}
      <div className="text-xs text-gray-400 mb-1">Sells</div>
      <div
        id="orderBookSell"
        className="space-y-1 max-h-40 overflow-auto mb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {orderbook?.sells?.length > 0 ? (
          orderbook.sells.map((s, i) => (
            <div
              key={`sell-${i}`}
              className="grid grid-cols-3 text-sm text-red-400 hover:bg-[#1a1a1a] rounded-md px-2 py-0.5"
            >
              <div>{s.price}</div>
              <div>{s.amount}</div>
              <div>{s.total}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs text-center py-2">
            No sell orders yet
          </div>
        )}
      </div>

      {/* --- Midline --- */}
      <div className="text-center text-orange-400 text-sm border-y border-white/10 py-1 mb-2">
        {market?.price ?? "—"}
      </div>

      {/* --- Buys --- */}
      <div className="text-xs text-gray-400 mb-1">Buys</div>
      <div
        id="orderBookBuy"
        className="space-y-1 max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {orderbook?.buys?.length > 0 ? (
          orderbook.buys.map((b, i) => (
            <div
              key={`buy-${i}`}
              className="grid grid-cols-3 text-sm text-green-400 hover:bg-[#1a1a1a] rounded-md px-2 py-0.5"
            >
              <div>{b.price}</div>
              <div>{b.amount}</div>
              <div>{b.total}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs text-center py-2">
            No buy orders yet
          </div>
        )}
      </div>
    </div>
  );
}
