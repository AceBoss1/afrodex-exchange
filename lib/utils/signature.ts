import { ethers } from "ethers"

export async function signOrder(
  signer: ethers.Signer,
  orderHash: string,
): Promise<{ v: number; r: string; s: string }> {
  const signature = await signer.signMessage(ethers.getBytes(orderHash))
  const sig = ethers.Signature.from(signature)

  return {
    v: sig.v || 0,
    r: sig.r,
    s: sig.s,
  }
}

export function verifySignature(message: string, signature: string, address: string): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch {
    return false
  }
}
