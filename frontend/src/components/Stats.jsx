import { useAccount,useReadContract } from "wagmi";
import { formatEther,erc20Abi } from "viem";
import { vaultAbi, vaultAddress } from "../hooks/useContract";

const token = "0xb280b5050053c058581763DeF99f57E00F7C7B2A";

export default function Stats() {

    const { address } = useAccount();

    const { data: balance } = useReadContract({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        enabled: !!address,
    });

    const { data: rewards } = useReadContract({
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "earned",
        args: address ? [address] : undefined,
        enabled: !!address,
    });

    return (

        <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Statt label = "Balance" value = {balance ? formatEther(balance) : "0"} />
            <Statt label = "Rewards" value = {rewards ? formatEther(rewards) : "0"} />
            <Statt label = "Status" value = "Active" />
        </div>

    );

}


function Statt({label,value}) {
         return (
            <div className="bg-gray-900 p-4 rounded-x1 rext-center">
              
               <p className="text-gray-400 text-sm">{label}</p>
               <p className="text-white text-xl font-bold">{value ?? "0"}</p>

             </div>
        );
}


