import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

    import {abi as vaultAbi } from "../abi/StakingVault.json";


const stakingTokenAddress = "0xb280b5050053c058581763DeF99f57E00F7C7B2A";
const rewardTokenAddress = "0xEe181449945d359c1F6Bd52aAd6c4F0662168056" // 👈 cámbiar
const vaultAddress = "0xE654A5f7487023506E3f044c7bdA876C8C57D086"; // 👈 tu contrato Sepolia

export function useStaking(amount) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 🔍 allowance
  const { data: allowance, refetch } = useReadContract({
    address: stakingTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, vaultAddress],
  });

  //APPROVE
  const approve = async () => {
    const tx = await writeContractAsync({
      address: stakingTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, amount],
    });

    await refetch(); // actualizar allowance
    return tx;
  };

  //STAKE
  const stake = async () => {
    const tx = await writeContractAsync({
      address: vaultAddress,
      abi: vaultAbi,
      functionName: "stake",
      args: [amount],
    });

    return tx;
  };

  return {
    allowance,
    approve,
    stake,
  };
}