import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { CHAIN } from "./contracts";

export const config = getDefaultConfig({
  appName: "Staking Vault DeFi",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "staking-vault-demo",
  chains: [CHAIN],
  ssr: false,
});
