"use client"

import Link from "next/link"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import WalletConnect from "./wallet-connect"
import { cn } from "@/lib/utils" // Assuming you have a utility for class management (cn)

// Props for the Header component
interface HeaderProps {
  isConnected: boolean
  userAddress: string
  onDisconnect: () => void
}

const navItems = [
  { name: "Swap", href: "/" }, // Set 'Swap' as the homepage link
  { name: "Markets", href: "/markets" },
  { name: "Orderbook", href: "/orderbook" },
  { name: "Smart Contract", href: "/contract" },
  { name: "Help", href: "/help" },
]

export default function Header({ isConnected, userAddress, onDisconnect }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Function to display a short, readable version of the user's address
  const displayAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  
  // Custom Disconnect handler
  const handleDisconnect = () => {
    console.log(`[AfroDEX] Disconnecting wallet: ${userAddress}`);
    onDisconnect();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-surface border-b border-border shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section (Incorporating two-line text from your original) */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/afrodex-logo.png" 
                alt="AfroDEX Logo" 
                className="h-10 w-auto"
                // Placeholder fallback for robust display
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/150x40/000000/FFFFFF?text=AfroDEX"; 
                }}
              />
              {/* Custom Two-Line Text Display */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary leading-tight">AfroDEX</h1>
                <p className="text-xs text-text-secondary italic leading-tight">...Africa's biggest DEX</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation & Wallet Button */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Nav Links */}
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Wallet Status and Button */}
            <div className="ml-4 flex items-center">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-semibold">
                    {displayAddress(userAddress)}
                  </span>
                  <button 
                    onClick={handleDisconnect}
                    className="p-2 rounded-full text-text-secondary hover:bg-border hover:text-error transition-colors"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                // Use a dedicated WalletConnect component here (assumed to be imported)
                <WalletConnect onConnect={() => { /* Handled by parent */ }} />
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:bg-border transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Transition) */}
      <div 
        className={cn(
          "lg:hidden absolute w-full bg-surface shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-border hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Wallet Status */}
          <div className="pt-4 border-t border-border mt-4">
            {isConnected ? (
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-text-secondary">
                  Connected: <span className="text-success font-semibold">{displayAddress(userAddress)}</span>
                </span>
                <button 
                  onClick={handleDisconnect}
                  className="flex items-center justify-center w-full px-3 py-2 border border-error rounded-md text-error text-base font-medium hover:bg-error/10 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Disconnect
                </button>
              </div>
            ) : (
              <WalletConnect onConnect={() => { /* Handled by parent */ }} />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
