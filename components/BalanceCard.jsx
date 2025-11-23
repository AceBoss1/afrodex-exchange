'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  useSendTransaction,
} from 'wagmi'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import AfroDexABI from '@/lib/abi/AfroDexABI.json'
import WETH9 from '@/lib/abi/WETH9.json'

const EXCHANGE_ADDR = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function BalanceCard({ market = null, token = null }) {
  const { address, isConnected } = useAccount()

  const selected = token
    ? token
    : market
    ? { symbol: market.base, address: market.address, decimals: market.decimals ?? 18 }
    : { symbol: 'ETH', address: null, decimals: 18 }

  const isNative = !selected.address

  const [amount, setAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [tab, setTab] = useState('Deposit')

  const { data: balance } = useBalance({
    address,
    token: isNative ? undefined : selected.address,
    watch: true
  })

  const parsedAmount = (() => {
    try {
      if (!amount || Number(amount) <= 0) return null
      return parseUnits(amount, selected.decimals)
    } catch {
      return null
    }
  })()

  //
  //  DEPOSIT - ETH
  //
  const depositETHPrepare = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'deposit',
    overrides: {
      value: isNative && parsedAmount ? parsedAmount : 0
    },
    enabled: isNative && tab === 'Deposit' && !!parsedAmount
  })

  const depositETH = useContractWrite(depositETHPrepare.config)

  //
  // DEPOSIT - TOKEN
  //
  const depositTokenPrepare = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'depositToken',
    args: [selected.address, parsedAmount ?? 0],
    enabled: !isNative && tab === 'Deposit' && !!parsedAmount
  })

  const depositToken = useContractWrite(depositTokenPrepare.config)

  //
  // APPROVE (token → exchange)
  //
  const approvePrepare = usePrepareContractWrite({
    address: selected.address ?? undefined,
    abi: WETH9,
    functionName: 'approve',
    args: [EXCHANGE_ADDR, parsedAmount ?? 0],
    enabled: !isNative && !!parsedAmount
  })

  const approve = useContractWrite(approvePrepare.config)

  //
  // WITHDRAW - ETH
  //
  const withdrawETHPrepare = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'withdraw',
    args: [parsedAmount ?? 0],
    enabled: isNative && tab === 'Withdraw' && !!parsedAmount
  })

  const withdrawETH = useContractWrite(withdrawETHPrepare.config)

  //
  // WITHDRAW - TOKEN
  //
  const withdrawTokenPrepare = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'withdrawToken',
    args: [selected.address, parsedAmount ?? 0],
    enabled: !isNative && tab === 'Withdraw' && !!parsedAmount
  })

  const withdrawToken = useContractWrite(withdrawTokenPrepare.config)

  //
  // TRANSFER - ETH
  //
  const ethTransfer = useSendTransaction({
    request: {
      to: transferTo,
      value: parsedAmount ?? undefined
    },
    enabled: isNative && tab === 'Transfer' && !!parsedAmount && !!transferTo
  })

  //
  // TRANSFER - TOKEN
  //
  const tokenTransferPrepare = usePrepareContractWrite({
    address: selected.address ?? undefined,
    abi: WETH9,
    functionName: 'transfer',
    args: [transferTo, parsedAmount ?? 0],
    enabled: !isNative && tab === 'Transfer' && !!parsedAmount && !!transferTo
  })

  const tokenTransfer = useContractWrite(tokenTransferPrepare.config)

  //
  // ACTION HANDLERS
  //
  const doDeposit = async () => {
    if (!parsedAmount) return alert("Enter an amount")

    try {
      if (isNative) {
        await depositETH.writeAsync?.() || depositETH.write?.()
      } else {
        await approve.writeAsync?.() || approve.write?.()
        await depositToken.writeAsync?.() || depositToken.write?.()
      }
      alert("Deposit sent!")
    } catch (e) {
      alert(e.message)
    }
  }

  const doWithdraw = async () => {
    if (!parsedAmount) return alert("Enter an amount")

    try {
      if (isNative) {
        await withdrawETH.writeAsync?.() || withdrawETH.write?.()
      } else {
        await withdrawToken.writeAsync?.() || withdrawToken.write?.()
      }
      alert("Withdraw sent!")
    } catch (e) {
      alert(e.message)
    }
  }

  const doTransfer = async () => {
    if (!parsedAmount) return alert("Enter amount")
    if (!transferTo) return alert("Enter destination")

    try {
      if (isNative) {
        await ethTransfer.sendTransactionAsync?.()
      } else {
        await tokenTransfer.writeAsync?.() || tokenTransfer.write?.()
      }
      alert("Transfer sent!")
    } catch (e) {
      alert(e.message)
    }
  }

  //
  // UI
  //
  return (
    <div className="p-4 bg-[#111] rounded-xl border border-gray-700 text-white text-sm">
      <h3 className="font-bold text-orange-400 mb-3">Balance & Transactions</h3>

      <div className="mb-2">
        <div className="text-gray-400 text-xs">Wallet Balance</div>
        <div>{balance ? formatUnits(balance.value, balance.decimals) : "—"} {selected.symbol}</div>
      </div>

      <div className="flex gap-2 mb-3">
        {["Deposit", "Withdraw", "Transfer"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${tab === t ? "bg-white text-black" : "bg-orange-500 text-black"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-2">
        <label className="text-xs text-gray-400">Amount</label>
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 bg-black rounded border border-gray-600 mt-1"
        />
      </div>

      {tab === "Transfer" && (
        <div className="mb-2">
          <label className="text-xs text-gray-400">To</label>
          <input
            value={transferTo}
            onChange={e => setTransferTo(e.target.value)}
            className="w-full p-2 bg-black rounded border border-gray-600 mt-1"
          />
        </div>
      )}

      <div>
        {tab === "Deposit" && <button onClick={doDeposit} className="px-4 py-2 w-full bg-orange-500 rounded">Deposit</button>}
        {tab === "Withdraw" && <button onClick={doWithdraw} className="px-4 py-2 w-full bg-orange-500 rounded">Withdraw</button>}
        {tab === "Transfer" && <button onClick={doTransfer} className="px-4 py-2 w-full bg-orange-500 rounded">Transfer</button>}
      </div>
    </div>
  )
}
