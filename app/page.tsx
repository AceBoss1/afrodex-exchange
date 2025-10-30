"use client"

import { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

// --- TAILWIND CONFIGURATION FOR DARK THEME ---
// The custom colors are defined here to be applied as Tailwind classes.
// In a real Next.js app, this would be in tailwind.config.js, but for
// a single-file environment, we apply them directly as classes.
// Base colors mimic the dark, high-contrast scheme from index.html.
// We use the Tailwind JIT script, so these names should work directly.

// Primary: Orange/Yellow for accents
// Background: Near-Black
// Surface: Dark Gray for cards
// Border: Medium Gray for separators
const customColors = {
  'primary': 'text-orange-500', 
  'primary-dark': 'bg-orange-600',
  'background': 'bg-gray-950', // Near-black for main background
  'surface': 'bg-gray-900',    // Dark panel background
  'surface-light': 'bg-gray-800', // Lighter panel elements/hovers
  'border': 'border-gray-700', // Separators
  'border-light': 'border-gray-800',
  'text': 'text-gray-100', // Main text
  'text-secondary': 'text-gray-400',
  'text-tertiary': 'text-gray-600',
  'success': 'text-green-500',
  'error': 'text-red-500',
}

// --- UTILITY FUNCTIONS (cn) ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- MOCK TOKEN DATA ---
const MOCK_TOKENS = [
  // NOTE on Icons: These are simple emojis used to quickly represent the token image
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
  // Base64 encoded SVG for a simple, stylized AfroDEX logo
  const AfroDEXLogoSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="h-8 w-auto">
      <defs>
          <linearGradient id="afroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FCD34D;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F97316;stop-opacity:1" />
          </linearGradient>
      </defs>
      <!-- Background Circle (Represents 'A') -->
      <circle cx="50" cy="50" r="45" fill="url(#afroGradient)"/>
      <!-- Inner Shape (Represents 'D' and 'X') -->
      <path d="M 30 70 L 70 70 L 70 30 L 30 30 Z M 50 50 L 50 50 Z" 
            fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="50" y="62" font-family="Inter, sans-serif" font-size="30" font-weight="900" 
            fill="#111827" text-anchor="middle">A</text>
      <text x="65" y="65" font-family="Inter, sans-serif" font-size="35" font-weight="900" 
            fill="#111827" text-anchor="middle">D</text>
    </svg>
  `
  const base64Logo = btoa(AfroDEXLogoSVG)

  return (
    <header className={cn("border-b sticky top-0 z-50", customColors.surface, customColors.border)}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Using Base64 encoded SVG as logo */}
          <img 
            src={`data:image/svg+xml;base64,${base64Logo}`} 
            alt="AfroDex Logo" 
            className="h-8 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className={cn("text-xl font-bold", customColors.primary)}>AfroDex</h1>
            <p className={cn("text-xs italic", customColors.text_secondary)}>Africa's biggest DEX</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className={cn("hover:text-white transition font-medium", customColors.text_secondary)}>Swap</a>
          <a href="#" className={cn("hover:text-white transition font-medium", customColors.text_secondary)}>Liquidity</a>
          <a href="#" className={cn("hover:text-white transition font-medium", customColors.text_secondary)}>Analytics</a>
        </nav>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className={cn("px-4 py-2 rounded-lg border", customColors.surface_light, customColors.border)}>
                <p className={cn("text-sm font-mono", customColors.text_secondary)}>{TruncateAddress(userAddress)}</p>
              </div>
              <button
                onClick={onDisconnect}
                className={cn("px-4 py-2 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm", customColors.error)}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <p className={cn("text-sm hidden sm:block", customColors.text_secondary)}>Connect wallet to trade</p>
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
      className={cn(
        "rounded-full py-1 px-3 text-sm font-medium focus:ring-primary focus:border-primary appearance-none cursor-pointer",
        customColors.surface, customColors.border, customColors.primary, "border"
      )}
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
    <div className={cn("text-center p-3 rounded-lg text-sm border", customColors.surface, customColors.border)}>
      <p className={customColors.text_secondary}>Exchange Rate</p>
      <p className={cn("font-bold mt-1", customColors.primary)}>
        1 {tokenIn} = {price} {tokenOut}
      </p>
      <p className={cn("text-xs mt-1", customColors.text_tertiary)}>
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
  // FIX: Default swap pair set to ETH/AfroX
  const [tokenIn, setTokenIn] = useState("ETH")
  const [tokenOut, setTokenOut] = useState("AfroX")
  
  const [amountIn, setAmountIn] = useState("")
  const [amountOut, setAmountOut] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [priceData, setPriceData] = useState<any>(null)

  // Mock Price Fetch (Simulates fetching the rate for the swap)
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      // Mocking a price fetch
      let mockRate = 0
      if (tokenIn === 'ETH' && tokenOut === 'USDC') mockRate = 3500
      else if (tokenIn === 'ETH' && tokenOut === 'AfroX') mockRate = 500000 // Mock rate for ETH/AfroX
      else if (tokenIn === 'AfroX' && tokenOut === 'ETH') mockRate = 0.000002 // Mock rate for AfroX/ETH
      else mockRate = 1 / (Math.random() * 1000 + 1) // Generic fallback rate
      
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
      // Using a custom message box instead of alert()
      // Note: In a real app, this should be a proper modal/toast.
      console.log("Swap simulated successfully!")
    }, 2000)
  }

  return (
    <div className={cn("p-6 rounded-xl shadow-2xl border space-y-5", customColors.surface, customColors.border)}>
      <h2 className={cn("text-2xl font-extrabold border-b pb-3", customColors.primary, customColors.border_light)}>DEX SWAP</h2>

      {/* From Token */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", customColors.text_secondary)}>From</label>
        <div className={cn("border rounded-lg p-4 space-y-3", customColors.surface_light, customColors.border)}>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className={cn("w-full text-2xl font-bold bg-transparent focus:outline-none focus:ring-0 appearance-none outline-none border-none leading-none", customColors.text)}
          />
          <TokenSelector selectedToken={tokenIn} onSelect={setTokenIn} />
        </div>
      </div>

      {/* Reverse Button */}
      <div className="flex justify-center">
        <button
          onClick={handleReverse}
          className={cn("p-2 hover:bg-orange-600 rounded-full transition font-bold text-lg border-2", customColors.primary_dark, customColors.background, customColors.text)}
        >
          ⇅
        </button>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", customColors.text_secondary)}>To</label>
        <div className={cn("border rounded-lg p-4 space-y-3", customColors.surface_light, customColors.border)}>
          <div className={cn("text-2xl font-bold", customColors.text)}>{amountOut || "0.0"}</div>
          <TokenSelector selectedToken={tokenOut} onSelect={setTokenOut} />
        </div>
      </div>

      {/* Price Info */}
      <PriceDisplay tokenIn={tokenIn} tokenOut={tokenOut} priceData={priceData} />

      {/* Error Message */}
      {error && <div className={cn("p-3 border rounded-lg text-sm", customColors.error, "bg-red-900/10 border-red-500")}>{error}</div>}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={isLoading || !amountIn || !userAddress}
        className={cn("w-full py-3 hover:bg-orange-600 disabled:opacity-50 font-bold rounded-lg transition text-lg shadow-lg text-black", customColors.primary_dark)}
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
  cumulative: number
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
      if (!tokenA || !tokenB || tokenA === 'undefined' || tokenB === 'undefined') {
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
      // Adjust base price for ETH/AfroX pair (a realistic range for a low-value quote token)
      const basePrice = 0.0000020 // Price of 1 AfroX in ETH (very low value)
      
      // Generate Asks (Sellers) - Price goes up
      for (let i = 0; i < 7; i++) {
        const price = basePrice + (i * 0.00000005 + Math.random() * 0.00000002)
        const amount = (2000 + Math.random() * 5000)
        mockAsks.push({
          price: parseFloat(price.toFixed(8)),
          amount: parseFloat(amount.toFixed(2)),
          total: parseFloat((price * amount).toFixed(6)),
          cumulative: 0, // Placeholder
        })
      }

      // Generate Bids (Buyers) - Price goes down
      for (let i = 0; i < 7; i++) {
        const price = basePrice - (i * 0.00000005 + Math.random() * 0.00000002)
        const amount = (1500 + Math.random() * 4000)
        mockBids.push({
          price: parseFloat(price.toFixed(8)),
          amount: parseFloat(amount.toFixed(2)),
          total: parseFloat((price * amount).toFixed(6)),
          cumulative: 0, // Placeholder
        })
      }
      
      // Apply mock cumulative total for visual depth
      const calculateCumulativeTotal = (orders: Omit<Order, 'cumulative'>[]) => {
        let cumulative = 0
        return orders.map(order => {
          cumulative += order.amount
          return { ...order, cumulative }
        })
      }
      
      const asksWithCumulative = calculateCumulativeTotal(mockAsks.sort((a, b) => a.price - b.price) as Omit<Order, 'cumulative'>[])
      const bidsWithCumulative = calculateCumulativeTotal(mockBids.sort((a, b) => b.price - a.price) as Omit<Order, 'cumulative'>[])
      
      setAsks(asksWithCumulative as Order[])
      setBids(bidsWithCumulative as Order[])
      setIsLoading(false)
    }

    // Initial fetch
    fetchOrderBook()
    
    // Set up interval for refreshing the order book (simulating real-time updates)
    interval = setInterval(fetchOrderBook, 15000); // Refreshes every 15 seconds

    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [tokenA, tokenB]) // Re-run effect when tokens change

  // Find the highest bid and lowest ask to determine the spread/mid-price
  const bestAsk = asks.length > 0 ? asks.sort((a, b) => a.price - b.price)[0]?.price : null
  const bestBid = bids.length > 0 ? bids.sort((a, b) => b.price - a.price)[0]?.price : null
  const midPrice = (bestAsk && bestBid) ? ((bestAsk + bestBid) / 2).toFixed(8) : 'N/A'
  
  // Calculate max cumulative amount for depth visualization
  const maxCumulative = Math.max(
    ...bids.map((b: Order) => b.cumulative || 0), 
    ...asks.map((a: Order) => a.cumulative || 0)
  )

  const OrderRow = ({ order, type, maxCumulative }: { order: Order, type: 'bid' | 'ask', maxCumulative: number }) => {
    const depthPercentage = maxCumulative > 0 ? (order.cumulative / maxCumulative) * 100 : 0
    
    return (
      <div className={cn("relative flex text-xs font-mono py-0.5 transition duration-100 cursor-pointer", customColors.text, "hover:bg-gray-700")}>
        {/* Depth Bar (Visual) */}
        <div className={cn(
          "absolute h-full right-0 opacity-20 z-0",
          type === 'bid' ? 'bg-green-500' : 'bg-red-500'
        )} style={{ width: `${depthPercentage}%` }}></div>

        {/* Price (Left column) */}
        <div className={cn(
          "w-1/3 text-left pl-2 z-10",
          type === 'bid' ? customColors.success : customColors.error
        )}>
          {order.price.toFixed(8)}
        </div>

        {/* Amount (Middle column) */}
        <div className={cn("w-1/3 text-right z-10", customColors.text_secondary)}>
          {order.amount.toFixed(2)}
        </div>

        {/* Total (Right column) */}
        <div className={cn("w-1/3 text-right pr-2 z-10", customColors.text)}>
          {order.total.toFixed(6)}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-4 rounded-xl shadow-2xl border space-y-3 h-full flex flex-col", customColors.surface, customColors.border)}>
      <h2 className={cn("text-2xl font-extrabold border-b pb-3", customColors.primary, customColors.border_light)}>
        ORDER BOOK: {tokenA}/{tokenB}
      </h2>
      
      {isLoading && <p className={cn("text-center", customColors.primary)}>Loading orders...</p>}
      {error && <p className={cn("text-center", customColors.error)}>{error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-col h-full">
          
          {/* Header Row */}
          <div className={cn("flex text-xs font-medium border-b pb-1 mb-1 sticky top-0 z-20", customColors.text_tertiary, customColors.border_light, customColors.surface)}>
            <div className="w-1/3 text-left pl-2">Price ({tokenA})</div>
            <div className="w-1/3 text-right">Amount ({tokenB})</div>
            <div className="w-1/3 text-right pr-2">Total ({tokenA})</div>
          </div>
          
          {/* ASKS (Sellers) - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[30vh]">
            {asks.slice().reverse().map((order, index) => (
              <OrderRow key={index} order={order} type="ask" maxCumulative={maxCumulative} />
            ))}
          </div>
          
          {/* Mid-Market Price (Spread) */}
          <div className={cn("text-center py-2 text-lg font-bold my-1 border-y", customColors.border_light, customColors.surface_light, customColors.text)}>
            {midPrice} <span className={cn("text-sm", customColors.primary)}>({tokenA})</span>
          </div>

          {/* BIDS (Buyers) - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[30vh]">
            {bids.map((order, index) => (
              <OrderRow key={index} order={order} type="bid" maxCumulative={maxCumulative} />
            ))}
          </div>

        </div>
      )}
    </div>
  )
}


// --- 4. User Orders Component (Embedded) ---
interface UserOrder {
  id: string
  type: 'Buy' | 'Sell'
  pair: string
  price: number
  filled: number
  amount: number
  status: 'Open' | 'Closed' | 'Cancelled'
  date: string
}

const MOCK_OPEN_ORDERS: UserOrder[] = [
  { id: '1001', type: 'Buy', pair: 'ETH/AfroX', price: 0.0000019, filled: 0, amount: 5000, status: 'Open', date: '2024-10-30 10:00' },
  { id: '1002', type: 'Sell', pair: 'ETH/AfroX', price: 0.0000025, filled: 1000, amount: 8000, status: 'Open', date: '2024-10-30 10:15' },
]

const MOCK_HISTORY_ORDERS: UserOrder[] = [
  { id: '9001', type: 'Buy', pair: 'USDC/ETH', price: 3450, filled: 1, amount: 1, status: 'Closed', date: '2024-10-29 15:30' },
  { id: '9002', type: 'Sell', pair: 'ETH/AfroX', price: 0.0000021, filled: 500, amount: 500, status: 'Closed', date: '2024-10-29 16:45' },
]

const EmbeddedUserOrders = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open')
  const [openOrders, setOpenOrders] = useState(MOCK_OPEN_ORDERS)
  const [historyOrders, setHistoryOrders] = useState(MOCK_HISTORY_ORDERS)

  const handleCancelOrder = (id: string) => {
    // In a real DEX, this would call a smart contract function
    console.log(`Cancelling order: ${id}`)
    setOpenOrders(prev => prev.filter(order => order.id !== id))
    // Simulate moving it to history
    const cancelledOrder = MOCK_OPEN_ORDERS.find(o => o.id === id)
    if (cancelledOrder) {
      setHistoryOrders(prev => [...prev, { ...cancelledOrder, status: 'Cancelled', date: new Date().toISOString().split('T')[0] }])
    }
  }

  const columns = [
    { name: 'Type', key: 'type' },
    { name: 'Pair', key: 'pair' },
    { name: 'Price', key: 'price' },
    { name: 'Amount', key: 'amount' },
    { name: 'Filled', key: 'filled' },
    { name: 'Status', key: 'status' },
    { name: 'Date', key: 'date' },
  ]
  
  const currentOrders = activeTab === 'open' ? openOrders : historyOrders

  return (
    <div className={cn("p-6 rounded-xl shadow-2xl border mt-8", customColors.surface, customColors.border)}>
      <h2 className={cn("text-2xl font-extrabold border-b pb-3 mb-4", customColors.primary, customColors.border_light)}>Your Trades</h2>

      {/* Tabs */}
      <div className={cn("flex border-b mb-4", customColors.border)}>
        <button
          onClick={() => setActiveTab('open')}
          className={cn(
            "py-2 px-4 text-sm font-semibold transition",
            activeTab === 'open' 
              ? `text-orange-500 border-b-2 border-orange-500` 
              : customColors.text_secondary + ' hover:text-white'
          )}
        >
          Open Orders ({openOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "py-2 px-4 text-sm font-semibold transition",
            activeTab === 'history' 
              ? `text-orange-500 border-b-2 border-orange-500` 
              : customColors.text_secondary + ' hover:text-white'
          )}
        >
          Trade History ({historyOrders.length})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={cn("min-w-full divide-y", customColors.border)}>
          <thead className={customColors.surface_light}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn("px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", customColors.text_tertiary)}
                >
                  {col.name}
                </th>
              ))}
              {activeTab === 'open' && (
                <th scope="col" className={cn("px-6 py-3 text-right text-xs font-medium uppercase tracking-wider", customColors.text_tertiary)}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className={cn("divide-y text-sm", customColors.border)}>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <tr key={order.id} className={cn("transition duration-150 hover:bg-gray-800")}>
                  <td className={cn("px-6 py-3 font-semibold", order.type === 'Buy' ? customColors.success : customColors.error)}>
                    {order.type}
                  </td>
                  <td className={cn("px-6 py-3", customColors.text_secondary)}>{order.pair}</td>
                  <td className={cn("px-6 py-3 font-mono", customColors.text)}>{order.price.toFixed(8)}</td>
                  <td className={cn("px-6 py-3 font-mono", customColors.text)}>{order.amount.toFixed(2)}</td>
                  <td className={cn("px-6 py-3", customColors.text_secondary)}>
                    {order.status === 'Open' 
                      ? `${((order.filled / order.amount) * 100).toFixed(1)}% (${order.filled.toFixed(2)})`
                      : order.filled.toFixed(2)
                    }
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      order.status === 'Open' && 'bg-orange-500/20 text-orange-400',
                      order.status === 'Closed' && 'bg-green-500/20 text-green-400',
                      order.status === 'Cancelled' && 'bg-red-500/20 text-red-400'
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className={cn("px-6 py-3 text-xs", customColors.text_tertiary)}>{order.date}</td>

                  {activeTab === 'open' && (
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className={cn("hover:text-red-600 font-medium text-sm transition", customColors.error)}
                      >
                        Cancel
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (activeTab === 'open' ? 1 : 0)} className={cn("px-6 py-8 text-center italic", customColors.text_secondary)}>
                  No {activeTab === 'open' ? 'open orders' : 'trade history'} found for your wallet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const DEFAULT_TOKEN_A = "ETH"
  const DEFAULT_TOKEN_B = "AfroX" // Default market is ETH/AfroX

  // Mock data for authentication
  const mockUserAddress = "0x89d24A6b4CcB2EdB6bA4d9eE7de73e86f9cFD9bF"
  const mockIsConnected = true
  
  // State initialization for the Order Book
  const [marketTokenA, setMarketTokenA] = useState(DEFAULT_TOKEN_A)
  const [marketTokenB, setMarketTokenB] = useState(DEFAULT_TOKEN_B)
  
  const handleDisconnect = () => {
    console.log("Wallet disconnected (mock)")
  }
  
  return (
    <div className={cn("min-h-screen font-sans", customColors.background, customColors.text)}>
      
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
        
        {/* 3. User Orders Component (Full Width) */}
        <div className="lg:col-span-5">
            <EmbeddedUserOrders />
        </div>
        
      </main>

      <footer className={cn("py-4 text-center text-xs border-t mt-12", customColors.text_secondary, customColors.border)}>
        &copy; 2019-Present AfroDEX - Decentralized Exchange
      </footer>
    </div>
  )
}
