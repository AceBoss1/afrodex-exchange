import Image from 'next/image'
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
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={tokenInfo.logo}
          width={36}
          height={36}
          alt={tokenInfo.name}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold text-white">
            {tokenInfo.name} <span className="text-gray-400 text-sm">({token.symbol})</span>
          </h4>
        </div>
      </div>

      <p className="text-gray-400 mb-3 leading-relaxed">{tokenInfo.description}</p>

      <div className="flex gap-4 text-orange-400 text-xs font-medium">
        <a href={tokenInfo.etherscan} target="_blank" rel="noopener noreferrer" className="hover:underline">
          EtherScan &gt;
        </a>
        <a href={tokenInfo.tracker} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Track Trades &gt;
        </a>
      </div>
    </div>
  )
}


// ✅ Token Meta Registry (Extend Anytime)
const TOKEN_DETAILS = {
  AfroX: {
    name: 'AfroDex',
    logo: '/tokens/afrox.png',
    description:
      'AfroDex serves as a blockchain tech community focused on developing and deploying free or affordable technologies for easier Ethereum and ERC-20 tokens mass adoption.',
    etherscan: 'https://etherscan.io/token/0x08130635368AA28b217a4dfb68E1bF8dC525621C',
    tracker: 'https://coinmarketcap.com/currencies/afrodex/',
  },
  AFDLT: {
    name: 'AfroDex Labs Token',
    logo: '/tokens/afdlttoken.png',
    description:
      'AFDLT powers research, innovation, and decentralized governance across the AfroDex Labs ecosystem.',
    etherscan: 'https://etherscan.io/token/0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50',
    tracker: 'https://coinmarketcap.com/currencies/afrodex-labs-token/',
  },
  PFARM: {
    name: 'PFARM',
    logo: '/tokens/pfarm.png',
    description:
      'PFARM is a utility token supporting decentralized agricultural finance and yield optimization.',
    etherscan: 'https://etherscan.io/token/0x6a8C66Cab4F766E5E30b4e9445582094303cc322',
    tracker: 'https://coinmarketcap.com/currencies/farm-defi/',
  },
  FREE: {
    name: 'FREE Coin',
    logo: '/tokens/free.png',
    description:
      'FREE Coin is one of the largest distributed ERC-20 tokens, designed to fuel global crypto adoption.',
    etherscan: 'https://etherscan.io/token/0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd',
    tracker: 'https://coinmarketcap.com/currencies/free-coin/',
  },
  PLAAS: {
    name: 'PLAAS Farmers Token',
    logo: '/tokens/plaas.png',
    description:
      'PLAAS enables farmers to integrate blockchain for livestock management, logistics, and data analytics.',
    etherscan: 'https://etherscan.io/token/0x60571E95E12c78CbA5223042692908f0649435a5',
    tracker: 'https://coinmarketcap.com/currencies/plaas-farmers-token',
  },
  BCT: {
    name: 'Bitcratic Token',
    logo: '/tokens/bct.png',
    description:
      'BCT empowers decentralized exchange governance and liquidity participation.',
    etherscan: 'https://etherscan.io/token/0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80',
    tracker: 'https://coinmarketcap.com/currencies/bitcratic',
  },
}
