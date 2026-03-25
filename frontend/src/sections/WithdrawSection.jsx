import { useState } from "react";
import { useStaking } from "../hooks/useContract";
//Components
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

export default function WithdrawSection() {
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
    <Card>

        <h2 className="text-x1 font-bold mb-4 text-white">Withdraw</h2>

        <Input 
          value={amount}
          placeholder="Amount Withdraw"
          onChange={(e) => setAmount(e.target.value)}/>

        <div className="mt-4">
        
        <Button color="red" onClick={handleWithdraw}>
            Withdraw
        </Button>

        </div>
    </Card>
  );
}