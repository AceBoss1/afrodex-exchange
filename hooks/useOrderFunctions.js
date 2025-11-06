import { useState } from "react";
import { parseEther } from "viem";
import useAfroDexContract from "./useAfroDexContract";

export default function useOrderFunctions() {
  const { write } = useAfroDexContract();
  const [loading, setLoading] = useState(false);

  async function order(tokenGet, amountGet, tokenGive, amountGive, expires, nonce) {
    setLoading(true);
    try {
      const tx = await write.walletClient.writeContract({
        address: write.address,
        abi: write.abi,
        functionName: "order",
        args: [
          tokenGet,
          parseEther(amountGet.toString()),
          tokenGive,
          parseEther(amountGive.toString()),
          BigInt(expires),
          BigInt(nonce),
        ],
      });
      console.log("✅ Order sent:", tx);
      return tx;
    } catch (error) {
      console.error("❌ Order error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s) {
    try {
      const tx = await write.walletClient.writeContract({
        address: write.address,
        abi: write.abi,
        functionName: "cancelOrder",
        args: [
          tokenGet,
          parseEther(amountGet.toString()),
          tokenGive,
          parseEther(amountGive.toString()),
          BigInt(expires),
          BigInt(nonce),
          v,
          r,
          s,
        ],
      });
      console.log("✅ Order cancelled:", tx);
      return tx;
    } catch (err) {
      console.error("❌ Cancel order error:", err);
    }
  }

  async function trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount) {
    try {
      const tx = await write.walletClient.writeContract({
        address: write.address,
        abi: write.abi,
        functionName: "trade",
        args: [
          tokenGet,
          parseEther(amountGet.toString()),
          tokenGive,
          parseEther(amountGive.toString()),
          BigInt(expires),
          BigInt(nonce),
          user,
          v,
          r,
          s,
          parseEther(amount.toString()),
        ],
      });
      console.log("✅ Trade executed:", tx);
      return tx;
    } catch (error) {
      console.error("❌ Trade error:", error);
    }
  }

  return { order, cancelOrder, trade, loading };
}
