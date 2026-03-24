
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useStaking } from "../hooks/useContract";

export default function Stake() {
  const [amount, setAmount] = useState("");
  const { approve,stake } = useStaking();

  const handleStake = async () => {
    if (!amount) return;

    try {
      await approve(amount);
      await stake(amount);
      alert("Staked!!")
    } catch (err) {
      console.error(err);
      alert("Error staking!!");
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
        onClick={handleStake}
        className="bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
      >
        Stake
      </button>
    </div>
  );
}