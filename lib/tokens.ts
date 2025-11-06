export const SUPPORTED_TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000", // Zero address for ETH
    decimals: 18,
    icon: "Ξ",
  },
    AfroX: {
    symbol: "AfroX",
    name: "AfroDex",
    address: "0x08130635368AA28b217a4dfb68E1bF8dC525621C",
    decimals: 18,
    icon: "Ξ",
  },
    AFDLT: {
    symbol: "AFDLT",
    name: "AfroDex Labs Token",
    address: "0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50",
    decimals: 18,
    icon: "Ξ",
  },
    PFARM: {
    symbol: "PFARM",
    name: "FARM DeFi",
    address: "0x6a8C66Cab4F766E5E30b4e9445582094303cc322",
    decimals: 18,
    icon: "Ξ",
  },
      BCT: {
    symbol: "BCT",
    name: "Bitcratic",
    address: "0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80",
    decimals: 18,
    icon: "Ξ",
  },
      PLAAS: {
    symbol: "PLAAS",
    name: "PLAAS FARMERS TOKEN",
    address: "0x60571E95E12c78CbA5223042692908f0649435a5",
    decimals: 18,
    icon: "Ξ",
  },
    FREE: {
    symbol: "FREE",
    name: "Free Coin",
    address: "0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd",
    decimals: 18,
    icon: "◆",
  },
    T1C: {
    symbol: "T1C",
    name: "Travel1Click",
    address: "0xa7C71d444bf9aF4bfEd2adE75595d7512Eb4DD39",
    decimals: 18,
    icon: "◆",
  },
    LWBT: {
    symbol: "LWBT",
    name: "Living Without Borders Token",
    address: "0xA03c34eE9fA0e8db36Dd9bF8D46631Bb25F66302",
    decimals: 18,
    icon: "◆",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    icon: "$",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    icon: "$",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    icon: "◆",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    icon: "Ξ",
  },
}

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS

export function getToken(symbol: TokenSymbol) {
  return SUPPORTED_TOKENS[symbol]
}

export function getAllTokens() {
  return Object.values(SUPPORTED_TOKENS)
}
