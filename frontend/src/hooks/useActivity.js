import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { vault, DEPLOY_BLOCK, CHAIN } from "../lib/contracts";

// Los RPC públicos limitan cuántos bloques se pueden consultar por llamada.
const CHUNK = 45_000n;
const MAX_CHUNKS = 4; // ~180k bloques ≈ 25 días en Sepolia
const SECONDS_PER_BLOCK = 12;

const KIND = { Staked: "Depósito", Withdrawn: "Retiro", RewardPaid: "Cobro" };

/** Últimos movimientos del usuario en el vault, leídos de los eventos del contrato. */
export function useActivity(limit = 5) {
  const { address } = useAccount();
  const client = usePublicClient({ chainId: CHAIN.id });

  return useQuery({
    queryKey: ["activity", vault.address, address],
    enabled: Boolean(address && client),
    refetchInterval: 30_000,
    queryFn: async () => {
      const latest = await client.getBlockNumber();
      const found = [];
      let to = latest;
      for (let i = 0; i < MAX_CHUNKS && to >= DEPLOY_BLOCK && found.length < limit; i++) {
        const from = to - CHUNK + 1n > DEPLOY_BLOCK ? to - CHUNK + 1n : DEPLOY_BLOCK;
        const batches = await Promise.all(
          ["Staked", "Withdrawn", "RewardPaid"].map((eventName) =>
            client.getContractEvents({
              address: vault.address,
              abi: vault.abi,
              eventName,
              args: { user: address },
              fromBlock: from,
              toBlock: to,
            })
          )
        );
        found.push(...batches.flat());
        to = from - 1n;
      }
      return found
        .sort((a, b) => Number(b.blockNumber - a.blockNumber) || b.logIndex - a.logIndex)
        .slice(0, limit)
        .map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          kind: KIND[log.eventName],
          token: log.eventName === "RewardPaid" ? "RWD" : "STK",
          sign: log.eventName === "Withdrawn" ? "−" : "+",
          amount: log.args.amount ?? log.args.reward,
          secondsAgo: Number(latest - log.blockNumber) * SECONDS_PER_BLOCK,
          hash: log.transactionHash,
        }));
    },
  });
}
