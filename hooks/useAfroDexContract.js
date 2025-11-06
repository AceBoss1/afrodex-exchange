import { useMemo } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import ABI from "../lib/abi.json";

export default function useAfroDexContract() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const address =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0xE8FfF15bB5E14095bFdfA8Bb85D83cC900c23C56";

  const read = useMemo(() => ({
    address,
    abi: ABI,
    publicClient,
  }), [publicClient]);

  const write = useMemo(() => ({
    address,
    abi: ABI,
    walletClient,
  }), [walletClient]);

  return { read, write, address };
}
