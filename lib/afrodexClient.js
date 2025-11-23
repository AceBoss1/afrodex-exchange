// lib/afrodexClient.js
import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import AfroDexABI from "@/lib/abi/AfroDexABI.json"

export const exchangeAddr = "0xE8FfF15bB5E14095bFdfA8Bb85D83cC900c23C56"

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
})

// 🟠 Fetch Order Book by Token Pair
export async function fetchOrderBook(base, quote) {
  try {
    const [buyOrders, sellOrders] = await Promise.all([
      publicClient.readContract({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: "getBuyOrdersByPair",
        args: [base, quote],
      }),
      publicClient.readContract({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: "getSellOrdersByPair",
        args: [base, quote],
      }),
    ])

    return {
      buys: (buyOrders || []).slice(-10),
      sells: (sellOrders || []).slice(-10),
    }
  } catch (err) {
    console.error("Error fetching orderbook:", err)
    return { buys: [], sells: [] }
  }
}

// 🟢 Fetch Last 10 Trades
export async function fetchTradeHistory(base, quote) {
  try {
    const trades = await publicClient.readContract({
      address: exchangeAddr,
      abi: AfroDexABI,
      functionName: "getTradesByPair",
      args: [base, quote],
    })

    const sliced = (trades || []).slice(-10)
    return sliced.map((t) => ({
      time: Number(t.timestamp) * 1000,
      pair: `${t.baseSymbol}/${t.quoteSymbol}`,
      side: t.side ? "Buy" : "Sell",
      price: Number(t.price) / 1e18,
      amount: Number(t.amount) / 1e18,
    }))
  } catch (err) {
    console.error("Error fetching trade history:", err)
    return []
  }
}

// 📊 Market Stats for Selected Pair
export async function fetchMarketStats(base, quote) {
  try {
    const [volume, lastPrice] = await Promise.all([
      publicClient.readContract({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: "getPairVolume",
        args: [base, quote],
      }),
      publicClient.readContract({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: "getLastTradePrice",
        args: [base, quote],
      }),
    ])
    return { volume: Number(volume), lastPrice: Number(lastPrice) / 1e18 }
  } catch (err) {
    console.error("Error fetching stats:", err)
    return { volume: 0, lastPrice: 0 }
  }
}
