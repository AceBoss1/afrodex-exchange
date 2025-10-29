"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import TokenSelector from "./token-selector"
import PriceDisplay from "./price-display"

interface SwapCardProps {
  userAddress: string
}

export default function SwapCard({ userAddress }: SwapCardProps) {
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
      setAmountOut(data.price || "0")
    } catch (err) {
      console.error("[v0] Price fetch error:", err)
      setError("Failed to fetch price")
    }
  }

  const handleSwap = async () => {
    if (!amountIn) {
      setError("Please enter an amount")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not available")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Step 1: Create order
      const createOrderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenGet: tokenOut,
          amountGet: ethers.parseEther(amountOut || "0").toString(),
          tokenGive: tokenIn === "ETH" ? ethers.ZeroAddress : tokenIn,
          amountGive: ethers.parseEther(amountIn).toString(),
          userAddress,
        }),
      })

      if (!createOrderResponse.ok) throw new Error("Failed to create order")
      const orderData = await createOrderResponse.json()

      // Step 2: Sign order hash
      const signature = await signer.signMessage(ethers.getBytes(orderData.orderHash))

      // Step 3: Execute trade
      const tradeResponse = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenGet: orderData.tokenGet,
          amountGet: orderData.amountGet,
          tokenGive: orderData.tokenGive,
          amountGive: orderData.amountGive,
          expires: orderData.expires,
          nonce: orderData.nonce,
          userAddress,
          signature,
        }),
      })

      if (!tradeResponse.ok) throw new Error("Trade failed")
      const result = await tradeResponse.json()

      console.log("[v0] Trade successful:", result)
      alert(`Trade executed! TX: ${result.transactionHash}`)
      setAmountIn("")
      setAmountOut("")
    } catch (err: any) {
      console.error("[v0] Swap error:", err)
      setError(err.message || "Swap failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReverse = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn("")
    setAmountOut("")
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
          disabled={isLoading || !amountIn}
          className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-lg transition text-lg"
        >
          {isLoading ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  )
}
