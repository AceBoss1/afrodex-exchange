'use client'
import React from 'react'
import { X } from 'lucide-react'

export default function TokenWarningModal({ open, onClose, tokenName }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#141419] rounded-2xl p-5 w-[420px] text-sm text-gray-200 border border-white/6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚠️</span>
              <h3 className="font-semibold">Be careful — confirm token</h3>
            </div>
            <p className="text-gray-400 text-xs mt-2">Make sure <strong>{tokenName}</strong> is the token you actually want to Deposit, Withdraw, Transfer or Trade. Multiple tokens can share the same name. Always verify contract address.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="py-2 px-3 rounded-md bg-transparent border border-white/6 text-gray-300">Cancel</button>
          <button onClick={onClose} className="py-2 px-3 rounded-md bg-[var(--orange)] text-black font-semibold">I Understand</button>
        </div>
      </div>
    </div>
  )
}
