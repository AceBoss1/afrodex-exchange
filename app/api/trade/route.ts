import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { getContractInstance } from "@/lib/contract"

export async function POST(request: NextRequest) {
  try {
    const { tokenGet, amountGet, tokenGive, amountGive, expires, nonce, userAddress, signature } = await request.json()

    if (!tokenGet || !amountGet || !tokenGive || !amountGive || !userAddress || !signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Parse signature
    const sig = ethers.Signature.from(signature)

    // Get provider and contract
    const rpcUrl = process.env.ETHEREUM_RPC_URL
    if (!rpcUrl) {
      throw new Error("ETHEREUM_RPC_URL not configured")
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const contract = getContractInstance(provider)

    // Get relayer private key (for executing the trade)
    const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY
    if (!relayerPrivateKey) {
      throw new Error("RELAYER_PRIVATE_KEY not configured")
    }

    const relayer = new ethers.Wallet(relayerPrivateKey, provider)
    const contractWithSigner = contract.connect(relayer)

    // Execute trade on contract
    const tradeAmount = amountGet // Amount to trade
    const tx = await contractWithSigner.trade(
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      expires,
      nonce,
      userAddress,
      sig.v,
      sig.r,
      sig.s,
      tradeAmount,
    )

    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      gasUsed: receipt?.gasUsed.toString(),
    })
  } catch (error: any) {
    console.error("[v0] Trade error:", error)
    return NextResponse.json({ error: error.message || "Trade failed" }, { status: 500 })
  }
}
