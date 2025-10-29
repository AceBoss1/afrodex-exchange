import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { getContractInstance } from "@/lib/contract"

export async function POST(request: NextRequest) {
  try {
    const { token, amount, userAddress } = await request.json()

    if (!token || !amount || !userAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const rpcUrl = process.env.ETHEREUM_RPC_URL
    if (!rpcUrl) {
      throw new Error("ETHEREUM_RPC_URL not configured")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const contract = getContractInstance(provider)

    // Get relayer for executing deposit
    const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY
    if (!relayerPrivateKey) {
      throw new Error("RELAYER_PRIVATE_KEY not configured")
    }

    const relayer = new ethers.Wallet(relayerPrivateKey, provider)
    const contractWithSigner = contract.connect(relayer)

    // Execute deposit
    const tx = await contractWithSigner.depositToken(token, ethers.parseEther(amount))
    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber,
    })
  } catch (error: any) {
    console.error("[v0] Deposit error:", error)
    return NextResponse.json({ error: error.message || "Deposit failed" }, { status: 500 })
  }
}
