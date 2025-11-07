// lib/utils.js
export function generateLocalOrderbook(priceStr) {
  const price = parseFloat(priceStr)
  const sells = [], buys = []
  for(let i=5;i>0;i--){
    const p = (price + i*0.000001).toFixed(6)
    const a = (Math.random()*5).toFixed(4)
    sells.push({ price: p, amount: a, total: (p * a).toFixed(6) })
  }
  for(let i=1;i<=5;i++){
    const p = (price - i*0.000001).toFixed(6)
    const a = (Math.random()*8).toFixed(4)
    buys.push({ price: p, amount: a, total: (p * a).toFixed(6) })
  }
  return { sells, buys }
}

export function generateLocalHistory(cur) {
  const rows = []
  for(let i=0;i<8;i++){
    const side = Math.random() > 0.5 ? 'Buy' : 'Sell'
    const price = (parseFloat(cur.price) + (Math.random()-0.5) * 0.00001).toFixed(6)
    const amt = (Math.random() * 5).toFixed(4)
    const total = (price * amt).toFixed(6)
    const t = new Date(Date.now() - i*60000).toLocaleTimeString()
    rows.push({ time: t, pair: `${cur.base}/${cur.quote}`, side, price, amount: amt, total })
  }
  return rows
}
