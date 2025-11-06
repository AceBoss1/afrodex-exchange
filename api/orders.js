import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { pair, side, price, amount, user } = req.body
    const { data, error } = await supabase.from('orders').insert([{ pair, side, price, amount, user }])
    return res.status(201).json(data)
  }
}
