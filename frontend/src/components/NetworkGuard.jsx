import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN } from "../lib/contracts";

export default function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === CHAIN.id) return null;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-alert p-4 text-white sm:flex-row sm:items-center sm:justify-between">
      <p>Tu wallet está en otra red. La bóveda vive en {CHAIN.name}.</p>
      <button
        type="button"
        onClick={() => switchChain({ chainId: CHAIN.id })}
        disabled={isPending}
        className="h-11 shrink-0 rounded-full bg-white px-5 font-semibold text-ink disabled:opacity-60"
      >
        Cambiar a {CHAIN.name}
      </button>
    </div>
  );
}
