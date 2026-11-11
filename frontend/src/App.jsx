import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { useVault } from "./hooks/useVault";
import { useNow } from "./hooks/useNow";
import { VAULT_ADDRESS, explorerAddress, CHAIN } from "./lib/contracts";
import { remaining } from "./lib/format";
import WalletButton from "./components/WalletButton";
import NetworkGuard from "./components/NetworkGuard";
import Dial from "./components/Dial";
import RewardsBar from "./components/RewardsBar";
import ActionPanel from "./components/ActionPanel";
import Activity from "./components/Activity";
import Faucet from "./components/Faucet";

export default function App() {
  const v = useVault();
  const { isConnected } = useAccount();
  const queryClient = useQueryClient();
  const now = useNow(30_000) / 1000;

  const refresh = () => {
    v.refetch();
    queryClient.invalidateQueries({ queryKey: ["activity"] });
  };

  // Periodo de rewards
  const finish = v.periodFinish !== undefined ? Number(v.periodFinish) : 0;
  const duration = v.duration !== undefined ? Number(v.duration) : 0;
  const active = finish > now && duration > 0;
  const progress = active ? 1 - (finish - now) / duration : 0;
  const perDay = active && v.rewardRate !== undefined ? Number(formatEther(v.rewardRate)) * 86_400 : 0;

  // Tu parte de la bóveda
  const share =
    v.staked !== undefined && v.totalStaked ? (Number(v.staked) / Number(v.totalStaked)) * 100 : v.staked === 0n ? 0 : null;

  return (
    <div className="min-h-screen bg-concrete text-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 pb-10 pt-5 md:px-8 md:pt-8">
        <header className="flex items-center justify-between gap-4">
          <p className="wide text-[22px] font-extrabold tracking-tight">Bóveda</p>
          <WalletButton />
        </header>

        <NetworkGuard />

        <main className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 md:items-start md:gap-12">
          <div className="flex flex-col gap-3 md:sticky md:top-8">
            <Dial staked={v.staked} share={share} progress={progress} connected={isConnected} />
            <p className="text-center text-sm text-muted">
              {active
                ? `El anillo verde es el periodo de rewards: quedan ${remaining(finish - now)}.`
                : "No hay un periodo de rewards activo ahora mismo."}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <RewardsBar v={v} onDone={refresh} />
            <ActionPanel v={v} onDone={refresh} />
            <Activity connected={isConnected} />
            {isConnected && <Faucet onDone={refresh} />}
          </div>
        </main>

        <footer className="flex flex-col gap-1 border-t border-line pt-4 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            {perDay > 0
              ? `La bóveda reparte ${perDay.toLocaleString("es-MX", { maximumFractionDigits: 2 })} RWD al día entre todos.`
              : `Demo en ${CHAIN.name}, sin dinero real.`}
          </p>
          <a href={explorerAddress(VAULT_ADDRESS)} target="_blank" rel="noreferrer" className="font-semibold text-teal underline underline-offset-4">
            Ver el contrato
          </a>
        </footer>
      </div>
    </div>
  );
}
