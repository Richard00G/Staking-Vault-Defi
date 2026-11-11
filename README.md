# 🚀 Staking Vault DeFi

A full-stack staking dApp on Sepolia: stake **STK**, earn **RWD** every second, withdraw anytime.

**Live demo:** https://staking-vault-defi.vercel.app

## ✨ Features

- 🔐 Stake ERC20 tokens and earn rewards per second (Synthetix StakingRewards model)
- 🏦 Withdraw anytime — even while the vault is paused
- 🎁 Claim rewards, or `exit()` to withdraw + claim in one transaction
- 💧 Rate-limited faucet for test tokens
- 📊 Live dashboard: total staked, rewards/day, time left in the reward period
- 🔗 Wallet connection with RainbowKit (MetaMask / WalletConnect) and wrong-network detection

## 🧱 Tech stack

| Layer | Tools |
|---|---|
| Contracts | Solidity 0.8.20, Hardhat 2, OpenZeppelin 5 (SafeERC20, ReentrancyGuard, Ownable, Pausable) |
| Frontend | React 19, Vite, wagmi 2, viem, RainbowKit, TailwindCSS |
| CI | GitHub Actions: contract tests + frontend lint/build on every push and PR |
| Hosting | Vercel (`frontend/`) |

## 📁 Structure

```
contracts/        StakingVault.sol, TestToken.sol
test/             Hardhat test suite
scripts/deploy.js Deploys tokens + vault, funds rewards, writes addresses/ABIs to the frontend
frontend/         React app (src/lib/addresses.json is the single source of contract addresses)
```

## 🧪 Contracts

```bash
npm ci
npm test            # 19 tests
```

### Deploy to Sepolia

```bash
cp .env.example .env   # fill SEPOLIA_RPC_URL and PRIVATE_KEY (use a test wallet!)
npm run deploy
```

The script deploys STK, RWD and the vault, funds the first 7-day reward period
(`INITIAL_REWARD`, default 10,000 RWD) and updates `frontend/src/lib/addresses.json`
and `frontend/src/abi/*.json`. Commit those files and Vercel redeploys the frontend.

### Owner operations

| Function | What it does |
|---|---|
| `notifyRewardAmount(amount)` | Pulls `amount` RWD from the owner and starts/extends a reward period. Requires a prior `approve`. |
| `setRewardsDuration(seconds)` | Changes period length (only between periods). |
| `pause()` / `unpause()` | Blocks new stakes. Withdrawals and claims keep working. |
| `recoverERC20(token, amount)` | Rescues tokens sent by mistake (never STK or RWD). |

## 💻 Frontend

```bash
cd frontend
cp .env.example .env   # optional: your WalletConnect project id
npm ci
npm run dev
```

## 🔗 Contracts (Sepolia)

See [`frontend/src/lib/addresses.json`](frontend/src/lib/addresses.json).

## ⚠️ Notes

- Testnet demo for learning and portfolio purposes. **Not audited.**
- Never commit `.env` or use a wallet with real funds as `PRIVATE_KEY`.

## 🚀 Ideas for next steps

- Reward history chart
- Verified contracts on Etherscan (`npx hardhat verify`)
- Gas report and coverage in CI
