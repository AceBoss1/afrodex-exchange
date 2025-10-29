"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SwapCard from "@/components/swap-card"
import WalletConnect from "@/components/wallet-connect"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setIsConnected(true)
          setUserAddress(accounts[0])
        }
      } catch (error) {
        console.error("[v0] Error checking wallet:", error)
      }
    }
  }

  const handleConnect = (address: string) => {
    setIsConnected(true)
    setUserAddress(address)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setUserAddress("")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header isConnected={isConnected} userAddress={userAddress} onDisconnect={handleDisconnect} />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        {isConnected ? <SwapCard userAddress={userAddress} /> : <WalletConnect onConnect={handleConnect} />}
      </div>
    </main>
  )
}
