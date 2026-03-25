import { ConnectButton } from "@rainbow-me/rainbowkit";
import StakeSection from "./sections/StakeSection";
import RewardsSection from "./sections/RewardsSection";
import WithdrawSection from "./sections/WithdrawSection";
import Header from "./components/Header";
import Stats from "./components/Stats";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-tobr from-gray-950 via-black to-gray-900 text-white">
      
      {/* HEADER */}
      <div className="min-h-screen bg-black text-white p-6">
        <Header />
        <Stats />

        <div className="grid md:grid-cols-2">
          <StakeSection/>
          <RewardsSection />
           <WithdrawSection />
        </div>
      </div>

      
      {/* FOOTER */}
      <p className="mt-10 text-gray-400 text-sm">
        Built on Sepolia • Demo DeFi App By Richard00G
      </p>
    </div>
  );
}