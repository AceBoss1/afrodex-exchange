import Image from 'next/image'
import { SUPPORTED_TOKENS } from '@/lib/tokens'

export default function TokenInfoCard({ token }) {
  if (!token || !token.symbol) return null

  const info = SUPPORTED_TOKENS[token.symbol]

  if (!info) {
    return (
      <div className="bg-[#141419] rounded-2xl p-4 text-sm text-white">
        <h3 className="text-[#F97316] font-semibold mb-3">Token Information</h3>
        <div className="text-gray-400 italic">
          This token is not yet officially listed on AfroDex.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#141419] rounded-2xl p-4 text-sm text-white border border-[rgba(255,255,255,0.05)]">
      <h3 className="text-[#F97316] font-semibold mb-3">Token Information</h3>

      <div className="flex items-center gap-3 mb-3">
        {info.logo && (
          <Image
            src={info.logo}
            width={36}
            height={36}
            alt={info.name}
            className="rounded-full"
          />
        )}
        <div>
          <h4 className="font-semibold text-white">
            {info.name} <span className="text-gray-400">({info.symbol})</span>
          </h4>
        </div>
      </div>

      <p className="text-gray-400 mb-3 leading-relaxed text-xs">
        {info.description}
      </p>

      <div className="flex gap-4 text-[#F97316] text-xs font-medium">
        {info.etherscan && (
          <a
            href={info.etherscan}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            EtherScan &gt;
          </a>
        )}
        {info.tracker && (
          <a
            href={info.tracker}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Track Trades &gt;
          </a>
        )}
      </div>
    </div>
  )
}
