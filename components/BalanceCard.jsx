'use client'
import { useState, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import AfroDexABI from '@/lib/abi/AfroDexABI.json'
import { SUPPORTED_TOKENS } from '@/lib/tokens'

const exchangeAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function BalanceCard({ market }) {
  const { address, isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState(market?.base)
  const [amount, setAmount] = useState('')

  // --- Detect token from market dynamically
  useEffect(() => {
    setSelectedToken(market?.base)
  }, [market])

  const tokenMeta = SUPPORTED_TOKENS[selectedToken] || SUPPORTED_TOKENS['ETH']

  // --- Read user wallet balance directly
  const { data: walletBalData } = useBalance({
    address,
    token: tokenMeta.symbol === 'ETH' ? undefined : tokenMeta.address,
    watch: true,
  })
  const walletBalance = walletBalData ? formatEther(walletBalData.value) : '0.0'

  // --- Read user exchange balance from contract mapping
  const { data: exchangeBalData, refetch: refetchExchangeBal } = useReadContract({
    address: exchangeAddr,
    abi: AfroDexABI,
    functionName: 'balanceOf',
    args: [tokenMeta.address, address],
    watch: true,
  })
  const exchangeBalance = exchangeBalData ? formatEther(exchangeBalData) : '0.0'

  // --- Write contract hooks for deposit/withdraw/transfer
  const { writeContract: write } = useWriteContract()

  // deposit ETH (payable)
  const handleDepositETH = async () => {
    if (!amount) return alert('Enter amount')
    try {
      await write({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: 'deposit',
        value: parseEther(amount),
      })
      setAmount('')
      refetchExchangeBal()
    } catch (err) {
      console.error(err)
      alert('Deposit failed.')
    }
  }

  // deposit ERC20
  const handleDepositToken = async () => {
    if (!amount) return alert('Enter amount')
    try {
      await write({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: 'depositToken',
        args: [tokenMeta.address, parseEther(amount)],
      })
      setAmount('')
      refetchExchangeBal()
    } catch (err) {
      console.error(err)
      alert('Deposit failed.')
    }
  }

  // withdraw
  const handleWithdraw = async () => {
    if (!amount) return alert('Enter amount')
    try {
      await write({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: 'withdraw',
        args: [tokenMeta.address, parseEther(amount)],
      })
      setAmount('')
      refetchExchangeBal()
    } catch (err) {
      console.error(err)
      alert('Withdraw failed.')
    }
  }

  // transfer (off-chain or on-chain direct to another wallet)
  const handleTransfer = async () => {
    if (!amount) return alert('Enter amount')
    const to = prompt('Enter recipient wallet address:')
    if (!to) return
    try {
      await write({
        address: exchangeAddr,
        abi: AfroDexABI,
        functionName: 'transfer',
        args: [tokenMeta.address, parseEther(amount), to],
      })
      setAmount('')
      refetchExchangeBal()
    } catch (err) {
      console.error(err)
      alert('Transfer failed.')
    }
  }

  return (
    <div className="bg-[#141419] text-white rounded-2xl p-4 mt-4">
      <h3 className="text-lg font-semibold text-orange-400 mb-3">BALANCE</h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-black/40 text-white rounded-lg p-2 border border-white/10 focus:outline-none"
        />
      </div>

      <div className="flex justify-between gap-2 mb-4">
        {tokenMeta.symbol === 'ETH' ? (
          <button
            onClick={handleDepositETH}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-black rounded-lg py-2 font-semibold"
          >
            Deposit
          </button>
        ) : (
          <button
            onClick={handleDepositToken}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-black rounded-lg py-2 font-semibold"
          >
            Deposit
          </button>
        )}
        <button
          onClick={handleWithdraw}
          className="flex-1 bg-black border border-orange-500 text-orange-400 rounded-lg py-2 font-semibold"
        >
          Withdraw
        </button>
        <button
          onClick={handleTransfer}
          className="flex-1 bg-black border border-orange-500 text-orange-400 rounded-lg py-2 font-semibold"
        >
          Transfer
        </button>
      </div>

      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-orange-400 text-left">
            <th>Token</th>
            <th>Wallet</th>
            <th>AfroDex</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tokenMeta.symbol}</td>
            <td>{Number(walletBalance).toFixed(4)}</td>
            <td>{Number(exchangeBalance).toFixed(4)}</td>
          </tr>
          <tr>
            <td>WETH</td>
            <td>—</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 text-xs text-yellow-400 flex items-start gap-2">
        ⚠️ <span>Make sure <b>{tokenMeta.symbol}</b> is the token you actually want to Deposit, Withdraw, Transfer or Trade. Multiple tokens can share the same name.</span>
      </div>
    </div>
  )
}
