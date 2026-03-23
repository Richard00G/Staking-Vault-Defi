import { useState } from "react";
import { parseEther } from "viem";
import { useStaking } from "../hooks/useContract";


export default function Stake() {
  const [input, setInput] = useState("0");

  const amount = parseEther(input || "0");

  const { allowance, approve, stake } = useStaking(amount);

  const needsApproval = allowance < amount;

  const handleAction = async () => {
    try {
      if (needsApproval) {
        console.log("🔵 Approving...");
        await approve();
      } else {
        console.log("🟢 Staking...");
        await stake();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stake Tokens</h2>

      <input
        type="number"
        placeholder="Amount"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleAction}>
        {needsApproval ? "Approve" : "Stake"}
      </button>
    </div>
  );
}