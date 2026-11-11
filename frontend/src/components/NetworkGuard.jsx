import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN } from "../lib/contracts";

export default function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === CHAIN.id) return null;
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-700 bg-amber-950 p-4 text-amber-200 sm:flex-row sm:items-center">
      <p>Tu wallet está en otra red. Esta app funciona en {CHAIN.name}.</p>
      <button
        type="button"
        onClick={() => switchChain({ chainId: CHAIN.id })}
        disabled={isPending}
        className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
      >
        Cambiar a {CHAIN.name}
      </button>
    </div>
  );
}
