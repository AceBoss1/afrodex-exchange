"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils" // Assumes cn utility from shadcn/ui setup
import { Repeat, Clock, ScrollText } from "lucide-react"

// --- TYPE DEFINITIONS ---
interface Order {
  id: string
  user: string
  tokenGet: string
  amountGet: string
  tokenGive: string
  amountGive: string
  price_ratio: string // amountGive / amountGet
  updatedAt?: number // For history sorting
}

interface OrderBookData {
  bids: Order[]
  asks: Order[]
}

interface OrderBookFeedProps {
  tokenA: string // Base Token (e.g., ETH)
  tokenB: string // Quote Token (e.g., USDC)
}

// --- HELPER FUNCTION: FORMATTING ---

// Placeholder function to truncate large addresses
const truncateAddress = (addr: string) => {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// Placeholder function to format amounts to readable decimals
const formatAmount = (amount: string, decimals: number = 4) => {
  try {
    const num = parseFloat(amount)
    return num.toFixed(decimals)
  } catch {
    return amount
  }
}

// --- ORDER BOOK FEED COMPONENT ---
export default function OrderBookFeed({ tokenA, tokenB }: OrderBookFeedProps) {
  const [activeTab, setActiveTab] = useState<"book" | "history">("book")
  const [bookData, setBookData] = useState<OrderBookData>({ bids: [], asks: [] })
  const [historyData, setHistoryData] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tokenPair = `${tokenA}/${tokenB}`

  // --- DATA FETCHING LOGIC ---
  const fetchOrderBook = async (type: "orderbook" | "history") => {
    // FIX: Check for both falsy values and the literal string 'undefined' 
    // to prevent URL parsing errors if props are not properly initialized.
    if (!tokenA || !tokenB || tokenA === 'undefined' || tokenB === 'undefined') {
        console.error("[AfroDEX] Cannot fetch: tokenA or tokenB is invalid or undefined.")
        return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/orderbook?tokenA=${tokenA}&tokenB=${tokenB}&type=${type}`)
      if (!response.ok) throw new Error(`Failed to fetch ${type}.`)

      const data = await response.json()
      if (!data.success) throw new Error(data.message || `API error fetching ${type}.`)

      if (type === "orderbook") {
        setBookData({ bids: data.bids || [], asks: data.asks || [] })
      } else {
        setHistoryData(data.history || [])
      }
    } catch (err) {
      console.error(`[AfroDEX] Fetch Error: ${err}`)
      setError(`Failed to load ${type} data.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to fetch data when the tab changes or the component mounts
  useEffect(() => {
    // GUARD CLAUSE: Prevent execution if tokens are not yet defined (as suggested by the error logs)
    if (!tokenA || !tokenB) {
        return
    }

    // Initial fetch for the active tab
    fetchOrderBook(activeTab === "book" ? "orderbook" : "history")

    // Set up polling for real-time updates (fetch every 5 seconds)
    const intervalId = setInterval(() => {
      fetchOrderBook(activeTab === "book" ? "orderbook" : "history")
    }, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [activeTab, tokenA, tokenB])


  // --- RENDERING SUB-COMPONENTS ---

  const renderBids = () => (
    <div className="space-y-1">
      {bookData.bids.slice(0, 10).map((bid, index) => (
        <div 
          key={bid.id} 
          className="flex justify-between text-sm py-1 px-2 rounded-sm bg-green-900/10 hover:bg-green-900/20 transition cursor-pointer"
        >
          <span className="text-green-500 font-mono w-1/3 text-left">
            {formatAmount(bid.price_ratio, 6)}
          </span>
          <span className="text-text-secondary w-1/3 text-right">
            {formatAmount(bid.amountGet)}
          </span>
          <span className="text-text-secondary w-1/3 text-right">
             {/* Total value (Price * Amount) */}
             {formatAmount((parseFloat(bid.price_ratio) * parseFloat(bid.amountGet)).toString())}
          </span>
        </div>
      ))}
    </div>
  )

  const renderAsks = () => (
    <div className="space-y-1">
      {bookData.asks.slice(0, 10).map((ask, index) => (
        <div 
          key={ask.id} 
          className="flex justify-between text-sm py-1 px-2 rounded-sm bg-red-900/10 hover:bg-red-900/20 transition cursor-pointer"
        >
          <span className="text-red-500 font-mono w-1/3 text-left">
            {formatAmount(ask.price_ratio, 6)}
          </span>
          <span className="text-text-secondary w-1/3 text-right">
            {formatAmount(ask.amountGive)}
          </span>
          <span className="text-text-secondary w-1/3 text-right">
             {/* Total value (Price * Amount) */}
             {formatAmount((parseFloat(ask.price_ratio) * parseFloat(ask.amountGive)).toString())}
          </span>
        </div>
      ))}
    </div>
  )

  const renderOrderBookContent = () => {
    if (isLoading && activeTab === 'book') return <p className="text-center text-text-secondary py-12">Loading Order Book...</p>
    if (error) return <p className="text-center text-error py-12">{error}</p>
    
    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Asks (Sell Orders) - Red */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-xs text-red-500 font-semibold mb-2 px-2">ASKS (SELL {tokenA})</p>
          {bookData.asks.length === 0 ? (
            <p className="text-xs text-center text-text-secondary italic pt-4">No Sell Orders</p>
          ) : (
            renderAsks()
          )}
        </div>

        {/* Mid-Market Price Placeholder */}
        <div className="py-2 border-y border-border-dark flex justify-between items-center px-4 bg-surface-darkest">
            <span className="text-lg font-bold text-primary">
                {bookData.bids.length > 0 && bookData.asks.length > 0
                    ? formatAmount(bookData.asks[0].price_ratio, 6)
                    : "---"}
            </span>
            <span className="text-xs text-text-secondary">
                Price ({tokenB} / {tokenA})
            </span>
        </div>
        
        {/* Bids (Buy Orders) - Green */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-xs text-green-500 font-semibold mb-2 px-2">BIDS (BUY {tokenA})</p>
          {bookData.bids.length === 0 ? (
            <p className="text-xs text-center text-text-secondary italic pt-4">No Buy Orders</p>
          ) : (
            renderBids()
          )}
        </div>
      </div>
    )
  }

  const renderHistoryContent = () => {
    if (isLoading && activeTab === 'history') return <p className="text-center text-text-secondary py-12">Loading Trade History...</p>
    if (error) return <p className="text-center text-error py-12">{error}</p>

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-dark text-text-secondary">
              <th className="py-2 px-1">Time</th>
              <th className="py-2 px-1 text-right">Price ({tokenA})</th>
              <th className="py-2 px-1 text-right">Amount ({tokenB})</th>
              <th className="py-2 px-1 text-right">Type</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((trade, index) => {
              // Determine if it was a Buy or Sell based on the tokens
              // If the user GOT tokenB (USDC) and GAVE tokenA (ETH), it was a SELL of ETH.
              // If the user GOT tokenA (ETH) and GAVE tokenB (USDC), it was a BUY of ETH.
              const isSell = trade.tokenGet === tokenB && trade.tokenGive === tokenA
              const price = parseFloat(trade.price_ratio)
              const amount = parseFloat(isSell ? trade.amountGive : trade.amountGet) // Amount of base token traded

              return (
                <tr key={index} className="border-b border-border-dark last:border-b-0 hover:bg-surface-dark transition">
                  <td className="py-2 px-1 text-text-secondary">
                    {trade.updatedAt ? new Date(trade.updatedAt * 1000).toLocaleTimeString() : 'N/A'}
                  </td>
                  <td className={cn("py-2 px-1 text-right font-mono", isSell ? "text-red-400" : "text-green-400")}>
                    {formatAmount(price.toString(), 6)}
                  </td>
                  <td className="py-2 px-1 text-right text-text">
                    {formatAmount(amount.toString())}
                  </td>
                  <td className={cn("py-2 px-1 text-right font-semibold", isSell ? "text-red-400" : "text-green-400")}>
                    {isSell ? "SELL" : "BUY"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {historyData.length === 0 && (
          <p className="text-center text-text-secondary italic py-6">No recent trades found.</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl shadow-lg w-full max-w-lg lg:max-w-xl h-[700px] flex flex-col">
      {/* Header and Tabs */}
      <div className="p-4 border-b border-border-dark flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Market Data: {tokenPair}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("book")}
            className={cn(
              "p-2 rounded-lg text-sm transition flex items-center gap-2",
              activeTab === "book" ? "bg-primary text-background font-semibold" : "text-text-secondary hover:bg-surface-light"
            )}
          >
            <ScrollText size={18} /> Order Book
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "p-2 rounded-lg text-sm transition flex items-center gap-2",
              activeTab === "history" ? "bg-primary text-background font-semibold" : "text-text-secondary hover:bg-surface-light"
            )}
          >
            <Clock size={18} /> History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "book" ? renderOrderBookContent() : renderHistoryContent()}
      </div>

      {/* Footer/Status */}
      <div className="p-3 border-t border-border-dark bg-surface-darkest flex justify-between items-center text-xs text-text-secondary">
        <span>Updates every 5s</span>
        {isLoading && <span className="flex items-center gap-1 text-primary animate-spin"><Repeat size={14} /> Fetching...</span>}
      </div>
    </div>
  )
}
