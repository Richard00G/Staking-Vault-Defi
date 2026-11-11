import { useAccount } from "wagmi";
import { CHAIN } from "../lib/contracts";

/** true si hay wallet conectada y está en la red correcta. */
export function useCorrectNetwork() {
  const { isConnected, chainId } = useAccount();
  return isConnected && chainId === CHAIN.id;
}
