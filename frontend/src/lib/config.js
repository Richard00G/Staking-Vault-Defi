import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";
import { CHAIN } from "./contracts";

// El RPC por defecto de Sepolia solo deja leer 1,000 bloques de eventos,
// así que el historial fallaba. Se prueban en orden: el tuyo (opcional),
// Tenderly y PublicNode, y al final el de viem.
const rpcs = [
  import.meta.env.VITE_SEPOLIA_RPC_URL,
  "https://sepolia.gateway.tenderly.co",
  "https://ethereum-sepolia-rpc.publicnode.com",
].filter(Boolean);

export const config = getDefaultConfig({
  appName: "Staking Vault DeFi",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "staking-vault-demo",
  chains: [CHAIN],
  transports: {
    [CHAIN.id]: fallback([...rpcs.map((url) => http(url)), http()]),
  },
  ssr: false,
});
