'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useAccount, useBalance, usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'
import AfroDexABI from '@/lib/abi/AfroDexABI.json' // your exchange ABI
import ERC20_ABI from '@/lib/abi/ERC20.json' // minimal ERC20 ABI (we provide below)
import { getToken } from '@/lib/tokens' // helper to index SUPPORTED_TOKENS
import TokenWarningModal from './TokenWarningModal'

export default function BalanceCard({ market }) {
  // market prop: { base: 'AfroX', quote: 'ETH', price: '0.000345', ... }
  const { address } = useAccount()
  const [showWarning, setShowWarning] = useState(false)
  const baseToken = useMemo(() => getToken(market.base), [market])
  const quoteToken = useMemo(() => getToken(market.quote), [market])

  // ETH wallet balance (native)
  const { data: nativeBal } = useBalance({ address, watch: true })
  // exchange contract address (AfroDex)
  const exchangeAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  // Exchange internal balance (tokens[address]) : use exchange contract balanceOf(token, user)
  // AfroDex ABI should have balanceOf(token, user)
  const { data: exchBaseBalance } = useContractRead({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'balanceOf',
    args: [baseToken.address, address],
    watch: true,
    enabled: !!address
  })

  const { data: exchQuoteBalance } = useContractRead({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'balanceOf',
    args: [quoteToken.address, address],
    watch: true,
    enabled: !!address
  })

  // User wallet ERC20 on-chain balances for base and quote
  const { data: walletBase } = useContractRead({
    address: baseToken.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    watch: true,
    enabled: !!address && baseToken.address !== '0x0000000000000000000000000000000000000000'
  })

  const { data: walletQuote } = useContractRead({
    address: quoteToken.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    watch: true,
    enabled: !!address && quoteToken.address !== '0x0000000000000000000000000000000000000000'
  })

  // allowance for deposit (base) - user => exchange
  const { data: allowanceBase } = useContractRead({
    address: baseToken.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address || '0x0000000000000000000000000000000000000000', exchangeAddr],
    watch: true,
    enabled: !!address && baseToken.address !== '0x0000000000000000000000000000000000000000'
  })

  // --- deposit ETH (payable)
  const { config: depositETHConfig } = usePrepareContractWrite({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'deposit',
    args: [],
    // send ETH: value passed to write call
    enabled: !!address
  })
  const depositETH = useContractWrite(depositETHConfig)

  // --- deposit token (approve + depositToken) flow (simplified)
  // We'll prepare depositToken call; approval should be done by ERC20 approve
  const { config: depositTokenConfig } = usePrepareContractWrite({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'depositToken',
    args: [baseToken.address, '0'], // second arg will be replaced before write with BigInt
    enabled: !!address && baseToken.address !== '0x0000000000000000000000000000000000000000'
  })
  const depositToken = useContractWrite(depositTokenConfig)

  // withdraw (ETH)
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'withdraw',
    args: ['0'], // amount placeholder
    enabled: !!address
  })
  const withdrawWrite = useContractWrite(withdrawConfig)

  // withdrawToken
  const { config: withdrawTokenConfig } = usePrepareContractWrite({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'withdrawToken',
    args: [baseToken.address, '0'],
    enabled: !!address && baseToken.address !== '0x0000000000000000000000000000000000000000'
  })
  const withdrawToken = useContractWrite(withdrawTokenConfig)

  // UI local state for inputs
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [transferAddress, setTransferAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')

  // helper to format display
  const fmt = (bn, decimals = 18) => {
    try {
      if (!bn) return '0'
      const n = BigInt(bn.toString())
      const factor = 10n ** BigInt(decimals)
      const whole = n / factor
      const frac = n % factor
      const fracStr = frac.toString().padStart(decimals, '0').slice(0, 6)
      return `${whole.toString()}.${fracStr}`
    } catch (e) {
      return String(bn)
    }
  }

  const onDepositETH = async () => {
    if (!depositAmount || isNaN(Number(depositAmount))) return alert('Invalid amount')
    const value = (BigInt(Math.floor(Number(depositAmount) * 1e18))).toString()
    try {
      await depositETH.write?.({ recklesslySetUnpreparedArgs: [], value })
    } catch (e) {
      console.error(e)
      alert('Deposit failed: ' + (e.message || e))
    }
  }

  const onWithdrawETH = async () => {
    if (!withdrawAmount) return alert('Invalid amount')
    const amountStr = (BigInt(Math.floor(Number(withdrawAmount) * 1e18))).toString()
    try {
      await withdrawWrite.write?.({ recklesslySetUnpreparedArgs: [amountStr] })
    } catch (e) {
      console.error(e)
      alert('Withdraw failed: ' + (e.message || e))
    }
  }

  const onDepositToken = async () => {
    if (!depositAmount || isNaN(Number(depositAmount))) return alert('Invalid amount')
    // Must ensure ERC20 approve first (left as user action)
    const amountStr = (BigInt(Math.floor(Number(depositAmount) * (10 ** (baseToken.decimals || 18))))).toString()
    try {
      await depositToken.write?.({ recklesslySetUnpreparedArgs: [baseToken.address, amountStr] })
    } catch (e) {
      console.error(e)
      alert('depositToken failed: ' + (e.message || e))
    }
  }

  const onWithdrawToken = async () => {
    if (!withdrawAmount) return alert('Invalid amount')
    const amountStr = (BigInt(Math.floor(Number(withdrawAmount) * (10 ** (baseToken.decimals || 18))))).toString()
    try {
      await withdrawToken.write?.({ recklesslySetUnpreparedArgs: [baseToken.address, amountStr] })
    } catch (e) {
      console.error(e)
      alert('withdrawToken failed: ' + (e.message || e))
    }
  }

  // deposit/withdraw UI: show both wallet balance and exchange balance and clear warning
  return (
    <div className="bg-[#141419] rounded-2xl p-4 text-sm text-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[var(--orange)] font-semibold">BALANCE</h4>
        <div className="text-xs text-gray-400">Deposit | Withdraw | Transfer</div>
      </div>

      <div className="bg-[#0f1114] rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={baseToken.logo || '/tokens/placeholder.png'} width={36} height={36} alt={baseToken.symbol} className="rounded-full" />
            <div>
              <div className="font-semibold">{baseToken.name} <span className="text-gray-400 text-xs">({baseToken.symbol})</span></div>
              <div className="text-xs text-gray-400">Wallet: {walletBase ? fmt(walletBase, baseToken.decimals) : '0'} • Exchange: {exchBaseBalance ? fmt(exchBaseBalance, baseToken.decimals) : '0'}</div>
            </div>
          </div>

          <div className="text-right text-xs text-gray-400">
            <div>Token</div>
            <div className="mt-1">{baseToken.symbol}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <button className="col-span-1 py-2 rounded-md bg-[#0f1114] text-xs" onClick={() => setShowWarning(true)}>Deposit</button>
        <button className="col-span-1 py-2 rounded-md bg-[#0f1114] text-xs" onClick={() => setShowWarning(true)}>Withdraw</button>
        <button className="col-span-1 py-2 rounded-md bg-[#0f1114] text-xs" onClick={() => setShowWarning(true)}>Transfer</button>
      </div>

      {/* Quick deposit / withdraw inputs */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Amount ({baseToken.symbol})</label>
        <input value={depositAmount} onChange={(e)=>setDepositAmount(e.target.value)} placeholder="0.0" className="w-full p-2 bg-[#0b0b0f] rounded-md border border-white/6" />

        <div className="flex gap-2">
          <button onClick={baseToken.address === '0x0000000000000000000000000000000000000000' ? onDepositETH : onDepositToken } className="flex-1 py-2 rounded-lg bg-[var(--orange)] text-black font-semibold">Deposit</button>
          <button onClick={baseToken.address === '0x0000000000000000000000000000000000000000' ? onWithdrawETH : onWithdrawToken } className="flex-1 py-2 rounded-lg bg-transparent border border-[var(--orange)] text-[var(--orange)] font-semibold">Withdraw</button>
        </div>

        <div className="pt-2 text-xs text-gray-400">
          <div>Wallet Balance: {nativeBal ? fmt(nativeBal.value, nativeBal.decimals) : '0'} {nativeBal?.symbol || 'ETH (native)'}</div>
          <div className="mt-1">Allowance to Exchange: {allowanceBase ? fmt(allowanceBase, baseToken.decimals) : '0'}</div>
        </div>
      </div>

      {/* Transfer UI (simple) */}
      <div className="mt-4 border-t border-white/6 pt-3">
        <div className="text-xs text-gray-400 mb-2">Transfer (ERC-20)</div>
        <input value={transferAddress} onChange={(e)=>setTransferAddress(e.target.value)} placeholder="Recipient address" className="w-full p-2 bg-[#0b0b0f] rounded-md border border-white/6 mb-2" />
        <input value={transferAmount} onChange={(e)=>setTransferAmount(e.target.value)} placeholder="Amount" className="w-full p-2 bg-[#0b0b0f] rounded-md border border-white/6 mb-2" />
        {/* Transfer code left minimal: implement ERC20 transfer with usePrepareContractWrite on the token contract */}
        <div className="text-xs text-gray-500">Transfer requires ERC-20 transfer transaction (user wallet → recipient). This is separate from exchange deposit/withdraw balances.</div>
      </div>

      <TokenWarningModal open={showWarning} onClose={()=>setShowWarning(false)} tokenName={baseToken.name} />
    </div>
  )
}
