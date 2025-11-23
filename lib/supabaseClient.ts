import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch trade history from Supabase
 */
export async function getTradeHistory(userAddress: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_address', userAddress)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching trade history:', error)
    return []
  }
}

/**
 * Save trade to Supabase
 */
export async function saveTrade(trade: {
  user_address: string
  token_in: string
  token_out: string
  amount_in: string
  amount_out: string
  transaction_hash: string
  status: 'pending' | 'success' | 'failed'
}) {
  try {
    const { data, error } = await supabase
      .from('trades')
      .insert([{
        user_address: trade.user_address,
        token_in: trade.token_in,
        token_out: trade.token_out,
        amount_in: trade.amount_in,
        amount_out: trade.amount_out,
        transaction_hash: trade.transaction_hash,
        status: trade.status,
        created_at: new Date().toISOString(),
      }])

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving trade:', error)
    return null
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userAddress: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', userAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data || { wallet_address: userAddress, total_trades: 0, total_volume: '0' }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

/**
 * Update user statistics
 */
export async function updateUserStats(userAddress: string, stats: {
  total_trades: number
  total_volume: string
}) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([{
        wallet_address: userAddress,
        total_trades: stats.total_trades,
        total_volume: stats.total_volume,
        updated_at: new Date().toISOString(),
      }], { onConflict: 'wallet_address' })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user stats:', error)
    return null
  }
}

export default supabase