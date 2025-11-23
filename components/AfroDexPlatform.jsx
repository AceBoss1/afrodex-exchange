'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import Sidebar from './Sidebar'
import TokenInfoCard from './TokenInfoCard'
import AfroDexABI from '@/lib/abi/AfroDexABI.json'

const CONTRACT_ADDRESS = '0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56'

const SUPPORTED_TOKENS = {
  ETH: { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  AfroX: { symbol: 'AfroX', address: '0x08130635368AA28b217a4dfb68E1bF8dC525621C', decimals: 18 },
  AFDLT: { symbol: 'AFDLT', address: '0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50', decimals: 18 },
  PFARM: { symbol: 'PFARM', address: '0x6a8C66Cab4F766E5E30b4e9445582094303cc322', decimals: 18 },
  FREE: { symbol: 'FREE', address: '0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd', decimals: 18 },
  PLAAS: { symbol: 'PLAAS', address: '0x60571E95E12c78CbA5223042692908f0649435a5', decimals: 18 },
  USDT: { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  BUSD: { symbol: 'BUSD', address: '0x4fabb145d64652a948d72533023f6e7a623c7c53', decimals: 6 },
  DAI: { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  BCT: { symbol: 'BCT', address: '0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80', decimals: 18 },
}

const MOCK_MARKETS = [
  { base: 'AfroX', quote: 'ETH', price: '0.000345', change: '+2.15%' },
  { base: 'AFDLT', quote: 'ETH', price: '0.001200', change: '+1.50%' },
  { base: 'PFARM', quote: 'ETH', price: '0.000089', change: '-1.02%' },
  { base: 'FREE', quote: 'ETH', price: '0.0000001', change: '+0.50%' },
  { base: 'PLAAS', quote: 'ETH', price: '0.000090', change: '+1.20%' },
  { base: 'USDT', quote: 'ETH', price: '0.000259', change: '-0.50%' },
  { base: 'BUSD', quote: 'ETH', price: '0.000258', change: '-0.55%' },
  { base: 'DAI', quote: 'ETH', price: '0.000259', change: '-0.55%' },
  { base: 'BCT', quote: 'ETH', price: '0.000075', change: '+1.05%' },
]

export default function AfroDexPlatform() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState(MOCK_MARKETS[0])
  const [activeTab, setActiveTab] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [balance, setBalance] = useState('0.00')
  const [exchangeBalance, setExchangeBalance] = useState('0.00')
  const [tradeHistory, setTradeHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchBalances()
      const interval = setInterval(fetchBalances, 10000)
      return () => clearInterval(interval)
    }
  }, [isConnected, address, publicClient])

  const fetchBalances = async () => {
    if (!address || !publicClient) return
    try {
      const ethBalance = await publicClient.getBalance({ account: address })
      setBalance(formatUnits(ethBalance, 18))

      const exchangeBal = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: AfroDexABI,
        functionName: 'balanceOf',
        args: [SUPPORTED_TOKENS.ETH.address, address],
      })
      setExchangeBalance(formatUnits(exchangeBal, 18))
    } catch (err) {
      console.error('Error fetching balances:', err)
      setError('Failed to fetch balances')
    }
  }

  const handleDeposit = async () => {
    if (!amount || isNaN(amount)) {
      setError('Enter valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const amountWei = parseUnits(amount, 18)
      const hash = await walletClient.sendTransaction({
        account: address,
        to: CONTRACT_ADDRESS,
        value: amountWei,
        data: '0x',
      })

      await publicClient.waitForTransactionReceipt({ hash })
      setAmount('')
      await fetchBalances()
      alert('✅ Deposit successful!')
    } catch (err) {
      console.error('Deposit error:', err)
      setError('Deposit failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount)) {
      setError('Enter valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const amountWei = parseUnits(amount, 18)
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: AfroDexABI,
        functionName: 'withdraw',
        args: [amountWei],
      })

      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })
      setAmount('')
      await fetchBalances()
      alert('✅ Withdrawal successful!')
    } catch (err) {
      console.error('Withdraw error:', err)
      setError('Withdrawal failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!amount || !transferTo) {
      setError('Enter amount and destination address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const amountWei = parseUnits(amount, 18)
      const hash = await walletClient.sendTransaction({
        account: address,
        to: transferTo,
        value: amountWei,
      })

      await publicClient.waitForTransactionReceipt({ hash })
      setAmount('')
      setTransferTo('')
      alert('✅ Transfer successful!')
    } catch (err) {
      console.error('Transfer error:', err)
      setError('Transfer failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async (side) => {
    if (!amount || isNaN(amount)) {
      setError('Enter valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const baseToken = SUPPORTED_TOKENS[selectedMarket.base]
      const quoteToken = SUPPORTED_TOKENS[selectedMarket.quote]
      const amountWei = parseUnits(amount, baseToken.decimals)

      if (side === 'Buy') {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: CONTRACT_ADDRESS,
          abi: AfroDexABI,
          functionName: 'trade',
          args: [
            baseToken.address,
            amountWei,
            quoteToken.address,
            parseUnits((parseFloat(amount) * parseFloat(selectedMarket.price)).toString(), quoteToken.decimals),
            Math.floor(Date.now() / 1000) + 3600,
            0,
            address,
            0,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            amountWei,
          ],
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })
      } else {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: CONTRACT_ADDRESS,
          abi: AfroDexABI,
          functionName: 'trade',
          args: [
            quoteToken.address,
            parseUnits((parseFloat(amount) * parseFloat(selectedMarket.price)).toString(), quoteToken.decimals),
            baseToken.address,
            amountWei,
            Math.floor(Date.now() / 1000) + 3600,
            0,
            address,
            0,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            amountWei,
          ],
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })
      }

      setTradeHistory([
        {
          id: Date.now(),
          side,
          pair: `${selectedMarket.base}/${selectedMarket.quote}`,
          amount,
          price: selectedMarket.price,
          time: new Date().toLocaleTimeString(),
        },
        ...tradeHistory.slice(0, 9),
      ])

      setAmount('')
      alert('✅ Trade executed!')
    } catch (err) {
      console.error('Trade error:', err)
      setError('Trade failed. Make sure you have enough balance and approvals.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      {/* Your Existing Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      {/* Main Content */}
      <main className={sidebarCollapsed ? 'main collapsed' : 'main'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 20, height: '100%' }}>
          {/* LEFT: Markets & Balance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            {/* Market Selector */}
            <div className="card">
              <h3 className="title-orange">Markets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                {MOCK_MARKETS.map((market) => (
                  <button
                    key={`${market.base}/${market.quote}`}
                    onClick={() => setSelectedMarket(market)}
                    style={{
                      background: selectedMarket.base === market.base ? 'var(--neon-orange)' : 'var(--bg-hover)',
                      color: selectedMarket.base === market.base ? 'black' : 'var(--text-white)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      textAlign: 'left',
                      fontWeight: selectedMarket.base === market.base ? 700 : 500,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{market.base}/{market.quote}</span>
                      <span style={{ color: market.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                        {market.change}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: 4 }}>{market.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Balance Card */}
            {isConnected && (
              <div className="card">
                <h3 className="title-orange">💰 Balance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-gray)' }}>Wallet:</span>
                    <span style={{ fontWeight: 600 }}>{parseFloat(balance).toFixed(4)} ETH</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-gray)' }}>Exchange:</span>
                    <span style={{ fontWeight: 600 }}>{parseFloat(exchangeBalance).toFixed(4)} ETH</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: 8, padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)' }}>
                    {address?.slice(0, 10)}...
                  </div>
                </div>
              </div>
            )}

            {/* Deposit/Withdraw/Transfer */}
            {isConnected && (
              <div className="card">
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {['deposit', 'withdraw', 'transfer'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={activeTab === tab ? 'btn-primary' : 'btn-outline'}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {error && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--danger)', background: 'rgba(255, 78, 78, 0.2)', padding: '8px 12px', borderRadius: 'var(--radius)', marginBottom: 8 }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="number"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                  />

                  {activeTab === 'transfer' && (
                    <input type="text" placeholder="0x..." value={transferTo} onChange={(e) => setTransferTo(e.target.value)} disabled={loading} />
                  )}

                  <button
                    onClick={activeTab === 'deposit' ? handleDeposit : activeTab === 'withdraw' ? handleWithdraw : handleTransfer}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Processing...' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CENTER: Trading Interface */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            {/* Market Header */}
            <div className="card">
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
                {selectedMarket.base}/{selectedMarket.quote}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--neon-orange)' }}>
                  {selectedMarket.price}
                </span>
                <span style={{ color: selectedMarket.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                  {selectedMarket.change}
                </span>
              </div>
            </div>

            {/* Order Book */}
            <div className="card">
              <h3 className="title-orange">📊 Order Book</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)', marginBottom: 8 }}>
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {[
                  { price: (parseFloat(selectedMarket.price) * 1.001).toFixed(6), amount: '100', total: '0.03' },
                  { price: (parseFloat(selectedMarket.price) * 1.0005).toFixed(6), amount: '200', total: '0.06' },
                  { price: selectedMarket.price, amount: '150', total: '0.05' },
                ].map((order, i) => (
                  <div key={`sell-${i}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.9rem', color: 'var(--danger)' }}>
                    <span>{order.price}</span>
                    <span>{order.amount}</span>
                    <span>{order.total}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', padding: '8px 0', borderTop: `1px solid var(--border-gray)`, borderBottom: `1px solid var(--border-gray)`, color: 'var(--neon-orange)', fontWeight: 700, margin: '8px 0' }}>
                Mid: {selectedMarket.price}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { price: (parseFloat(selectedMarket.price) * 0.999).toFixed(6), amount: '120', total: '0.04' },
                  { price: (parseFloat(selectedMarket.price) * 0.9995).toFixed(6), amount: '180', total: '0.06' },
                  { price: (parseFloat(selectedMarket.price) * 0.998).toFixed(6), amount: '90', total: '0.03' },
                ].map((order, i) => (
                  <div key={`buy-${i}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.9rem', color: 'var(--success)' }}>
                    <span>{order.price}</span>
                    <span>{order.amount}</span>
                    <span>{order.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade History */}
            <div className="card">
              <h3 className="title-orange">📈 Recent Trades</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem', maxHeight: 180, overflowY: 'auto' }}>
                {tradeHistory.length === 0 ? (
                  <p style={{ color: 'var(--text-gray)' }}>No trades yet</p>
                ) : (
                  tradeHistory.map((trade) => (
                    <div key={trade.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 4, borderBottom: `1px solid var(--border-gray)`, color: 'var(--text-white)' }}>
                      <span style={{ color: 'var(--text-gray)' }}>{trade.time}</span>
                      <span style={{ color: trade.side === 'Buy' ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                        {trade.side}
                      </span>
                      <span>{parseFloat(trade.amount).toFixed(4)} @ {trade.price}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Swap Panel & Token Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div className="card" style={{ position: 'sticky', top: 0 }}>
              <h3 className="title-orange">🔄 Place Order</h3>

              {error && (
                <div style={{ fontSize: '0.85rem', color: 'var(--danger)', background: 'rgba(255, 78, 78, 0.2)', padding: '8px 12px', borderRadius: 'var(--radius)', marginBottom: 12 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>Amount ({selectedMarket.base})</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading || !isConnected}
                    style={{ marginTop: 6 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>You will receive</label>
                  <div style={{ background: '#0b0b0e', border: '1px solid var(--border-strong)', padding: '10px', borderRadius: 'var(--radius)', marginTop: 6, color: 'var(--text-white)' }}>
                    {amount && !isNaN(amount) ? (parseFloat(amount) / parseFloat(selectedMarket.price)).toFixed(6) : '0.00'} {selectedMarket.quote}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Price:</span>
                    <span>{selectedMarket.price}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Contract:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-gray)' }}>{CONTRACT_ADDRESS.slice(0, 8)}...</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    onClick={() => handleSwap('Buy')}
                    disabled={!isConnected || loading || !amount}
                    style={{
                      background: !isConnected || loading || !amount ? 'var(--bg-hover)' : 'var(--success)',
                      color: !isConnected || loading || !amount ? 'var(--text-gray)' : 'black',
                      fontWeight: 700,
                      padding: '12px',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: !isConnected || loading || !amount ? 'not-allowed' : 'pointer',
                      opacity: !isConnected || loading || !amount ? 0.5 : 1,
                    }}
                  >
                    {loading ? '...' : 'Buy'}
                  </button>
                  <button
                    onClick={() => handleSwap('Sell')}
                    disabled={!isConnected || loading || !amount}
                    style={{
                      background: !isConnected || loading || !amount ? 'var(--bg-hover)' : 'var(--danger)',
                      color: !isConnected || loading || !amount ? 'var(--text-gray)' : 'white',
                      fontWeight: 700,
                      padding: '12px',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: !isConnected || loading || !amount ? 'not-allowed' : 'pointer',
                      opacity: !isConnected || loading || !amount ? 0.5 : 1,
                    }}
                  >
                    {loading ? '...' : 'Sell'}
                  </button>
                </div>

                {!isConnected && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--warning)', background: 'rgba(255, 204, 0, 0.15)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>
                    ⚠️ Connect wallet to trade
                  </div>
                )}
              </div>
            </div>

            {/* Token Info Card */}
            <TokenInfoCard token={{ symbol: selectedMarket.base }} />
          </div>
        </div>
      </main>
    </div>
  )
}