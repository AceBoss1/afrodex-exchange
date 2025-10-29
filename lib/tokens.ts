export const SUPPORTED_TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000", // Zero address for ETH
    decimals: 18,
    icon: "Ξ",
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
