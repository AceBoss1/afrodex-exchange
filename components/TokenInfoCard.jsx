// components/TokenInfoCard.jsx
import React from 'react'

export default function TokenInfoCard({ token }) {
  if (!token) return null

  const tokenInfo = TOKEN_DETAILS[token.symbol]

  if (!tokenInfo) return (
    <div className="bg-[#141419] rounded-xl p-3 text-sm text-gray-400">
      No token information available.
    </div>
  )

  return (
    <div className="bg-[#141419] rounded-xl p-4 mt-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-400 text-lg">🟠</span>
        <div>
          <h4 className="font-semibold text-white">{tokenInfo.name} <span className="text-gray-400 text-sm">({token.symbol})</span></h4>
        </div>
      </div>
      <p className="text-gray-400 mb-3">{tokenInfo.description}</p>
      <div className="flex gap-4 text-orange-400 text-xs">
        <a
          href={tokenInfo.etherscan}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          EtherScan &gt;
        </a>
        <a
          href={tokenInfo.tracker}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Track Trades &gt;
        </a>
      </div>
    </div>
  )
}

// Token details map
const TOKEN_DETAILS = {
  AfroX: {
    name: 'AfroDex',
    description:
      'AfroDex serves as a blockchain tech community focused on developing and deploying free or affordable technologies for easier Ethereum and ERC-20 tokens mass adoption.',
    etherscan:
      'https://etherscan.io/token/0x08130635368AA28b217a4dfb68E1bF8dC525621C',
    tracker: 'https://coincodex.com/crypto/afrodex/',
  },
  AFDLT: {
    name: 'AfroDex Labs Token',
    description:
      'AfroDex Labs Token (AFDLT) powers research, development, and governance for AfroDex Labs blockchain initiatives.',
    etherscan:
      'https://etherscan.io/token/0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50',
    tracker: 'https://coincodex.com/crypto/afrodex-labs-token/',
  },
  PFARM: {
    name: 'FARM DeFi',
    description:
      'FARM DeFi (PFARM) supports decentralized agricultural finance and sustainable farming incentives.',
    etherscan:
      'https://etherscan.io/token/0x6a8C66Cab4F766E5E30b4e9445582094303cc322',
    tracker: 'https://coingecko.com/en/coins/pfarm',
  },
  PLAAS: {
    name: 'PLAAS FARMERS TOKEN',
    description:
      'PLAAS connects farmers through blockchain to digital markets, logistics, and data analytics.',
    etherscan:
      'https://etherscan.io/token/0x60571E95E12c78CbA5223042692908f0649435a5',
    tracker: 'https://coingecko.com/en/coins/plaas-farmers-token',
  },
  FREE: {
    name: 'Free Coin',
    description:
      'FREE Coin is one of the most distributed ERC-20 tokens, designed to encourage crypto mass adoption through availability and utility.',
    etherscan:
      'https://etherscan.io/token/0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd',
    tracker: 'https://coincodex.com/crypto/free-coin/',
  },
  BCT: {
    name: 'Bitcratic Token',
    description:
      'Bitcratic Token represents the first decentralized exchange governance model on Ethereum.',
    etherscan:
      'https://etherscan.io/token/0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80',
    tracker: 'https://coingecko.com/en/coins/bitcratic',
  },
}
