import { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useStaking } from "../hooks/useContract";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const withdraw = async () => {
    try {
      await writeContractAsync({
        ...useStaking,
        functionName: "withdraw",
        args: [parseEther(amount)],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="number"
        placeholder="Amount"
        className="p-2 rounded bg-[#0f172a] border border-gray-600"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={withdraw}
        disabled={isPending}
        className="bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        {isPending ? "Withdrawing..." : "Withdraw"}
      </button>
    </div>
  );
}