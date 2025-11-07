// components/MarketList.jsx
import React, { useState, useEffect } from 'react'

export default function MarketList({ markets, onSelect }) {
  const [filter, setFilter] = useState('')
  const [list, setList] = useState(markets)

  useEffect(()=> {
    setList(markets.filter(m => `${m.base}/${m.quote}`.toLowerCase().includes(filter.toLowerCase())))
  }, [filter, markets])

  return (
    <div className="bg-[#141419] rounded-2xl p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-orange">Markets</h3>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search markets..." className="bg-[#0f1114] text-sm px-3 py-2 rounded-md border border-white/6 focus:outline-none" />
      </div>

      <div className="space-y-2">
        {list.map((m, i) => (
          <div key={`${m.base}/${m.quote}-${i}`} onClick={()=>onSelect(m)} className="flex justify-between p-2 rounded-md hover:bg-white/3 cursor-pointer">
            <div>
              <div className="font-semibold">{m.base}/{m.quote}</div>
              <div className="text-xs text-gray-400">Vol {Number(m.volume).toLocaleString()}</div>
            </div>
            <div className={m.change>=0 ? 'text-green-400' : 'text-red-400'}>{m.change>0?'+':''}{m.change}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
