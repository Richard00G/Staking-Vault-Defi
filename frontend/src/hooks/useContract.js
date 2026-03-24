import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi, parseEther } from "viem";
import {abi as vaultAbi } from "../abi/StakingVault.json";

export { vaultAbi };

const stakingTokenAddress = "0xb280b5050053c058581763DeF99f57E00F7C7B2A";
const rewardTokenAddress = "0xEe181449945d359c1F6Bd52aAd6c4F0662168056" // 
export const vaultAddress = "0xE654A5f7487023506E3f044c7bdA876C8C57D086"; // 

 

export function useStaking() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: allowance, refetch } = useReadContract({
    address: stakingTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, vaultAddress] : undefined,
    enabled: !!address,
  });

  const approve = async (amount) => {
    if (!address || !amount || Number(amount) <= 0) return;

    return await writeContractAsync({
      address: stakingTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, parseEther(amount)],
    });
  };

  const stake = async (amount) => {
    if (!address || !amount || Number(amount) <= 0) return;

    return await writeContractAsync({
      address: vaultAddress,
      abi: vaultAbi,
      functionName: "stake",
      args: [parseEther(amount)],
    });
  };

  const withdraw = async (amount) => {
    if (!address || !amount || Number(amount) <= 0) return;

    return await writeContractAsync({
      address: vaultAddress,
      abi: vaultAbi,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  return {
    allowance,
    approve,
    stake,
    withdraw,
  };

 
}