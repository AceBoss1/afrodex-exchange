// hooks/useAfroDexContract.js
import { useMemo } from 'react'
import { useProvider, useSigner } from 'wagmi'
import { Contract } from 'ethers'
import ABI from '../lib/abi.json'

export default function useAfroDexContract() {
  const provider = useProvider()
  const { data: signer } = useSigner()

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  const readContract = useMemo(() => {
    if (!provider || !contractAddress) return null
    return new Contract(contractAddress, ABI, provider)
  }, [provider])

  const writeContract = useMemo(() => {
    if (!signer || !contractAddress) return null
    return new Contract(contractAddress, ABI, signer)
  }, [signer])

  return { readContract, writeContract }
}
