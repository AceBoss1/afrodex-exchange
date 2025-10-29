import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { getContractInstance } from "@/lib/contract"

export async function POST(request: NextRequest) {
  try {
    const { token, userAddress } = await request.json()

    if (!token || !userAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const rpcUrl = process.env.ETHEREUM_RPC_URL
    if (!rpcUrl) {
      throw new Error("ETHEREUM_RPC_URL not configured")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const contract = getContractInstance(provider)

    // Get balance from contract
    const balance = await contract.balanceOf(token, userAddress)

    return NextResponse.json({
      token,
      userAddress,
      balance: ethers.formatEther(balance),
      balanceRaw: balance.toString(),
    })
  } catch (error: any) {
    console.error("[v0] Balance error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch balance" }, { status: 500 })
  }
}
