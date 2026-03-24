import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi, parseEther } from "viem";

    import {abi as vaultAbi } from "../abi/StakingVault.json";

    console.log("ABI: ", vaultAbi);


const stakingTokenAddress = "0xb280b5050053c058581763DeF99f57E00F7C7B2A";
const rewardTokenAddress = "0xEe181449945d359c1F6Bd52aAd6c4F0662168056" // 
const vaultAddress = "0xE654A5f7487023506E3f044c7bdA876C8C57D086"; // 

export function useStaking(amount) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 🔍 allowance
  const { data: allowance, refetch } = useReadContract({
    address: stakingTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, vaultAddress] : undefined,
    enableb: !!address,
  });

  //APPROVE
  const approve = async () => {
    const tx = await writeContractAsync({
      address: stakingTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, parseEther(amount)],
    });

    await refetch(); // actualizar allowance
    return tx;
  };

  //STAKE
  const stake = async () => {
    if (!address) return;
    if (!amount || Number(amount) <= 0) return;
    const tx = await writeContractAsync({
      address: vaultAddress,
      abi: vaultAbi,
      functionName: "stake",
      args: [parseEther(amount)],
    });

    return tx;
  };

  return {
    allowance,
    approve,
    stake,
  };
}