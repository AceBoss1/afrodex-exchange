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
=======
"use client"
import { useState } from "react"
import { ALL_MARKETS } from "@/lib/tokens"

export default function MarketList({ markets = ALL_MARKETS, onSelectMarket, allowCustomToken }) {
  const [search, setSearch] = useState("")
  const [customMarkets, setCustomMarkets] = useState([])

  const combinedMarkets = [...markets, ...customMarkets]

  const filtered = combinedMarkets.filter(
    (m) =>
      m.base.toLowerCase().includes(search.toLowerCase()) ||
      m.quote.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = () => {
    if (/^0x[a-fA-F0-9]{40}$/.test(search)) {
      // User entered a valid ERC20 address
      const newPair = {
        base: search.slice(0, 6) + "..." + search.slice(-4),
        quote: "ETH",
        price: "0.000000",
        change: 0,
        volume: 0,
        address: search,
      }
      setCustomMarkets((prev) => [...prev, newPair])
      setSearch("")
    }
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4">
      <h4 className="text-orange-400 font-semibold mb-2">Markets</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search or paste token address..."
          className="flex-1 bg-black/30 rounded-lg px-2 py-1 text-sm focus:outline-none border border-white/10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-black px-3 rounded-lg text-sm"
        >
          Add
        </button>
      </div>

      <div className="space-y-1 max-h-[500px] overflow-auto">
        {filtered.map((m, i) => (
          <div
            key={i}
            onClick={() => onSelectMarket(m)}
            className="flex justify-between py-1 px-2 rounded-lg cursor-pointer hover:bg-orange-500/20 transition"
          >
            <span>{m.base}/{m.quote}</span>
            <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
              {m.change > 0 ? "+" : ""}
              {m.change}%
            </span>
          </div>
        ))}

        {!filtered.length && (
          <div className="text-gray-500 text-sm py-2 text-center">
            No matching market
          </div>
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
        )}
      </div>
    </div>
  )
}
