// This block should be included in your main layout or Head component.

<Head>
    {/* 1. Load the Ethers library FIRST. This is the foundation for all crypto operations. */}
    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"></script> 

    {/* 2. Load custom utilities and configuration. 
        These define variables (AfroDexConfig) and functions (AfroDexUtils) used by the main logic. */}
    <script src="/smart_contract_config.js"></script>
    <script src="/js/utility.js"></script>

    {/* 3. Load the main trading logic LAST. 
        This file contains the functions (like placeOrder) that call the utilities and configs. */}
    <script src="/js/dapp_main.js"></script>
</Head>

 "use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import SwapCard from "@/components/swap-card"
import WalletConnect from "@/components/wallet-connect"

// Type definition for the global placeOrder function defined in js/dapp_main.js
declare global {
  interface Window {
    placeOrder: (
      isBuy: boolean, 
      tokenSell: string, 
      tokenBuy: string, 
      amountSell: string, 
      amountBuy: string, 
      user: string
    ) => Promise<void>;
  }
}

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
          // Ensure address is checksummed if necessary, but using as-is for now
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

  // --- NEW LOGIC: Wraps the global placeOrder function ---
  const handlePlaceOrder = useCallback(async (
    isBuy: boolean, 
    tokenSell: string, 
    tokenBuy: string, 
    amountSell: string, 
    amountBuy: string
  ) => {
    if (!userAddress || typeof window.placeOrder !== 'function') {
      console.error("Wallet not connected or placeOrder function not loaded.")
      return
    }

    try {
      // Call the global function defined in js/dapp_main.js
      await window.placeOrder(isBuy, tokenSell, tokenBuy, amountSell, amountBuy, userAddress)
      console.log("Order submitted successfully to backend.")
      // TODO: Add logic here to refresh balances or display a success message
    } catch (error) {
      console.error("Error submitting order:", error)
      // TODO: Display user-friendly error message
    }
  }, [userAddress])
  // --- END NEW LOGIC ---

  return (
    <main className="min-h-screen bg-background">
      <Header isConnected={isConnected} userAddress={userAddress} onDisconnect={handleDisconnect} />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        {isConnected ? (
          <SwapCard 
            userAddress={userAddress} 
            onPlaceOrder={handlePlaceOrder} // Pass the handler to the SwapCard
          /> 
        ) : (
          <WalletConnect onConnect={handleConnect} />
        )}
      </div>
    </main>
  )
}

