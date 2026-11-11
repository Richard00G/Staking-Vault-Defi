import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { isAddressEqual } from "viem";
import { vault, DEPLOY_BLOCK, CHAIN } from "../lib/contracts";

const SECONDS_PER_BLOCK = 12;
const KIND = { Staked: "Depósito", Withdrawn: "Retiro", RewardPaid: "Cobro" };
// Si el RPC no deja leer todo el historial de una vez, se lee por tramos.
const CHUNK = 9_000n;
const MAX_CHUNKS = 10;

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
      const read = (fromBlock, toBlock) =>
        client.getContractEvents({ address: vault.address, abi: vault.abi, fromBlock, toBlock });

      let logs;
      try {
        logs = await read(DEPLOY_BLOCK, latest);
      } catch {
        logs = [];
        let to = latest;
        for (let i = 0; i < MAX_CHUNKS && to >= DEPLOY_BLOCK; i++) {
          const from = to - CHUNK + 1n > DEPLOY_BLOCK ? to - CHUNK + 1n : DEPLOY_BLOCK;
          logs.push(...(await read(from, to)));
          to = from - 1n;
        }
      }

      return logs
        .filter((log) => KIND[log.eventName] && log.args.user && isAddressEqual(log.args.user, address))
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
