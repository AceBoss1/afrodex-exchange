"use client"

interface PriceDisplayProps {
  tokenIn: string
  tokenOut: string
  priceData?: any
}

export default function PriceDisplay({ tokenIn, tokenOut, priceData }: PriceDisplayProps) {
  const price = priceData?.price || "0.00"
  const rate = priceData?.rate || "0.00"

  return (
    <div className="bg-surface-light border border-border rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Price</span>
        <span className="text-text">
          1 {tokenIn} = {rate} {tokenOut}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Fee</span>
        <span className="text-text">0.30%</span>
      </div>
      <div className="flex justify-between text-sm pt-2 border-t border-border">
        <span className="text-text-secondary">Slippage</span>
        <span className="text-accent">0.50%</span>
      </div>
    </div>
  )
}
