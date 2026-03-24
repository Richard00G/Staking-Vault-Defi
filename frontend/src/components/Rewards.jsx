import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { vaultAddress } from "../hooks/useContract";
import {abi as vaultAbi } from "../abi/StakingVault.json";

export default function Rewards() {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: "earned",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { writeContractAsync, isPending } = useWriteContract();

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
    <div className="flex flex-col gap-3">
      <p className="text-lg">
        Rewards: {data ? Number(data) / 1e18 : 0}
      </p>

      <button
        onClick={claim}
        disabled={isPending}
        className="bg-blue-500 hover:bg-blue-600 p-2 rounded"
      >
        {isPending ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}