"use client"

interface HeaderProps {
  isConnected: boolean
  userAddress: string
  onDisconnect: () => void
}

export default function Header({ isConnected, userAddress, onDisconnect }: HeaderProps) {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/afrodex-logo.png" alt="AfroDex Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary">AfroDex</h1>
            <p className="text-xs text-text-secondary italic">Africa's biggest DEX</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">
            Swap
          </a>
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">
            Liquidity
          </a>
          <a href="#" className="text-text-secondary hover:text-primary transition font-medium">
            Analytics
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-surface-light rounded-lg border border-border">
                <p className="text-sm text-text-secondary font-mono">{truncateAddress(userAddress)}</p>
              </div>
              <button
                onClick={onDisconnect}
                className="px-4 py-2 bg-error hover:bg-red-600 text-white rounded-lg transition font-medium text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <p className="text-text-secondary text-sm hidden sm:block">Connect wallet to trade</p>
          )}
        </div>
      </div>
    </header>
  )
}
