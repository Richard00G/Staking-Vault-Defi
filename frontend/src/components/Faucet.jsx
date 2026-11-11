import { parseEther } from "viem";
import { stakingToken, FAUCET_AMOUNT } from "../lib/contracts";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import TxStatus from "./TxStatus";

export default function Faucet({ onDone }) {
  const tx = useTx();
  const ok = useCorrectNetwork();

  const claim = () =>
    tx.run(
      [[{ ...stakingToken, functionName: "faucet", args: [parseEther(FAUCET_AMOUNT)] }, "Faucet"]],
      `Recibiste ${FAUCET_AMOUNT} STK 💧`,
      onDone
    );

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={claim}
        disabled={!ok || tx.busy}
        title={ok ? "" : "Conecta tu wallet en Sepolia"}
        className="rounded-xl bg-violet-500 px-4 py-2 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {tx.busy ? "Enviando…" : `💧 ${FAUCET_AMOUNT} STK gratis`}
      </button>
      {tx.status !== "pending" && (
        <div className="max-w-xs text-left">
          <TxStatus {...tx} />
        </div>
      )}
    </div>
  );
}
