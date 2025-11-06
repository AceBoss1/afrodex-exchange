// pages/index.js
import { useEffect, useState } from 'react'
import useAfroDexContract from '../hooks/useAfroDexContract'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

const ALL_MARKETS = [
      { base: 'AfroX', quote: 'ETH', price: '0.000345', change: 2.15, volume: 154560 },
      { base: 'AfroX', quote: 'WETH', price: '0.000345', change: 2.15, volume: 154560 },
      { base: 'AFDLT', quote: 'ETH', price: '0.001200', change: 1.50, volume: 120400 },
      { base: 'AFDLT', quote: 'WETH', price: '0.001200', change: 1.50, volume: 120400 },
      { base: 'PFARM', quote: 'ETH', price: '0.000089', change: -1.02, volume: 98750 },
      { base: 'PFARM', quote: 'WETH', price: '0.000089', change: -1.02, volume: 98750 },
      { base: 'FREE', quote: 'ETH', price: '0.0000001', change: 0.50, volume: 550000 },
      { base: 'FREE', quote: 'WETH', price: '0.0000001', change: 0.50, volume: 550000 },
      { base: 'LWBT', quote: 'ETH', price: '0.000002', change: 3.10, volume: 320000 },
      { base: 'LWBT', quote: 'WETH', price: '0.000002', change: 3.10, volume: 320000 },
      { base: 'BUSD', quote: 'ETH', price: '0.000258', change: -0.55, volume: 820000 },
      { base: 'BUSD', quote: 'WETH', price: '0.000258', change: -0.55, volume: 820000 },
      { base: 'USDT', quote: 'ETH', price: '0.000259', change: -0.50, volume: 9500000 },
      { base: 'USDT', quote: 'WETH', price: '0.000259', change: -0.50, volume: 9500000 },
      { base: 'PLAAS', quote: 'ETH', price: '0.000090', change: 1.20, volume: 99500 },
      { base: 'PLAAS', quote: 'WETH', price: '0.000090', change: 1.20, volume: 99500 },
      { base: 'T1C', quote: 'ETH', price: '0.000005', change: 0.00, volume: 15000 },
      { base: 'T1C', quote: 'WETH', price: '0.000005', change: 0.00, volume: 15000 },
      { base: 'BCT', quote: 'ETH', price: '0.000075', change: 1.05, volume: 45000 },
      { base: 'BCT', quote: 'WETH', price: '0.000075', change: 1.05, volume: 45000 }
    ];


export default function Home() {
  const [markets] = useState(ALL_MARKETS)
  const [current, setCurrent] = useState(ALL_MARKETS[0])
  const { readContract, writeContract } = useAfroDexContract()
  const { address, isConnected } = useAccount()

  const [orderbook, setOrderbook] = useState({ buys: [], sells: [] })
  const [history, setHistory] = useState([])

  useEffect(() => {
    // update UI values
    if (!readContract) return
    // example call - requires ABI function name getOrderBook(pair)
    (async () => {
      try {
        // adapt to the contract's function signature
        const ob = await readContract.getOrderBook(`${current.base}/${current.quote}`)
        // normalize ob -> setOrderbook({ bu... })
        // placeholder: mock if function not present
        setOrderbook(prev => prev)
      } catch (err) {
        console.log('readContract call failed (ABI mismatch?):', err)
        // fallback: do a local generated orderbook for UI
        setOrderbook(generateLocalOrderbook(current.price))
      }
    })()
    // generate trade history locally
    setHistory(generateLocalHistory(current))
  }, [current, readContract])

  async function placeOrder({price, amount, side}) {
    if (!writeContract) {
      alert('Connect wallet to place orders')
      return
    }
    try {
      // adapt to your contract's placeOrder signature
      const tx = await writeContract.placeOrder(current.base, current.quote, price, amount, side === 'Sell')
      await tx.wait()
      alert('Order placed!')
    } catch (err) {
      console.error(err)
      alert('Order failed: ' + (err?.message ?? err))
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 bg-[#141419] p-4 rounded-xl">
          <h3 className="text-orange-400 font-bold mb-2">Markets</h3>
          {markets.map(m => (
            <div key={`${m.base}/${m.quote}`} className="p-2 hover:bg-white/5 rounded" onClick={()=>setCurrent(m)}>
              <div className="flex justify-between">
                <div>{m.base}/{m.quote}</div>
                <div className={m.change>=0 ? 'text-green-400' : 'text-red-400'}>{m.change}%</div>
              </div>
            </div>
          ))}
        </div>

        <main className="col-span-6 bg-[#141419] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold">{current.base} / {current.quote}</div>
              <div className="text-xs text-gray-400">Last Price ({current.quote})</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-400">{current.price}</div>
              <div className={current.change >= 0 ? 'text-green-400' : 'text-red-400'}>{current.change}%</div>
            </div>
          </div>

          <div className="h-48 bg-[#0f1114] rounded mt-3 flex items-center justify-center">Chart placeholder</div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-[#0f1114] p-3 rounded">Open Orders: 0</div>
            <div className="bg-[#0f1114] p-3 rounded">24h Volume: {current.volume.toLocaleString()}</div>
          </div>

          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-[#141419] p-4 rounded">
              <h4 className="text-orange-400">Order Book</h4>
              <div> /* render orderbook sells/buys */ </div>
            </div>

            <aside className="w-80 bg-[#141419] p-4 rounded">
              <h4 className="text-orange-400">Place Order</h4>
              <OrderForm onPlace={placeOrder} />
            </aside>
          </div>

          <div className="mt-4 bg-[#141419] p-4 rounded">
            <h4 className="text-orange-400">Trade History</h4>
            <div>{/* render history */}</div>
          </div>
        </main>

        <aside className="col-span-3 space-y-4">
          <div className="bg-[#141419] p-4 rounded">My Orders</div>
          <div className="bg-[#141419] p-4 rounded">Top Markets</div>
        </aside>
      </div>
    </div>
  )
}


/* small helpers below (copy these or import) */
function generateLocalOrderbook(priceStr){
  const price = parseFloat(priceStr)
  const sells = [], buys=[]
  for(let i=5;i>0;i--){
    const p=(price+(i*0.000001)).toFixed(6)
    const a=(Math.random()*5).toFixed(4)
    sells.push({price:p, amount:a, total:(p*a).toFixed(6)})
  }
  for(let i=1;i<=5;i++){
    const p=(price-(i*0.000001)).toFixed(6)
    const a=(Math.random()*8).toFixed(4)
    buys.push({price:p, amount:a, total:(p*a).toFixed(6)})
  }
  return {sells, buys}
}

function generateLocalHistory(cur){
  const h=[]
  for(let i=0;i<8;i++){
    h.push({
      time: new Date(Date.now()-i*60000).toLocaleTimeString(),
      pair: `${cur.base}/${cur.quote}`,
      side: Math.random()>0.5 ? 'Buy' : 'Sell',
      price: (parseFloat(cur.price)+(Math.random()-0.5)*0.00001).toFixed(6),
      amount: (Math.random()*5).toFixed(4),
    })
  }
  return h
}

/* OrderForm: simple form component (quick inline) */
function OrderForm({onPlace}){
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={()=>setSide('Buy')} className={`flex-1 py-2 rounded ${side==='Buy'?'bg-white/5':''}`}>Buy</button>
        <button onClick={()=>setSide('Sell')} className={`flex-1 py-2 rounded ${side==='Sell'?'bg-orange-400 text-black':''}`}>Sell</button>
      </div>
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" className="w-full p-2 mb-2 bg-[#0f1114] rounded"/>
      <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="w-full p-2 mb-2 bg-[#0f1114] rounded"/>
      <button onClick={()=>onPlace({price, amount, side})} className="w-full bg-orange-400 text-black py-2 rounded font-bold">Place Order</button>
    </div>
  )
}
