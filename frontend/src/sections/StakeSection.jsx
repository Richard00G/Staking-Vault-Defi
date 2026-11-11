import { useState } from "react";
import { formatEther } from "viem";
import { vault, stakingToken } from "../lib/contracts";
import { fmt, toWei } from "../lib/format";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import TxStatus from "../components/TxStatus";

export default function StakeSection({ v }) {
  const [amount, setAmount] = useState("");
  const tx = useTx();
  const ok = useCorrectNetwork();

  const wei = toWei(amount);
  const tooMuch = wei !== null && v.walletBalance !== undefined && wei > v.walletBalance;
  const needsApprove = wei !== null && (v.allowance ?? 0n) < wei;

  const handleStake = () => {
    const steps = [];
    // Solo pide approve si hace falta, y espera a que se confirme antes del stake.
    if (needsApprove) {
      steps.push([{ ...stakingToken, functionName: "approve", args: [vault.address, wei] }, "Paso 1/2 · Aprobar"]);
    }
    steps.push([{ ...vault, functionName: "stake", args: [wei] }, needsApprove ? "Paso 2/2 · Stake" : "Stake"]);
    tx.run(steps, `Stakeaste ${amount} STK ✅`, () => {
      setAmount("");
      v.refetch();
    });
  };

  return (
    <Card title="Stake" subtitle={`En tu wallet: ${fmt(v.walletBalance)} STK`}>
      <Input
        value={amount}
        onChange={setAmount}
        placeholder="Cantidad a depositar"
        invalid={tooMuch || (amount !== "" && wei === null)}
        onMax={v.walletBalance ? () => setAmount(formatEther(v.walletBalance)) : undefined}
      />
      {tooMuch && <p className="text-sm text-rose-400">No tienes tantos STK. Usa el faucet 💧</p>}
      <Button onClick={handleStake} disabled={!ok || !wei || tooMuch} loading={tx.busy}>
        {needsApprove ? "Aprobar y stakear" : "Stakear"}
      </Button>
      <TxStatus {...tx} />
    </Card>
  );
}
