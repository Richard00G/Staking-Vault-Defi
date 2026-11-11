import { ConnectButton } from "@rainbow-me/rainbowkit";
import Faucet from "./Faucet";

export default function Header({ onFaucet }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Staking Vault 🚀</h1>
        <p className="mt-1 text-gray-400">Stakea STK y gana RWD cada segundo.</p>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <Faucet onDone={onFaucet} />
        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}
