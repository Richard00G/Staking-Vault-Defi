import { ConnectButton } from "@rainbow-me/rainbowkit";
import Stake from "./components/Stake";
import Rewards from "./components/Rewards";
import Withdraw from "./components/Withdraw";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-tobr from-gray-950 via-black to-gray-900 text-white">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-400">
          Staking Vault 🚀
        </h1>
        <ConnectButton />
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">

        {/* STAKE CARD */}
        <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stake Tokens</h2>
          <Stake />
        </div>

        {/* REWARDS CARD */}
        <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rewards</h2>
          <Rewards />
        </div>

        {/* WITHDRAW CARD */}
        <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Withdraw</h2>
          <Withdraw />
        </div>

      </div>

      {/* FOOTER */}
      <p className="mt-10 text-gray-400 text-sm">
        Built on Sepolia • Demo DeFi App
      </p>
    </div>
  );
}