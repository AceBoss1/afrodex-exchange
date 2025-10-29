import { neon } from "@neondatabase/serverless"

let sql: any = null

export function getDb() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    sql = neon(databaseUrl)
  }
  return sql
}

export async function saveTrade(tradeData: {
  userAddress: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  transactionHash: string
  blockNumber?: number
}) {
  const sql = getDb()

  try {
    const result = await sql`
      INSERT INTO trades (
        user_address,
        token_in,
        token_out,
        amount_in,
        amount_out,
        transaction_hash,
        block_number,
        status
      ) VALUES (
        ${tradeData.userAddress},
        ${tradeData.tokenIn},
        ${tradeData.tokenOut},
        ${tradeData.amountIn},
        ${tradeData.amountOut},
        ${tradeData.transactionHash},
        ${tradeData.blockNumber || null},
        'completed'
      )
    `
    return result
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getUserTrades(userAddress: string, limit = 50) {
  const sql = getDb()

  try {
    const result = await sql`
      SELECT * FROM trades
      WHERE user_address = ${userAddress}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

export async function getTokens() {
  const sql = getDb()

  try {
    const result = await sql`
      SELECT * FROM tokens
      WHERE is_active = true
      ORDER BY symbol ASC
    `
    return result
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}
