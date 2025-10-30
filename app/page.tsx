"use client"

import { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
// NOTE: All external components have been merged into this file to resolve import errors.

// --- UTILITY FUNCTIONS (cn) ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- MOCK TOKEN DATA ---
const MOCK_TOKENS = [
  { symbol: "ETH", address: "0xEthAddr", icon: "💎" },
  { symbol: "USDC", address: "0xUSDCAddr", icon: "💵" },
  { symbol: "AfroX", address: "0xAfroXAddr", icon: "🌍" }, // AfroX token
  { symbol: "PLAAS", address: "0xPLAASAddr", icon: "🌾" }, // PLAAS token reference
]

// --- 1. Header Component (Embedded) ---

interface HeaderProps {
  isConnected: boolean
  userAddress: string
  onDisconnect: () => void
}

function TruncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const EmbeddedHeader = ({ isConnected, userAddress, onDisconnect }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Using a simple text logo placeholder */}
          <div className="text-3xl text-primary">AfroDEX</div> 
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary">AfroDex</h1>
            <p className="text-xs text-text-secondary italic">Africa's biggest DEX</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">Swap</a>
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">Liquidity</a>
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">Analytics</a>
        </nav>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-surface-light rounded-lg border border-border">
                <p className="text-sm text-text-secondary font-mono">{TruncateAddress(userAddress)}</p>
              </div>
              <button
                onClick={onDisconnect}
                className="px-4 py-2 bg-error hover:bg-red-600 text-white rounded-lg transition font-medium text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <p className="text-text-secondary text-sm hidden sm:block">Connect wallet to trade</p>
          )}
        </div>
      </div>
    </header>
  )
}

// --- Token Selector Sub-Component (Embedded) ---
interface TokenSelectorProps {
  selectedToken: string
  onSelect: (symbol: string) => void
}

const TokenSelector = ({ selectedToken, onSelect }: TokenSelectorProps) => {
  return (
    <select 
      value={selectedToken}
      onChange={(e) => onSelect(e.target.value)}
      className="bg-surface border border-border rounded-full py-1 px-3 text-sm font-medium text-primary focus:ring-primary focus:border-primary appearance-none cursor-pointer"
    >
      {MOCK_TOKENS.map(token => (
        <option key={token.symbol} value={token.symbol}>
          {token.icon} {token.symbol}
        </option>
      ))}
    </select>
  )
}

// --- Price Display Sub-Component (Embedded) ---
interface PriceDisplayProps {
  tokenIn: string
  tokenOut: string
  priceData: any
}

const PriceDisplay = ({ tokenIn, tokenOut, priceData }: PriceDisplayProps) => {
  const price = priceData?.price ? parseFloat(priceData.price).toFixed(6) : 'N/A'
  
  return (
    <div className="text-center p-3 bg-surface rounded-lg text-sm border border-border">
      <p className="text-text-secondary">Exchange Rate</p>
      <p className="font-bold text-primary mt-1">
        1 {tokenIn} = {price} {tokenOut}
      </p>
      <p className="text-xs text-text-tertiary mt-1">
        Fee: {priceData?.fee || "0.3"}%
      </p>
    </div>
  )
}

// --- 2. Swap Card Component (Embedded) ---
interface SwapCardProps {
  userAddress: string
}

const EmbeddedSwapCard = ({ userAddress }: SwapCardProps) => {
  const [tokenIn, setTokenIn] = useState("ETH")
  const [tokenOut, setTokenOut] = useState("USDC")
  const [amountIn, setAmountIn] = useState("")
  const [amountOut, setAmountOut] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [priceData, setPriceData] = useState<any>(null)

  // Mock Price Fetch (Simulates fetching the rate for the swap)
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      // Mocking a price fetch
      const mockRate = tokenIn === 'ETH' && tokenOut === 'USDC' ? 3500 : 0.0005 
      const mockAmountOut = (parseFloat(amountIn) * mockRate).toFixed(6)
      
      const mockData = { price: mockRate.toString(), fee: "0.3" }

      setPriceData(mockData)
      setAmountOut(mockAmountOut)
      setError("")
    }
  }, [amountIn, tokenIn, tokenOut])

  const handleReverse = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  const handleSwap = () => {
    if (!userAddress) {
      setError("Please connect your wallet to execute a swap.")
      return
    }
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setError("Please enter a valid amount.")
      return
    }

    setIsLoading(true)
    setError("")
    console.log(`Executing swap: ${amountIn} ${tokenIn} to ${tokenOut}`)

    setTimeout(() => {
      setIsLoading(false)
      // Simulate success
      setAmountIn("")
      setAmountOut("")
      setPriceData(null)
      alert("Swap simulated successfully!")
    }, 2000)
  }

  return (
    <div className="bg-surface p-6 rounded-xl shadow-2xl border border-border space-y-5">
      <h2 className="text-2xl font-extrabold text-primary border-b border-border-light pb-3">DEX SWAP</h2>

      {/* From Token */}
      <div className="space-y-2">
        <label className="text-sm text-text-secondary font-medium">From</label>
        <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent text-text focus:outline-none focus:ring-0 appearance-none outline-none border-none leading-none"
          />
          <TokenSelector selectedToken={tokenIn} onSelect={setTokenIn} />
        </div>
      </div>

      {/* Reverse Button */}
      <div className="flex justify-center">
        <button
          onClick={handleReverse}
          className="p-2 bg-primary hover:bg-primary-dark text-background rounded-full transition font-bold text-lg border-2 border-surface"
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
        disabled={isLoading || !amountIn || !userAddress}
        className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-lg transition text-lg shadow-lg"
      >
        {isLoading ? "Swapping..." : (userAddress ? "Swap" : "Connect Wallet")}
      </button>
    </div>
  )
}

// --- 3. Order Book Feed Component (Embedded) ---
interface OrderBookFeedProps {
  tokenA: string // Base Token (e.g., ETH)
  tokenB: string // Quote Token (e.g., AfroX)
}

interface Order {
  price: number
  amount: number
  total: number
}

const EmbeddedOrderBookFeed = ({ tokenA, tokenB }: OrderBookFeedProps) => {
  const [bids, setBids] = useState<Order[]>([])
  const [asks, setAsks] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Custom Hook for fetching data (using a mocked interval to simulate real-time feed)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    // Function to simulate fetching order book data
    const fetchOrderBook = () => {
      // Check for the *literal string* 'undefined' which caused the original error
      if (tokenA === 'undefined' || tokenB === 'undefined' || !tokenA || !tokenB) {
        console.warn("Skipping fetch: Tokens are undefined or null")
        setBids([])
        setAsks([])
        setError("Market pair not yet selected.")
        return
      }
      
      setIsLoading(true)
      setError(null)
      console.log(`Fetching order book for ${tokenA}/${tokenB}...`)

      // Mock Data Generation
      const mockAsks: Order[] = []
      const mockBids: Order[] = []
      const basePrice = 0.0005
      
      // Generate Asks (Sellers) - Price goes up
      for (let i = 0; i < 7; i++) {
        const price = basePrice + (i * 0.00001 + Math.random() * 0.000005)
        const amount = (2000 + Math.random() * 5000)
        mockAsks.push({
          price: parseFloat(price.toFixed(6)),
          amount: parseFloat(amount.toFixed(2)),
          total: parseFloat((price * amount).toFixed(4)),
        })
      }

      // Generate Bids (Buyers) - Price goes down
      for (let i = 0; i < 7; i++) {
        const price = basePrice - (i * 0.00001 + Math.random() * 0.000005)
        const amount = (1500 + Math.random() * 4000)
        mockBids.push({
          price: parseFloat(price.toFixed(6)),
          amount: parseFloat(amount.toFixed(2)),
          total: parseFloat((price * amount).toFixed(4)),
        })
      }
      
      // Apply mock cumulative total for visual depth
      const calculateCumulativeTotal = (orders: Order[], isBid: boolean) => {
        let cumulative = 0
        return orders.map(order => {
          cumulative += order.amount
          return { ...order, cumulative }
        })
      }
      
      const asksWithCumulative = calculateCumulativeTotal(mockAsks.sort((a, b) => a.price - b.price), false)
      const bidsWithCumulative = calculateCumulativeTotal(mockBids.sort((a, b) => b.price - a.price), true)
      
      setAsks(asksWithCumulative)
      setBids(bidsWithCumulative)
      setIsLoading(false)
    }

    // Initial fetch
    fetchOrderBook()
    
    // Set up interval for refreshing the order book (simulating real-time updates)
    interval = setInterval(fetchOrderBook, 30000); // Refreshes every 30 seconds

    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [tokenA, tokenB]) // Re-run effect when tokens change

  // Find the highest bid and lowest ask to determine the spread/mid-price
  const bestAsk = asks.length > 0 ? asks[0].price : null
  const bestBid = bids.length > 0 ? bids[0].price : null
  const midPrice = (bestAsk && bestBid) ? ((bestAsk + bestBid) / 2).toFixed(6) : 'N/A'
  
  // Calculate max cumulative amount for depth visualization
  const maxCumulative = Math.max(
    ...bids.map((b: any) => b.cumulative || 0), 
    ...asks.map((a: any) => a.cumulative || 0)
  )

  const OrderRow = ({ order, type, maxCumulative }: { order: Order & { cumulative: number }, type: 'bid' | 'ask', maxCumulative: number }) => {
    const depthPercentage = maxCumulative > 0 ? (order.cumulative / maxCumulative) * 100 : 0
    
    return (
      <div className="relative flex text-xs font-mono py-0.5 hover:bg-surface-light transition duration-100 cursor-pointer">
        {/* Depth Bar (Visual) */}
        <div className={cn(
          "absolute h-full right-0 opacity-20 z-0",
          type === 'bid' ? 'bg-green-500' : 'bg-red-500'
        )} style={{ width: `${depthPercentage}%` }}></div>

        {/* Price (Left column) */}
        <div className={cn(
          "w-1/3 text-left pl-2 z-10",
          type === 'bid' ? 'text-green-400' : 'text-red-400'
        )}>
          {order.price.toFixed(6)}
        </div>

        {/* Amount (Middle column) */}
        <div className="w-1/3 text-right z-10 text-text-secondary">
          {order.amount.toFixed(2)}
        </div>

        {/* Total (Right column) */}
        <div className="w-1/3 text-right pr-2 z-10 text-text">
          {order.total.toFixed(4)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface p-4 rounded-xl shadow-2xl border border-border space-y-3 h-full flex flex-col">
      <h2 className="text-2xl font-extrabold text-primary border-b border-border-light pb-3">
        ORDER BOOK: {tokenA}/{tokenB}
      </h2>
      
      {isLoading && <p className="text-center text-primary">Loading orders...</p>}
      {error && <p className="text-center text-error">{error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-col h-full">
          
          {/* Header Row */}
          <div className="flex text-xs font-medium text-text-tertiary border-b border-border-light pb-1 mb-1 sticky top-0 bg-surface z-20">
            <div className="w-1/3 text-left pl-2">Price ({tokenB})</div>
            <div className="w-1/3 text-right">Amount ({tokenA})</div>
            <div className="w-1/3 text-right pr-2">Total ({tokenB})</div>
          </div>
          
          {/* ASKS (Sellers) - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[30vh]">
            {asks.slice().reverse().map((order, index) => (
              <OrderRow key={index} order={order as any} type="ask" maxCumulative={maxCumulative} />
            ))}
          </div>
          
          {/* Mid-Market Price (Spread) */}
          <div className="text-center py-2 text-lg font-bold my-1 border-y border-border-light bg-surface-light text-text">
            {midPrice} <span className="text-sm text-primary">({tokenB})</span>
          </div>

          {/* BIDS (Buyers) - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[30vh]">
            {bids.map((order, index) => (
              <OrderRow key={index} order={order as any} type="bid" maxCumulative={maxCumulative} />
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const DEFAULT_TOKEN_A = "ETH"
  const DEFAULT_TOKEN_B = "AfroX"

  // Mock data for authentication
  const mockUserAddress = "0x89d24A6b4CcB2EdB6bA4d9eE7de73e86f9cFD9bF"
  const mockIsConnected = true
  
  const [marketTokenA, setMarketTokenA] = useState(DEFAULT_TOKEN_A)
  const [marketTokenB, setMarketTokenB] = useState(DEFAULT_TOKEN_B)
  
  const handleDisconnect = () => {
    console.log("Wallet disconnected (mock)")
    // In a real app, this would disconnect the wallet
  }
  
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      
      {/* 1. Header Component */}
      <EmbeddedHeader
        isConnected={mockIsConnected}
        userAddress={mockUserAddress}
        onDisconnect={handleDisconnect}
      />

      {/* 2. Main Exchange Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Swap Card (3/5 width on desktop) */}
          <div className="lg:col-span-3">
            <EmbeddedSwapCard userAddress={mockUserAddress} />
          </div>

          {/* Right Column: Order Book Feed (2/5 width on desktop) */}
          <div className="lg:col-span-2">
            <EmbeddedOrderBookFeed 
              tokenA={marketTokenA} 
              tokenB={marketTokenB} 
            />
          </div>

        </div>
      </main>

      <footer className="py-4 text-center text-xs text-text-secondary border-t border-border mt-12">
        &copy; 2019-Present AfroDEX - Decentralized Exchange
      </footer>
    </div>
  )
}
