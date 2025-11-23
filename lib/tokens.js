// lib/tokens.js
// Official AfroDex Token Registry

export const SUPPORTED_TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logo: '/tokens/eth.png',
    description: 'Ethereum native token',
  },
  AfroX: {
    symbol: 'AfroX',
    name: 'AfroDex',
    address: '0x08130635368AA28b217a4dfb68E1bF8dC525621C',
    decimals: 18,
    logo: '/tokens/afrox.png',
    description:
      'AfroDex serves as a blockchain tech community focused on developing and deploying free or affordable technologies for easier Ethereum and ERC-20 tokens mass adoption.',
    etherscan: 'https://etherscan.io/token/0x08130635368AA28b217a4dfb68E1bF8dC525621C',
    tracker: 'https://coinmarketcap.com/currencies/afrodex/',
  },
  AFDLT: {
    symbol: 'AFDLT',
    name: 'AfroDex Labs Token',
    address: '0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50',
    decimals: 18,
    logo: '/tokens/afdlts.png',
    description:
      'AFDLT powers research, innovation, and decentralized governance across the AfroDex Labs ecosystem.',
    etherscan: 'https://etherscan.io/token/0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50',
    tracker: 'https://coinmarketcap.com/currencies/afrodex-labs-token/',
  },
  PFARM: {
    symbol: 'PFARM',
    name: 'PFARM',
    address: '0x6a8C66Cab4F766E5E30b4e9445582094303cc322',
    decimals: 18,
    logo: '/tokens/pfarm.png',
    description:
      'PFARM is a utility token supporting decentralized agricultural finance and yield optimization.',
    etherscan: 'https://etherscan.io/token/0x6a8C66Cab4F766E5E30b4e9445582094303cc322',
    tracker: 'https://coinmarketcap.com/currencies/farm-defi/',
  },
  FREE: {
    symbol: 'FREE',
    name: 'FREE Coin',
    address: '0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd',
    decimals: 18,
    logo: '/tokens/free.png',
    description:
      'FREE Coin is one of the largest distributed ERC-20 tokens, designed to fuel global crypto adoption.',
    etherscan: 'https://etherscan.io/token/0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd',
    tracker: 'https://coinmarketcap.com/currencies/free-coin/',
  },
  PLAAS: {
    symbol: 'PLAAS',
    name: 'PLAAS Farmers Token',
    address: '0x60571E95E12c78CbA5223042692908f0649435a5',
    decimals: 18,
    logo: '/tokens/plaas.png',
    description:
      'PLAAS enables farmers to integrate blockchain for livestock management, logistics, and data analytics.',
    etherscan: 'https://etherscan.io/token/0x60571E95E12c78CbA5223042692908f0649435a5',
    tracker: 'https://coinmarketcap.com/currencies/plaas-farmers-token/',
  },
  LWBT: {
    symbol: 'LWBT',
    name: 'Living Without Borders Token',
    address: '0xA03c34eE9fA0e8db36Dd9bF8D46631Bb25F66302',
    decimals: 18,
    logo: '/tokens/lwbt.png',
    description:
      'LWBT powers lifestyle on the Living Without Borders International ecosystem.',
    etherscan: 'https://etherscan.io/token/0xA03c34eE9fA0e8db36Dd9bF8D46631Bb25F66302',
    tracker: 'https://LWBinternational.org/',
  },
  T1C: {
    symbol: 'T1C',
    name: 'Travel1Click',
    address: '0xa7C71d444bf9aF4bfEd2adE75595d7512Eb4DD39',
    decimals: 18,
    logo: '/tokens/t1c.png',
    description:
      'T1C powers research, innovation, and decentralized travel ecosystem.',
    etherscan: 'https://etherscan.io/token/0xa7C71d444bf9aF4bfEd2adE75595d7512Eb4DD39',
    tracker: 'https://coinmarketcap.com/currencies/travel1click/',
  },
  BCT: {
    symbol: 'BCT',
    name: 'Bitcratic Token',
    address: '0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80',
    decimals: 18,
    logo: '/tokens/bct.png',
    description:
      'BCT empowers decentralized exchange governance and liquidity participation on Bitcratic.',
    etherscan: 'https://etherscan.io/token/0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80',
    tracker: 'https://coinmarketcap.com/currencies/bitcratic/',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    logo: '/tokens/usdt.png',
    description: 'Tether USD stablecoin',
    etherscan: 'https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7',
    tracker: 'https://coinmarketcap.com/currencies/tether/',
  },
  BUSD: {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    decimals: 6,
    logo: '/tokens/busd.png',
    description: 'Binance USD stablecoin',
    etherscan: 'https://etherscan.io/token/0x4fabb145d64652a948d72533023f6e7a623c7c53',
    tracker: 'https://coinmarketcap.com/currencies/binance-usd/',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    logo: '/tokens/dai.png',
    description: 'Dai decentralized stablecoin',
    etherscan: 'https://etherscan.io/token/0x6B175474E89094C44Da98b954EedeAC495271d0F',
    tracker: 'https://coinmarketcap.com/currencies/multi-collateral-dai/',
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    logo: '/tokens/weth.png',
    description: 'Wrapped Ethereum token',
    etherscan: 'https://etherscan.io/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tracker: 'https://coinmarketcap.com/currencies/wrapped-ether/',
  },
}

/**
 * Get token by symbol
 */
export function getToken(symbol) {
  return SUPPORTED_TOKENS[symbol] || null
}

/**
 * Get all supported tokens as array
=======

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
  { base: 'DAI', quote: 'ETH', price: '0.000259', change: -0.55, volume: 120000 },
  { base: 'DAI', quote: 'WETH', price: '0.000259', change: -0.55, volume: 362700 },
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
  BUSD: { symbol: 'BUSD', name: 'Binance USD', address: '0x4fabb145d64652a948d72533023f6e7a623c7c53', decimals: 6 },
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
>>>>>>> 323bf7bc432ce2476a31c479e8d302b0b7e6c24d
 */
export function getAllTokens() {
  return Object.values(SUPPORTED_TOKENS)
}

/**
 * Get token by address
 */
export function getTokenByAddress(address) {
  return Object.values(SUPPORTED_TOKENS).find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Check if token is supported
 */
export function isTokenSupported(symbol) {
  return symbol in SUPPORTED_TOKENS
}

export default SUPPORTED_TOKENS
