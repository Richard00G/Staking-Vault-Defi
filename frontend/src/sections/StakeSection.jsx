import { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useStaking } from "../hooks/useContract";
//Components
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";


export default function StakeSection() {
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
    <Card>
        <h2 className="text-x1 font-bold mb-4 text-white">Stake</h2>

        <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount Deposit" />

        <div className="mt-4">
            <Button onClick={handleStake}>Stake Tokens</Button>

        </div>

    </Card>
    
  );
}