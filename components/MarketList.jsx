// components/MarketList.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { ALL_MARKETS } from '@/lib/tokens'

export default function MarketList({ markets = ALL_MARKETS, onSelectMarket, currentMarket }) {
  const [search, setSearch] = useState('')
  const [tokenResults, setTokenResults] = useState([])
  const publicClient = usePublicClient?.() // may be undefined in some setups

  // basic filter
  const filtered = (markets || []).filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (m.base || '').toLowerCase().includes(q) || (m.quote || '').toLowerCase().includes(q) || (m.address || '').toLowerCase().startsWith(q)
  })

  // If user pastes a 0x address, attempt to resolve token metadata
  useEffect(() => {
    const loadAddressToken = async () => {
      if (!search || !search.startsWith('0x') || search.length !== 42) {
        setTokenResults([])
        return
      }
      if (!publicClient) {
        setTokenResults([])
        return
      }
      try {
        const name = await publicClient.readContract({
          address: search,
          abi: [{ name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] }],
          functionName: 'name',
        })
        const symbol = await publicClient.readContract({
          address: search,
          abi: [{ name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] }],
          functionName: 'symbol',
        })
        const decimals = await publicClient.readContract({
          address: search,
          abi: [{ name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] }],
          functionName: 'decimals',
        })

        setTokenResults([
          {
            base: symbol,
            quote: 'ETH',
            price: '0.000000',
            change: 0,
            volume: 0,
            unlisted: true,
            address: search,
            name,
            decimals,
          },
        ])
      } catch (err) {
        setTokenResults([])
        // silently ignore
      }
    }
    loadAddressToken()
  }, [search, publicClient])

  const marketsToShow = tokenResults.length ? tokenResults : filtered

  return (
    <div className="bg-[#141419] rounded-2xl p-4 shadow-sm">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or contract..."
        className="w-full p-3 rounded bg-[#0b0b0d] border border-gray-700 placeholder-gray-500 text-white mb-3"
      />

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2">
        {marketsToShow.length === 0 ? (
          <div className="text-gray-400 text-center py-6">No markets found.</div>
        ) : (
          marketsToShow.map((m, i) => {
            const active = currentMarket && currentMarket.base === m.base && currentMarket.quote === m.quote
            return (
              <div
                key={m.address || `${m.base}/${m.quote}-${i}`}
                onClick={() => {
                  onSelectMarket && onSelectMarket(m)
                  // emit token (base) for TokenInfoCard / BalanceCard
                  // onSelectToken handled by index.js context (we use Option A so base is used)
                }}
                className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition ${active ? 'bg-[#2b1200] border border-[#F97316]' : 'hover:bg-white/5'}`}
              >
                <div>
                  <div className="font-semibold text-white">{m.base}<span className="text-gray-400 text-xs">/{m.quote}</span></div>
                  {m.unlisted && <div className="text-yellow-400 text-xs italic">Unlisted</div>}
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-300">{m.price}</div>
                  <div className={`text-xs ${m.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{m.change >= 0 ? '+' : ''}{m.change}%</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
