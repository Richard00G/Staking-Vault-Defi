import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { vaultAddress } from "../hooks/useContract";
import {abi as vaultAbi } from "../abi/StakingVault.json";
//Components
import Card from "../components/Card";
import Button from "../components/Button";
import Stat from "../components/Stat";

export default function RewardsSection() {
  const { address } = useAccount();

     //Read Rewards
  const { data } = useReadContract({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: "earned",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { writeContractAsync, isPending } = useWriteContract();
      //Claim Rewards
  const claim = async () => {
    if(!address) return;

    try {
      await writeContractAsync({
      address: vaultAddress,
      abi: vaultAbi,
      functionName: "claimReward",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <Card>

    <h2 className="text-x1 font-bold mb-4 text-white">Rewards</h2>
     
     <Stat label="Your Rewards" value={data ? Number(data) / 1e18 : 0}/>

     <div className="mt-4">
       
        <Button color="blue" onClick={claim}>
           Claim Rewards
        </Button>

     </div>
   </Card>
  );
}