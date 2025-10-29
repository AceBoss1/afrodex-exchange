"use client"

/**
 * This is a static preview component showing what the AfroDex UI looks like
 * It doesn't require backend or wallet connection to display
 */

export default function UIPreview() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/afrodex-logo.png" alt="AfroDex Logo" className="h-12 w-auto" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-text-secondary hover:text-primary transition">
              Swap
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition">
              Liquidity
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition">
              Analytics
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-surface-light rounded-lg border border-border">
              <p className="text-sm text-text-secondary">0x1234...5678</p>
            </div>
            <button className="px-4 py-2 bg-error hover:bg-red-600 text-white rounded-lg transition font-medium text-sm">
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-text">Swap</h2>

            {/* From Token */}
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">From</label>
              <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
                <input
                  type="number"
                  placeholder="0.0"
                  defaultValue="1.0"
                  className="w-full bg-transparent text-2xl font-bold text-text placeholder-text-secondary outline-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">ETH</span>
                  <span className="text-text-secondary text-sm">Balance: 2.5 ETH</span>
                </div>
              </div>
            </div>

            {/* Reverse Button */}
            <div className="flex justify-center">
              <button className="p-2 bg-primary hover:bg-primary-dark text-background rounded-full transition">
                ⇅
              </button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">To</label>
              <div className="bg-surface-light border border-border rounded-lg p-4 space-y-3">
                <div className="text-2xl font-bold text-text">2,450.50</div>
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">USDC</span>
                  <span className="text-text-secondary text-sm">Balance: 5,000 USDC</span>
                </div>
              </div>
            </div>

            {/* Price Info */}
            <div className="bg-surface-light border border-border rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Price</span>
                <span className="text-text font-semibold">1 ETH = 2,450.50 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Fee</span>
                <span className="text-text font-semibold">0.3%</span>
              </div>
            </div>

            {/* Swap Button */}
            <button className="w-full py-3 bg-primary hover:bg-primary-dark text-background font-bold rounded-lg transition">
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
