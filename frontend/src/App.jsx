import { useAccount } from "wagmi";
import { useVault } from "./hooks/useVault";
import { VAULT_ADDRESS, explorerAddress, CHAIN } from "./lib/contracts";
import Header from "./components/Header";
import Stats from "./components/Stats";
import NetworkGuard from "./components/NetworkGuard";
import StakeSection from "./sections/StakeSection";
import WithdrawSection from "./sections/WithdrawSection";
import RewardsSection from "./sections/RewardsSection";

export default function App() {
  const v = useVault();
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Header onFaucet={v.refetch} />
        <NetworkGuard />
        {!isConnected && (
          <p className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 text-gray-300">
            Conecta tu wallet para stakear. Si no tienes STK, usa el faucet 💧 (necesitas un poco de ETH de {CHAIN.name} para el gas).
          </p>
        )}
        <Stats v={v} />
        <div className="grid gap-6 md:grid-cols-3">
          <StakeSection v={v} />
          <WithdrawSection v={v} />
          <RewardsSection v={v} />
        </div>
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-gray-500 sm:px-6">
        Demo DeFi en {CHAIN.name} · por Richard00G ·{" "}
        <a className="underline hover:text-gray-300" href={explorerAddress(VAULT_ADDRESS)} target="_blank" rel="noreferrer">
          Contrato del vault
        </a>
      </footer>
    </div>
  );
}
