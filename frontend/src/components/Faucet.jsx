import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { abi as tokenAbi } from "../abi/TestToken.json";

const tokenAddress = "0x92540C78fEB32bA9D1D738314549f0739E034aBd";

export default function Faucet() {
  const { writeContractAsync, isPending } = useWriteContract();

  const handleFaucet = async () => {
    try {
      await writeContractAsync({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "faucet",
        args: [parseEther("100")], // 100 tokens
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleFaucet}
      disabled={isPending}
      className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl font-semibold"
    >
      {isPending ? "Claiming..." : "💧 Get Test Tokens"}
    </button>
  );
}