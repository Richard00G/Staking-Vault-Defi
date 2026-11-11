import { useState } from "react";
import { formatEther } from "viem";
import { vault, stakingToken } from "../lib/contracts";
import { fmt, toWei } from "../lib/format";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import TxStatus from "./TxStatus";

const MODES = {
  stake: { tab: "Depositar", verb: "Depositar", done: "Depositaste" },
  withdraw: { tab: "Retirar", verb: "Retirar", done: "Retiraste" },
};

/** Botones Depositar / Retirar; al elegir uno se abre su formulario debajo. */
export default function ActionPanel({ v, onDone }) {
  const [mode, setMode] = useState(null);
  const [amount, setAmount] = useState("");
  const tx = useTx();
  const ok = useCorrectNetwork();

  const isStake = mode === "stake";
  const available = isStake ? v.walletBalance : v.staked;
  const wei = toWei(amount);
  const tooMuch = wei !== null && available !== undefined && wei > available;
  const invalid = amount !== "" && wei === null;
  const needsApprove = isStake && wei !== null && (v.allowance ?? 0n) < wei;

  const open = (next) => {
    setMode(mode === next ? null : next);
    setAmount("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!wei || tooMuch) return;
    const steps = [];
    if (needsApprove) {
      steps.push([{ ...stakingToken, functionName: "approve", args: [vault.address, wei] }, "Paso 1 de 2, autorizar STK"]);
      steps.push([{ ...vault, functionName: "stake", args: [wei] }, "Paso 2 de 2, depositar"]);
    } else {
      steps.push([{ ...vault, functionName: isStake ? "stake" : "withdraw", args: [wei] }, MODES[mode].verb]);
    }
    tx.run(steps, `${MODES[mode].done} ${amount} STK.`, () => {
      setAmount("");
      onDone?.();
    });
  };

  const tabClass = (m) =>
    `h-14 rounded-2xl text-[17px] font-bold transition ${
      m === "stake"
        ? mode === "stake" ? "bg-teal-dark text-white" : "bg-teal text-white hover:bg-teal-dark"
        : mode === "withdraw" ? "bg-ink text-plate" : "border-2 border-ink text-ink hover:bg-ink hover:text-plate"
    }`;

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(MODES).map(([m, cfg]) => (
          <button key={m} type="button" onClick={() => open(m)} aria-expanded={mode === m} aria-controls="action-form" className={tabClass(m)}>
            {cfg.tab}
          </button>
        ))}
      </div>

      {mode && (
        <form id="action-form" onSubmit={submit} className="flex flex-col gap-3 rounded-[18px] bg-plate p-4">
          <label htmlFor="amount" className="text-sm text-muted">
            {isStake ? `En tu wallet: ${fmt(available)} STK` : `Depositado: ${fmt(available)} STK`}
          </label>
          <div className="flex gap-2">
            <input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(",", "."))}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.0"
              aria-invalid={tooMuch || invalid}
              className={`h-[52px] min-w-0 flex-1 rounded-xl border-2 bg-white px-4 text-xl font-semibold tabular-nums outline-none focus:border-teal ${
                tooMuch || invalid ? "border-alert" : "border-line"
              }`}
            />
            <button
              type="button"
              onClick={() => available && setAmount(formatEther(available))}
              disabled={!available}
              className="h-[52px] rounded-xl border-2 border-ink px-4 text-sm font-bold hover:bg-ink hover:text-plate disabled:opacity-40"
            >
              Todo
            </button>
          </div>
          {tooMuch && (
            <p className="text-sm font-medium text-alert">
              {isStake ? "No tienes tantos STK en tu wallet." : "No tienes tanto depositado."}
            </p>
          )}
          <button
            type="submit"
            disabled={!ok || !wei || tooMuch || tx.busy}
            className="h-[52px] rounded-xl bg-ink font-bold text-plate transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-40"
          >
            {tx.busy ? "Procesando…" : needsApprove ? "Autorizar y depositar" : `${MODES[mode].verb} STK`}
          </button>
          {needsApprove && !tx.busy && (
            <p className="text-sm text-muted">Tu wallet te pedirá dos firmas: una para autorizar los STK y otra para depositarlos.</p>
          )}
        </form>
      )}
      <TxStatus {...tx} />
    </section>
  );
}
