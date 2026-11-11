import { useAccount, useReadContracts } from "wagmi";
import { vault, stakingToken } from "../lib/contracts";

/**
 * Lee todo el estado del vault y del usuario en una sola llamada (multicall)
 * y lo refresca cada 10 s. `refetch` se llama después de cada transacción.
 */
export function useVault() {
  const { address } = useAccount();
  const user = address ?? "0x0000000000000000000000000000000000000000";

  const { data, refetch, isLoading } = useReadContracts({
    allowFailure: true,
    contracts: [
      { ...vault, functionName: "totalSupply" },
      { ...vault, functionName: "rewardRate" },
      { ...vault, functionName: "periodFinish" },
      { ...vault, functionName: "duration" },
      { ...vault, functionName: "balanceOf", args: [user] },
      { ...vault, functionName: "earned", args: [user] },
      { ...stakingToken, functionName: "balanceOf", args: [user] },
      { ...stakingToken, functionName: "allowance", args: [user, vault.address] },
    ],
    query: { refetchInterval: 10_000 },
  });

  const r = (i) => data?.[i]?.result;
  const connected = Boolean(address);

  return {
    address,
    isLoading,
    refetch,
    totalStaked: r(0),
    rewardRate: r(1),
    periodFinish: r(2),
    duration: r(3),
    staked: connected ? r(4) : undefined,
    earned: connected ? r(5) : undefined,
    walletBalance: connected ? r(6) : undefined,
    allowance: connected ? r(7) : undefined,
  };
}
