import { parseEther } from "viem";
import { stakingToken, FAUCET_AMOUNT } from "../lib/contracts";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import TxStatus from "./TxStatus";

/** Tokens de prueba gratis (solo testnet). */
export default function Faucet({ onDone }) {
  const tx = useTx();
  const ok = useCorrectNetwork();

  const claim = () =>
    tx.run(
      [[{ ...stakingToken, functionName: "faucet", args: [parseEther(FAUCET_AMOUNT)] }, "Faucet"]],
      `Recibiste ${FAUCET_AMOUNT} STK de prueba.`,
      onDone
    );

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={claim}
        disabled={!ok || tx.busy}
        className="h-11 self-start rounded-full px-1 text-sm font-semibold text-teal underline decoration-2 underline-offset-4 hover:text-teal-dark disabled:no-underline disabled:opacity-50"
      >
        {tx.busy ? "Enviando tokens…" : `Pedir ${FAUCET_AMOUNT} STK de prueba`}
      </button>
      <TxStatus {...tx} />
    </div>
  );
}
