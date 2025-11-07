// lib/tokens.js

// --- All mock markets for AfroDex ---
export const ALL_MARKETS = [
  { base: 'AfroX', quote: 'ETH', price: '0.000345', change: 2.15, volume: 154560 },
  { base: 'AfroX', quote: 'WETH', price: '0.000345', change: 2.15, volume: 152660 },
  { base: 'AFDLT', quote: 'ETH', price: '0.001200', change: 1.50, volume: 120400 },
  { base: 'AFDLT', quote: 'WETH', price: '0.001200', change: 1.50, volume: 124460 },
  { base: 'PFARM', quote: 'ETH', price: '0.000089', change: -1.02, volume: 98750 },
  { base: 'PFARM', quote: 'WETH', price: '0.000089', change: -1.02, volume: 96363 },
  { base: 'FREE', quote: 'ETH', price: '0.0000001', change: 0.50, volume: 550000 },
  { base: 'FREE', quote: 'WETH', price: '0.0000001', change: 0.50, volume: 579280 },
  { base: 'LWBT', quote: 'ETH', price: '0.000002', change: 3.10, volume: 320000 },
  { base: 'LWBT', quote: 'WETH', price: '0.000002', change: 3.10, volume: 393470 },
  { base: 'BUSD', quote: 'ETH', price: '0.000258', change: -0.55, volume: 820000 },
  { base: 'BUSD', quote: 'WETH', price: '0.000258', change: -0.55, volume: 878030 },
  { base: 'USDT', quote: 'ETH', price: '0.000259', change: -0.50, volume: 9500000 },
  { base: 'USDT', quote: 'WETH', price: '0.000259', change: -0.50, volume: 9179200 },
  { base: 'PLAAS', quote: 'ETH', price: '0.000090', change: 1.20, volume: 99500 },
  { base: 'PLAAS', quote: 'WETH', price: '0.000090', change: 1.20, volume: 72930 },
  { base: 'T1C', quote: 'ETH', price: '0.000005', change: 0.00, volume: 15000 },
  { base: 'T1C', quote: 'WETH', price: '0.000005', change: 0.00, volume: 53460 },
  { base: '1CT', quote: 'ETH', price: '0.000004', change: -2.10, volume: 12000 },
  { base: '1CT', quote: 'WETH', price: '0.000004', change: -2.10, volume: 36270 },
  { base: 'BCT', quote: 'ETH', price: '0.000075', change: 1.05, volume: 45000 },
  { base: 'BCT', quote: 'WETH', price: '0.000075', change: 1.05, volume: 38430 }
]

// --- Supported tokens registry ---
export const SUPPORTED_TOKENS = {
  ETH: { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  AfroX: { symbol: 'AfroX', name: 'AfroDex', address: '0x08130635368AA28b217a4dfb68E1bF8dC525621C', decimals: 18 },
  AFDLT: { symbol: 'AFDLT', name: 'AfroDex Labs Token', address: '0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50', decimals: 18 },
  PFARM: { symbol: 'PFARM', name: 'FARM DeFi', address: '0x6a8C66Cab4F766E5E30b4e9445582094303cc322', decimals: 18 },
  FREE: { symbol: 'FREE', name: 'Free Coin', address: '0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd', decimals: 18 },
  T1C: { symbol: 'T1C', name: 'Travel1Click', address: '0xa7C71d444bf9aF4bfEd2adE75595d7512Eb4DD39', decimals: 18 },
  PLAAS: { symbol: 'PLAAS', name: 'PLAAS Farmers Token', address: '0x60571E95E12c78CbA5223042692908f0649435a5', decimals: 18 },
  BCT: { symbol: 'BCT', name: 'Bitcratic', address: '0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80', decimals: 18 },
  LWBT: { symbol: 'LWBT', name: 'Living Without Borders Token', address: '0xA03c34eE9fA0e8db36Dd9bF8D46631Bb25F66302', decimals: 18 },
  USDC: { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  USDT: { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  DAI: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  WETH: { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 }
}

// --- Helper functions (pure JS, no TS) ---

/**
 * Get token object by symbol
 * @param {string} symbol - token symbol (e.g. 'ETH')
 * @returns {object|null}
 */
export function getToken(symbol) {
  return SUPPORTED_TOKENS[symbol] || null
}

/**
 * Get all supported tokens as an array
 * @returns {Array}
 */
export function getAllTokens() {
  return Object.values(SUPPORTED_TOKENS)
}
