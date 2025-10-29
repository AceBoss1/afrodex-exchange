"use client"

import { useState } from "react"

interface TokenSelectorProps {
  selectedToken: string
  onSelect: (token: string) => void
}

const TOKENS = ["ETH", "USDC", "DAI", "USDT", "WBTC"]

export default function TokenSelector({ selectedToken, onSelect }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border hover:border-primary transition"
      >
        <span className="font-semibold text-primary">{selectedToken}</span>
        <span className="text-text-secondary">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-surface border border-border rounded-lg shadow-lg z-10">
          {TOKENS.map((token) => (
            <button
              key={token}
              onClick={() => {
                onSelect(token)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left hover:bg-surface-light transition ${
                token === selectedToken ? "bg-surface-light text-primary" : "text-text"
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
