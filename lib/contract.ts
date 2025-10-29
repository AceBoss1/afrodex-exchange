import { ethers } from "ethers"

const CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "tokenGet", type: "address" },
      { name: "amountGet", type: "uint256" },
      { name: "tokenGive", type: "address" },
      { name: "amountGive", type: "uint256" },
      { name: "expires", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "user", type: "address" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    name: "trade",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "tokenGet", type: "address" },
      { name: "amountGet", type: "uint256" },
      { name: "tokenGive", type: "address" },
      { name: "amountGive", type: "uint256" },
      { name: "expires", type: "uint256" },
      { name: "nonce", type: "uint256" },
    ],
    name: "order",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "bytes32" },
    ],
    name: "orderFills",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "tokenGet", type: "address" },
      { name: "amountGet", type: "uint256" },
      { name: "tokenGive", type: "address" },
      { name: "amountGive", type: "uint256" },
      { name: "expires", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "cancelOrder",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "depositToken",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "token", type: "address" },
      { name: "user", type: "address" },
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
]

export function getContractInstance(provider: ethers.Provider) {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56"
  return new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
}

export function getContractWithSigner(signer: ethers.Signer) {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56"
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer)
}

// Hash order for signing
export function hashOrder(
  tokenGet: string,
  amountGet: string,
  tokenGive: string,
  amountGive: string,
  expires: number,
  nonce: number,
  contractAddress: string,
) {
  return ethers.solidityPackedKeccak256(
    ["address", "uint256", "address", "uint256", "uint256", "uint256", "address"],
    [tokenGet, amountGet, tokenGive, amountGive, expires, nonce, contractAddress],
  )
}
