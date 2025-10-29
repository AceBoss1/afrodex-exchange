import express, { type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Web3 Provider
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo")

// Contract configuration - UPDATE WITH YOUR CONTRACT DETAILS
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56"
const CONTRACT_ABI = JSON.parse(process.env.CONTRACT_ABI || "[]")

let contract: ethers.Contract

// Initialize contract
try {
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  console.log("[v0] Contract initialized:", CONTRACT_ADDRESS)
} catch (error) {
  console.error("[v0] Failed to initialize contract:", error)
}

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Get token price (example - adjust based on your contract)
app.post("/api/price", async (req: Request, res: Response) => {
  try {
    const { tokenIn, tokenOut, amountIn } = req.body

    if (!tokenIn || !tokenOut || !amountIn) {
      return res.status(400).json({ error: "Missing required parameters" })
    }

    // Call your contract's price function
    // This is a template - adjust based on your contract's actual function
    const price = await contract.getPrice?.(tokenIn, tokenOut, amountIn)

    res.json({
      tokenIn,
      tokenOut,
      amountIn,
      price: price?.toString() || "0",
    })
  } catch (error) {
    console.error("[v0] Price calculation error:", error)
    res.status(500).json({ error: "Failed to calculate price" })
  }
})

// Execute trade (requires wallet signature)
app.post("/api/trade", async (req: Request, res: Response) => {
  try {
    const { tokenIn, tokenOut, amountIn, userAddress, signedTx } = req.body

    if (!tokenIn || !tokenOut || !amountIn || !userAddress || !signedTx) {
      return res.status(400).json({ error: "Missing required parameters" })
    }

    // Send signed transaction to blockchain
    const txResponse = await provider.broadcastTransaction(signedTx)
    const receipt = await txResponse.wait()

    res.json({
      success: true,
      transactionHash: receipt?.hash,
      blockNumber: receipt?.blockNumber,
    })
  } catch (error) {
    console.error("[v0] Trade execution error:", error)
    res.status(500).json({ error: "Failed to execute trade" })
  }
})

// Get transaction history (requires database)
app.get("/api/history/:userAddress", async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params

    // TODO: Fetch from database
    res.json({
      userAddress,
      trades: [],
      message: "Database integration needed",
    })
  } catch (error) {
    console.error("[v0] History fetch error:", error)
    res.status(500).json({ error: "Failed to fetch history" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`)
  console.log(`[v0] Contract address: ${CONTRACT_ADDRESS}`)
})
