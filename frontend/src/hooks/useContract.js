import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi, parseEther } from "viem";
import {abi as vaultAbi } from "../abi/StakingVault.json";

export { vaultAbi };

const stakingTokenAddress = "0x92540C78fEB32bA9D1D738314549f0739E034aBd";
const rewardTokenAddress = "0x2139a238b21fE0825559a1FF11c15f23996f0A21" // 
export const vaultAddress = "0x51C53D72B13987Dd251dd089882274C3Fa53d5BE"; // 

 

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