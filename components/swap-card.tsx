"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import TokenSelector from "./token-selector"
import PriceDisplay from "./price-display"

// 1. UPDATE: Add the onPlaceOrder function to the component props
interface SwapCardProps {
  userAddress: string
  onPlaceOrder: (
    isBuy: boolean, 
    tokenSell: string, 
    tokenBuy: string, 
    amountSell: string, 
    amountBuy: string
  ) => Promise<void>
}

// 2. UPDATE: Destructure onPlaceOrder from props
export default function SwapCard({ userAddress, onPlaceOrder }: SwapCardProps) {
  const [tokenIn, setTokenIn] = useState("ETH")
  const [tokenOut, setTokenOut] = useState("USDC")
  const [amountIn, setAmountIn] = useState("")
  const [amountOut, setAmountOut] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [priceData, setPriceData] = useState<any>(null)

  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      fetchPrice()
    }
  }, [amountIn, tokenIn, tokenOut])

  const fetchPrice = async () => {
    try {
      // NOTE: This API call is kept separate, as it typically doesn't require signing
      const response = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenIn,
          tokenOut,
          amountIn,
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch price")
      const data = await response.json()
      setPriceData(data)
      // Assuming a price is returned that dictates the amountOut
      setAmountOut(data.price || "0.00") 
    } catch (err) {
      console.error("[v0] Price fetch error:", err)
      setError("Failed to fetch price")
    }
  }

  // 3. REFATOR: Use the onPlaceOrder prop to submit the order
  const handleSwap = async () => {
    if (!amountIn || !amountOut || parseFloat(amountIn) <= 0) {
      setError("Please enter a valid amount to trade.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Determine if this is a BUY or SELL order based on the token flow
      // A user is selling tokenIn to buy tokenOut. 
      // For a simple swap interface, we can consider this a generic order.
      // We will define it as selling tokenIn for tokenOut.
      const isBuyOrder = false; // Simplified: Let's treat the Swap as a generic SELL order for now

      // This is the streamlined call to the parent component's handler, 
      // which uses window.placeOrder (in js/dapp_main.js)
      await onPlaceOrder(
        isBuyOrder, // Simplified boolean for order type
        tokenIn, 
        tokenOut, 
        amountIn, 
        amountOut
      )

      console.log("[v0] Order submission triggered.")
      setAmountIn("")
      setAmountOut("")

      // The actual success/failure message will be handled by the logic inside handlePlaceOrder in app/page.tsx
    } catch (err: any) {
      console.error("[v0] Swap error:", err)
      setError(err.message || "Order submission failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReverse = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn("")
    setAmountOut("")
    // Re-fetch price data after token reversal
    if (amountIn) {
      fetchPrice(); 
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-primary">Swap</h2>
          <p className="text-sm text-text-secondary">Trade crypto assets instantly</p>
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm text-text-secondary font-medium">From</label>
          <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
            <input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-text placeholder-text-secondary outline-none"
            />
            <TokenSelector selectedToken={tokenIn} onSelect={setTokenIn} />
          </div>
        </div>

        {/* Reverse Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReverse}
            className="p-2 bg-primary hover:bg-primary-dark text-background rounded-full transition font-bold text-lg"
          >
            ⇅
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm text-text-secondary font-medium">To</label>
          <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
            {/* Display the calculated output amount */}
            <div className="text-2xl font-bold text-text">{amountOut || "0.0"}</div> 
            <TokenSelector selectedToken={tokenOut} onSelect={setTokenOut} />
          </div>
        </div>

        {/* Price Info */}
        <PriceDisplay tokenIn={tokenIn} tokenOut={tokenOut} priceData={priceData} />

        {/* Error Message */}
        {error && <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm">{error}</div>}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isLoading || !amountIn || !amountOut} // Disable if no output is calculated
          className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-lg transition text-lg"
        >
          {isLoading ? "Submitting Order..." : "Submit Order"}
        </button>
      </div>
    </div>
  )
}
