// components/TradeBox.jsx
import { useState } from 'react'
import useOrderFunctions from '../hooks/useOrderFunctions'

export default function TradeBox({ market }) {
  const [price, setPrice] = useState(market.price)
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState('Sell')
  const { order, trade } = useOrderFunctions()

  const place = async () => {
    // For this DLOB, order() signature expects (tokenGet, amountGet, tokenGive, amountGive, expires, nonce)
    // We'll use placeholder expires / nonce here for demo. In production compute properly.
    const tokenGet = market.quote === 'ETH' ? '0x0000000000000000000000000000000000000000' : ''
    const tokenGive = market.base === 'AfroX' ? '0x08130635368AA28b217a4dfb68E1bF8dC525621C' : ''
    // amounts as strings; contract functions will parse
    await order(tokenGet, price, tokenGive, amount, Math.floor(Date.now()/1000) + 3600, Math.floor(Math.random() * 1000000))
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-orange font-semibold">Place Order</h4>
          <div className="flex gap-1 text-xs">
            <button onClick={()=>setSide('Buy')} className={`px-3 py-1 rounded-md ${side==='Buy'? 'bg-white/5':''}`}>Buy</button>
            <button onClick={()=>setSide('Sell')} className={`px-3 py-1 rounded-md ${side==='Sell'? 'bg-orange text-black font-bold':''}`}>Sell</button>
          </div>
        </div>

        <div className="space-y-2">
          <div><label className="text-xs text-gray-400">Price (ETH)</label>
            <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 bg-[#0f1114] rounded-md border border-white/6 text-white" />
          </div>

          <div><label className="text-xs text-gray-400">Amount (Base)</label>
            <input value={amount} onChange={e=>setAmount(e.target.value)} className="w-full mt-1 p-2 bg-[#0f1114] rounded-md border border-white/6 text-white" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>Total (Quote)</div>
            <div>Available: 12.345 ETH</div>
          </div>
        </div>
      </div>

      <div>
        <button onClick={place} className="w-full mt-3 py-2 rounded-lg bg-orange text-black font-bold">Place Order</button>
      </div>
    </div>
  )
}
