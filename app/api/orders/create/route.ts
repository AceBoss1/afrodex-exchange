import { type NextRequest, NextResponse } from "next/server"
import { hashOrder } from "@/lib/contract"

export async function POST(request: NextRequest) {
  try {
    const { tokenGet, amountGet, tokenGive, amountGive, userAddress } = await request.json()

    if (!tokenGet || !amountGet || !tokenGive || !amountGive || !userAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const contractAddress = process.env.CONTRACT_ADDRESS || "0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56"
    const expires = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    const nonce = Math.floor(Math.random() * 1000000)

    const orderHash = hashOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, contractAddress)

    return NextResponse.json({
      orderHash,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      expires,
      nonce,
      contractAddress,
      message: "Order created. Please sign this hash with your wallet.",
    })
  } catch (error: any) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
