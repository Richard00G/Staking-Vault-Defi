const hre = require("hardhat");

const { ethers } = hre;

async function main() {

    const Token = await ethers.getContractFactory("TestToken");

    const stakingToken = await Token.deploy("StakeToken","STK");

    await stakingToken.waitForDeployment();

    const stakingTokenAddress = await stakingToken.getAddress();

    const rewardToken = await Token.deploy("RewardToken", "RWD");

    await rewardToken.waitForDeployment();

    const rewardTokenAddress = await rewardToken.getAddress();

    const Vault = await ethers.getContractFactory("StakingVault");

    const vault = await Vault.deploy(stakingTokenAddress,rewardTokenAddress);

    await vault.waitForDeployment();

    const vaultAddress = await vault.getAddress();

    console.log("Staking token: ", stakingTokenAddress);
    console.log("Reward Token: ", rewardTokenAddress);
    console.log("Vault: ", vaultAddress);
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});