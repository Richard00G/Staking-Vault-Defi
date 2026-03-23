import { useReadContract, useWriteContract } from "wagmi";
import { useStaking } from "../hooks/useContract";

export default function Rewards() {
  const { data } = useReadContract({
    ...useStaking,
    functionName: "earned",
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const claim = async () => {
    try {
      await writeContractAsync({
        ...useStaking,
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