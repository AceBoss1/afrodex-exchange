// import-trades.js
const fs = require('fs')
const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function importFile(filePath) {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false })

  console.log(`Found ${rows.length} rows. Preparing to insert...`)

  // Normalize and insert in batches
  const batchSize = 200
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map((r) => {
      // Map columns from your excel to DB columns:
      // adjust these keys to match your sheet headers
      return {
        tx_hash: r['tx_hash'] || r['TxHash'] || null,
        time: r['time'] || r['timestamp'] || r['Time'] || null,
        pair: r['pair'] || r['Pair'] || null,
        side: r['side'] || r['Side'] || null,
        price: r['price'] ? Number(r['price']) : null,
        amount: r['amount'] ? Number(r['amount']) : null,
        total: r['total'] ? Number(r['total']) : null,
        maker: r['maker'] || r['Maker'] || null,
        taker: r['taker'] || r['Taker'] || null,
        notes: r['notes'] || null,
      }
    })

    const { data, error } = await supabase
      .from('trades')
      .insert(batch)

    if (error) {
      console.error('Insert error at batch', i, error)
      process.exit(1)
    } else {
      console.log(`Inserted rows ${i}..${i + batch.length}`)
    }
  }

  console.log('Import complete')
}

const filePath = process.argv[2] || './export- transactions-afrodex-exchange-0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56.xlsx'
importFile(filePath).catch(console.error)
