"use client"

import { useState } from "react"

interface WalletConnectProps {
  onConnect: (address: string) => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const connectWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (!window.ethereum) {
        setError("MetaMask not installed. Please install MetaMask to continue.")
        setIsLoading(false)
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        console.log("[v0] Wallet connected:", accounts[0])
        onConnect(accounts[0])
      }
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🦊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Welcome to AfroDex</h2>
            <p className="text-text-secondary">Africa's biggest decentralized exchange</p>
            <p className="text-text-secondary text-sm mt-2">Connect your wallet to start trading crypto assets</p>
          </div>
        </div>

        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-lg transition text-lg"
        >
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </button>

        {error && <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm">{error}</div>}

        <p className="text-text-secondary text-xs">By connecting, you agree to our Terms of Service</p>
      </div>
    </div>
  )
}
