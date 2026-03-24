import { useState } from "react";
import { useStaking } from "../hooks/useContract";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const { withdraw } = useStaking(); //

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) return;

    try {
      await withdraw(amount); //
      alert("✅ Withdraw exitoso");
    } catch (err) {
      console.error(err);
      alert("❌ Error withdraw");
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
        onClick={handleWithdraw}
        className="bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        Withdraw
      </button>
    </div>
  );
}