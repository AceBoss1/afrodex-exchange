import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import AfroDexABI from '../lib/abi/AfroDexABI.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function useOrderFunctions() {
  const { config: orderConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: AfroDexABI,
    functionName: 'order',
  });
  const order = useContractWrite(orderConfig);

  const { config: tradeConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: AfroDexABI,
    functionName: 'trade',
  });
  const trade = useContractWrite(tradeConfig);

  const { config: cancelConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: AfroDexABI,
    functionName: 'cancelOrder',
  });
  const cancelOrder = useContractWrite(cancelConfig);

  return { order, trade, cancelOrder };
}
