import { type NextRequest, NextResponse } from "next/server"
import { getUserTrades } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userAddress = searchParams.get("address")
    const limit = searchParams.get("limit") || "50"

    if (!userAddress) {
      return NextResponse.json({ error: "User address is required" }, { status: 400 })
    }

    const trades = await getUserTrades(userAddress, Number.parseInt(limit))

    return NextResponse.json({
      userAddress,
      trades,
      count: trades.length,
    })
  } catch (error: any) {
    console.error("[v0] History error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch history" }, { status: 500 })
  }
}
