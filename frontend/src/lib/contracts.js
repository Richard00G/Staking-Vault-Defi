import { sepolia } from "wagmi/chains";
import addresses from "./addresses.json";
import { abi as vaultAbi } from "../abi/StakingVault.json";
import { abi as tokenAbi } from "../abi/TestToken.json";

// Única fuente de verdad para direcciones. `npm run deploy` (raíz) reescribe addresses.json.
export const CHAIN = sepolia;
export const VAULT_ADDRESS = addresses.vault;
export const STAKING_TOKEN_ADDRESS = addresses.stakingToken;
export const REWARD_TOKEN_ADDRESS = addresses.rewardToken;

export const vault = { address: VAULT_ADDRESS, abi: vaultAbi, chainId: CHAIN.id };
export const stakingToken = { address: STAKING_TOKEN_ADDRESS, abi: tokenAbi, chainId: CHAIN.id };
export const rewardToken = { address: REWARD_TOKEN_ADDRESS, abi: tokenAbi, chainId: CHAIN.id };

export const FAUCET_AMOUNT = "100";
export const explorerTx = (hash) => `${CHAIN.blockExplorers.default.url}/tx/${hash}`;
export const explorerAddress = (addr) => `${CHAIN.blockExplorers.default.url}/address/${addr}`;
