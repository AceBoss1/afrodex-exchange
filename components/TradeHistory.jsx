// components/TradeHistory.jsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnon)

export default function TradeHistory({ trades = [] }) {
  return (
    <div className="card">

      <div className="grid grid-cols-6 text-xs text-gray-400 mb-1">
        <span>Time</span>
        <span>Pair</span>
        <span>Side</span>
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>
      <div className="max-h-48 overflow-y-auto text-sm">
        {trades.length > 0 ? (
          trades.map((t, i) => (
            <div key={i} className="grid grid-cols-6 py-0.5 border-b border-gray-800">
              <span>{t.time}</span>
              <span>{t.pair}</span>
              <span className={t.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                {t.side}
              </span>
              <span>{t.price}</span>
              <span>{t.amount}</span>
              <span>{t.total}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">No trades yet</p>
        )}
      </div>
    </div>
  )
}
