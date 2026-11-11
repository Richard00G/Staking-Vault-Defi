import { useState } from "react";
import { formatEther } from "viem";
import { vault } from "../lib/contracts";
import { fmt, toWei } from "../lib/format";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import TxStatus from "../components/TxStatus";

export default function WithdrawSection({ v }) {
  const [amount, setAmount] = useState("");
  const tx = useTx();
  const ok = useCorrectNetwork();

  const wei = toWei(amount);
  const tooMuch = wei !== null && v.staked !== undefined && wei > v.staked;

  const handleWithdraw = () =>
    tx.run(
      [[{ ...vault, functionName: "withdraw", args: [wei] }, "Retiro"]],
      `Retiraste ${amount} STK ✅`,
      () => {
        setAmount("");
        v.refetch();
      }
    );

  return (
    <Card title="Retirar" subtitle={`Stakeado: ${fmt(v.staked)} STK`}>
      <Input
        value={amount}
        onChange={setAmount}
        placeholder="Cantidad a retirar"
        invalid={tooMuch || (amount !== "" && wei === null)}
        onMax={v.staked ? () => setAmount(formatEther(v.staked)) : undefined}
      />
      {tooMuch && <p className="text-sm text-rose-400">No tienes tanto stakeado.</p>}
      <Button color="red" onClick={handleWithdraw} disabled={!ok || !wei || tooMuch} loading={tx.busy}>
        Retirar
      </Button>
      <TxStatus {...tx} />
    </Card>
  );
}
