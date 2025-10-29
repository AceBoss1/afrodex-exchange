"use client"

import { useEffect, useState } from "react"

interface BalanceDisplayProps {
  token: string
  userAddress: string
}

export default function BalanceDisplay({ token, userAddress }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string>("0")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userAddress && token) {
      fetchBalance()
    }
  }, [userAddress, token])

  const fetchBalance = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userAddress }),
      })

      if (!response.ok) throw new Error("Failed to fetch balance")
      const data = await response.json()
      setBalance(Number.parseFloat(data.balance).toFixed(4))
    } catch (error) {
      console.error("[v0] Balance fetch error:", error)
      setBalance("0")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-sm text-text-secondary">
      Balance: <span className="font-semibold text-text">{loading ? "..." : balance}</span> {token}
    </div>
  )
}
