// components/BalanceCard.jsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance, usePrepareContractWrite, useContractWrite, usePrepareSendTransaction, useSendTransaction, useNetwork, usePublicClient } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import AfroDexABI from '@/lib/abi/AfroDexABI.json' // <-- your ABI
// Minimal ERC20 ABI for reads/writes we need:
const ERC20_ABI = [
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] }
]

const EXCHANGE_ADDR = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // from your list

export default function BalanceCard({ market = null, token: tokenProp = null }) {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const publicClient = usePublicClient()

  // Tab: Deposit | Withdraw | Transfer
  const [tab, setTab] = useState('Deposit')

  // Selected token (symbol + address + decimals). Default to market base token if provided, else AfroX
  const selectedFromProp = tokenProp?.address ? tokenProp : (market ? { symbol: market.base, address: (market.address || null) } : null)
  const [selectedToken, setSelectedToken] = useState(selectedFromProp ?? { symbol: 'AfroX', address: '0x08130635368AA28b217a4dfb68E1bF8dC525621C', decimals: 18 })

  // Input fields
  const [inputAmount, setInputAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')

  // Token metadata fetched live when token has address
  const [tokenMeta, setTokenMeta] = useState({ name: selectedToken?.symbol ?? 'Unknown', symbol: selectedToken?.symbol ?? 'TOKEN', decimals: selectedToken?.decimals ?? 18 })

  // wallet native ETH balance (wagmi hook)
  const { data: nativeBalance } = useBalance({
    address,
    watch: true,
    chainId: 1 // mainnet
  })

  // helper: token is ETH (zero address or undefined)
  const isNative = (tok) => !tok?.address || tok.address === '0x0000000000000000000000000000000000000000' || tok.address === null

  // wallet token balance (ERC20) and exchange balance (AfroDex contract ledger)
  const [walletTokenBalanceRaw, setWalletTokenBalanceRaw] = useState(undefined)
  const [exchangeTokenBalanceRaw, setExchangeTokenBalanceRaw] = useState(undefined)
  const [tokenDecimals, setTokenDecimals] = useState(selectedToken?.decimals ?? 18)

  // update selection when props change
  useEffect(() => {
    if (tokenProp?.address) setSelectedToken(tokenProp)
    else if (market) setSelectedToken({ symbol: market.base, address: market.address || null, decimals: market.decimals || 18 })
  }, [tokenProp, market])

  // fetch token metadata (name/symbol/decimals) for ERC20 tokens
  useEffect(() => {
    let mounted = true
    async function fetchMeta() {
      if (!selectedToken || isNative(selectedToken)) {
        setTokenMeta({ name: 'Ether', symbol: 'ETH', decimals: 18 })
        setTokenDecimals(18)
        return
      }
      try {
        const name = await publicClient.readContract({
          address: selectedToken.address,
          abi: ERC20_ABI,
          functionName: 'name'
        })
        const symbol = await publicClient.readContract({
          address: selectedToken.address,
          abi: ERC20_ABI,
          functionName: 'symbol'
        })
        const decimals = await publicClient.readContract({
          address: selectedToken.address,
          abi: ERC20_ABI,
          functionName: 'decimals'
        })
        if (!mounted) return
        setTokenMeta({ name: name ?? selectedToken.symbol, symbol: symbol ?? selectedToken.symbol, decimals: Number(decimals ?? 18) })
        setTokenDecimals(Number(decimals ?? 18))
      } catch (err) {
        // fallback to whatever we have
        setTokenMeta({ name: selectedToken.symbol, symbol: selectedToken.symbol, decimals: selectedToken.decimals ?? 18 })
        setTokenDecimals(selectedToken.decimals ?? 18)
      }
    }
    fetchMeta()
    return () => { mounted = false }
  }, [selectedToken, publicClient])

  // read wallet token balance (if ERC20) and exchange ledger balance
  useEffect(() => {
    let mounted = true
    async function fetchBalances() {
      if (!address || !selectedToken) {
        setWalletTokenBalanceRaw(undefined)
        setExchangeTokenBalanceRaw(undefined)
        return
      }

      if (isNative(selectedToken)) {
        // native ETH wallet balance is from wagmi hook: nativeBalance
        setWalletTokenBalanceRaw(nativeBalance?.value ?? 0n)
      } else {
        try {
          const bal = await publicClient.readContract({
            address: selectedToken.address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address]
          })
          if (mounted) setWalletTokenBalanceRaw(bal)
        } catch (err) {
          if (mounted) setWalletTokenBalanceRaw(0n)
        }
      }

      // read exchange contract balanceOf(token, user)
      try {
        const tokAddr = isNative(selectedToken) ? '0x0000000000000000000000000000000000000000' : selectedToken.address
        const exBal = await publicClient.readContract({
          address: EXCHANGE_ADDR,
          abi: AfroDexABI,
          functionName: 'balanceOf',
          args: [tokAddr, address]
        })
        if (mounted) setExchangeTokenBalanceRaw(exBal)
      } catch (err) {
        // if contract read fails, default to zero
        if (mounted) setExchangeTokenBalanceRaw(0n)
      }
    }
    fetchBalances()
    // watch when selection or address changes
    const t = setInterval(fetchBalances, 8000) // poll every 8s for simple update
    return () => { mounted = false; clearInterval(t) }
  }, [address, selectedToken, nativeBalance, publicClient])

  // Human formatted balances
  const walletBalanceHuman = useMemo(() => {
    if (walletTokenBalanceRaw === undefined) return '—'
    try { return formatUnits(walletTokenBalanceRaw, tokenDecimals) } catch { return '0' }
  }, [walletTokenBalanceRaw, tokenDecimals])

  const exchangeBalanceHuman = useMemo(() => {
    if (exchangeTokenBalanceRaw === undefined) return '—'
    try { return formatUnits(exchangeTokenBalanceRaw, tokenDecimals) } catch { return '0' }
  }, [exchangeTokenBalanceRaw, tokenDecimals])

  // --- PREPARE / WRITE: Deposit (ETH payable) ---
  // For deposit ETH, we call exchange.deposit() payable
  const parsedAmount = (() => {
    try {
      if (!inputAmount || Number(inputAmount) <= 0) return null
      return parseUnits(inputAmount, tokenDecimals)
    } catch {
      return null
    }
  })()

  const prepareDepositETH = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'deposit',
    enabled: isConnected && tab === 'Deposit' && isNative(selectedToken) && parsedAmount !== null,
    payableValue: parsedAmount ?? 0n
  })

  const depositETHWrite = useContractWrite(prepareDepositETH.config)

  // --- PREPARE / WRITE: depositToken(token,address)
  const prepareDepositToken = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'depositToken',
    enabled: isConnected && tab === 'Deposit' && !isNative(selectedToken) && parsedAmount !== null,
    args: [selectedToken.address, parsedAmount ?? 0n]
  })
  const depositTokenWrite = useContractWrite(prepareDepositToken.config)

  // --- PREPARE / WRITE: withdraw (native) and withdrawToken
  const prepareWithdraw = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'withdraw',
    enabled: isConnected && tab === 'Withdraw' && isNative(selectedToken) && parsedAmount !== null,
    args: [parsedAmount ?? 0n]
  })
  const withdrawWrite = useContractWrite(prepareWithdraw.config)

  const prepareWithdrawToken = usePrepareContractWrite({
    address: EXCHANGE_ADDR,
    abi: AfroDexABI,
    functionName: 'withdrawToken',
    enabled: isConnected && tab === 'Withdraw' && !isNative(selectedToken) && parsedAmount !== null,
    args: [selectedToken.address, parsedAmount ?? 0n]
  })
  const withdrawTokenWrite = useContractWrite(prepareWithdrawToken.config)

  // --- PREPARE / WRITE: ERC20 approve (exchange contract) for depositToken flow
  const prepareApprove = usePrepareContractWrite({
    address: selectedToken?.address,
    abi: ERC20_ABI,
    functionName: 'approve',
    enabled: isConnected && !isNative(selectedToken) && parsedAmount !== null,
    args: [EXCHANGE_ADDR, parsedAmount ?? 0n]
  })
  const approveWrite = useContractWrite(prepareApprove.config)

  // --- Transfer: ETH via sendTransaction OR ERC20 transfer
  // ERC20 transfer prepare/write:
  const prepareERC20Transfer = usePrepareContractWrite({
    address: selectedToken?.address,
    abi: ERC20_ABI,
    functionName: 'transfer',
    enabled: isConnected && tab === 'Transfer' && !isNative(selectedToken) && parsedAmount !== null && transferTo !== '',
    args: [transferTo, parsedAmount ?? 0n]
  })
  const erc20TransferWrite = useContractWrite(prepareERC20Transfer.config)

  // ETH send
  const prepareSendTx = usePrepareSendTransaction({
    request: {
      to: transferTo || undefined,
      value: parsedAmount ?? undefined
    },
    enabled: isConnected && tab === 'Transfer' && isNative(selectedToken) && parsedAmount !== null && transferTo !== ''
  })
  const sendTx = useSendTransaction(prepareSendTx.config)

  // UX helpers for running flows
  async function doDeposit() {
    if (!isConnected) return alert('Connect wallet first')
    if (!parsedAmount) return alert('Enter valid amount')
    if (isNative(selectedToken)) {
      // deposit ETH payable
      await depositETHWrite.writeAsync?.()
      return
    } else {
      // ERC20 deposit -> need approve first then depositToken
      try {
        const apr = await approveWrite.writeAsync?.()
        await apr?.wait?.()
      } catch (err) {
        console.error('approve failed', err)
        return alert('Approve failed (user rejected or chain error)')
      }
      // then depositToken
      await depositTokenWrite.writeAsync?.()
    }
  }

  async function doWithdraw() {
    if (!isConnected) return alert('Connect wallet first')
    if (!parsedAmount) return alert('Enter valid amount')
    if (isNative(selectedToken)) {
      await withdrawWrite.writeAsync?.()
    } else {
      await withdrawTokenWrite.writeAsync?.()
    }
  }

  async function doTransfer() {
    if (!isConnected) return alert('Connect wallet first')
    if (!parsedAmount) return alert('Enter valid amount')
    if (!transferTo) return alert('Enter destination address')
    if (isNative(selectedToken)) {
      await sendTx.sendTransaction?.()
    } else {
      await erc20TransferWrite.writeAsync?.()
    }
  }

  // Keep small button styles consistent with your theme classes (btn-small, etc.)
  return (
    <div className="bg-[#141419] rounded-2xl p-4 text-sm border border-[var(--border-gray)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[var(--neon-orange)] font-bold">Balance & Transactions</h3>
        <div className="text-xs text-gray-400">Chain: {chain?.name ?? '—'}</div>
      </div>

      {/* Token Selector (simple) */}
      <div className="mb-3">
        <label className="text-xs text-gray-400">Selected Token</label>
        <div className="flex items-center gap-3 mt-2">
          <div className="text-white font-semibold">{tokenMeta?.symbol ?? selectedToken?.symbol}</div>
          <div className="text-gray-400 text-xs">{tokenMeta?.name}</div>
          <div className="ml-auto text-xs text-gray-400">On-wallet: {walletBalanceHuman} • In-exchange: {exchangeBalanceHuman}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {['Deposit', 'Withdraw', 'Transfer'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${tab === t ? 'bg-white text-black' : 'bg-[var(--neon-orange)] text-black/90'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ⚠️ Warning */}
      <div className="bg-black/40 p-2 rounded-md mb-3 text-xs text-yellow-300">
        ⚠️ Make sure <span className="text-white font-bold">{tokenMeta?.symbol}</span> is the token you want to Deposit, Withdraw, Transfer or Trade. Incorrect transactions are irreversible.
      </div>

      {/* Amount input */}
      <div className="mb-2">
        <label className="text-xs text-gray-400">Amount ({tokenMeta?.symbol})</label>
        <input
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="0.0"
          className="w-full mt-1 p-2 rounded-md bg-black border border-gray-700 text-white text-sm"
        />
      </div>

      {/* Transfer target when Transfer tab */}
      {tab === 'Transfer' && (
        <div className="mb-3">
          <label className="text-xs text-gray-400">To (address)</label>
          <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)} placeholder="0x..." className="w-full mt-1 p-2 rounded-md bg-black border border-gray-700 text-white text-sm" />
        </div>
      )}

      {/* Action button */}
      <div className="flex gap-2">
        {tab === 'Deposit' && (
          <button onClick={doDeposit} className="flex-1 py-2 rounded-md font-semibold btn-primary">
            Deposit {tokenMeta?.symbol}
          </button>
        )}

        {tab === 'Withdraw' && (
          <button onClick={doWithdraw} className="flex-1 py-2 rounded-md font-semibold btn-outline">
            Withdraw {tokenMeta?.symbol}
          </button>
        )}

        {tab === 'Transfer' && (
          <button onClick={doTransfer} className="flex-1 py-2 rounded-md font-semibold btn-primary">
            Transfer {tokenMeta?.symbol}
          </button>
        )}
      </div>

      {/* Extra small helper row */}
      <div className="mt-3 text-xs text-gray-400">
        Wallet balance and exchange balance are shown above. Deposits move funds from your wallet into the AfroDex smart contract; withdrawals return them to your wallet.
      </div>

      {/* Debug / tx states (optional) */}
      <div className="mt-3 text-[11px] text-gray-400 space-y-1">
        {depositETHWrite.isLoading && <div>Sending deposit (ETH)...</div>}
        {depositTokenWrite.isLoading && <div>Sending deposit (ERC20)...</div>}
        {withdrawWrite.isLoading && <div>Sending withdrawal (ETH)...</div>}
        {withdrawTokenWrite.isLoading && <div>Sending withdrawal (ERC20)...</div>}
        {approveWrite.isLoading && <div>Approving token...</div>}
        {erc20TransferWrite.isLoading && <div>Transferring token...</div>}
        {sendTx.isLoading && <div>Sending ETH transfer...</div>}

        {/* Success / error */}
        {depositETHWrite.isSuccess && <div className="text-green-400">Deposit successful (tx pending/confirmed)</div>}
        {depositTokenWrite.isSuccess && <div className="text-green-400">DepositToken successful</div>}
        {withdrawWrite.isSuccess && <div className="text-green-400">Withdraw successful</div>}
        {withdrawTokenWrite.isSuccess && <div className="text-green-400">WithdrawToken successful</div>}
        {approveWrite.isSuccess && <div className="text-green-400">Approve successful</div>}
        {erc20TransferWrite.isSuccess && <div className="text-green-400">Transfer successful</div>}
      </div>
    </div>
  )
}
