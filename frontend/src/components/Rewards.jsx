import { useReadContract, useAccount } from "wagmi";
import { contractAddress, abi } from "../lib/contract";

export default function Rewards() {
    const { address } = useAccount();
    const { data } = useReadContract({
        address: contractAddress,abi,
        functionName: 'earned',
        arg: [address],
    });

    return (
        <div>
            Rewards: {data ? Number(data) / 1e18 : 0}
        </div>
    );
}