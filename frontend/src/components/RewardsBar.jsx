import { vault } from "../lib/contracts";
import { fmt } from "../lib/format";
import { useTx } from "../hooks/useTx";
import { useCorrectNetwork } from "../hooks/useCorrectNetwork";
import TxStatus from "./TxStatus";

export default function RewardsBar({ v, onDone }) {
  const tx = useTx();
  const ok = useCorrectNetwork();
  const hasRewards = (v.earned ?? 0n) > 0n;

  const claim = () =>
    tx.run([[{ ...vault, functionName: "claimReward" }, "Cobro"]], "Cobraste tus rewards.", onDone);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 rounded-[18px] bg-ink py-4 pl-5 pr-4 text-plate">
        <div className="min-w-0">
          <p className="text-sm text-mist">Rewards por cobrar</p>
          <p className="wide mt-0.5 truncate text-2xl font-bold tabular-nums">
            {fmt(v.earned, 4)} <span className="text-sm font-medium text-mist">RWD</span>
          </p>
        </div>
        <button
          type="button"
          onClick={claim}
          disabled={!ok || !hasRewards || tx.busy}
          className="h-12 shrink-0 rounded-full bg-brass px-5 font-bold text-ink transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {tx.busy ? "Cobrando…" : "Cobrar"}
        </button>
      </div>
      <TxStatus {...tx} />
    </section>
  );
}
