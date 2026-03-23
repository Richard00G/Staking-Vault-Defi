import Wallet from "./components/Wallet";
import Stake from "./components/Stake";
import Rewards from "./components/Rewards";



export default function App() {
  return (
    <div>
     
     <h1>Staking Vault</h1>
    
     <Wallet />
     <Stake />
     <Rewards />

    </div>
  );
}