import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { abi, contractAddress } from "../lib/contract";

export default function Stake() {
    const { writeContract } = useWriteContract();

    const handleStake = () => {
        writeContract({
            address: contractAddress,abi,
            functionName: 'stake',
            args:[parseEther("1")]
         });
    };

 return <button onClick={handleStake}>Stake 1 Token</button>
}