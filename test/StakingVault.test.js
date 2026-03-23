const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("StakingVault", function () {
  let stakingToken, rewardToken, vault;
  let owner, user1;
  const stakeAmount = ethers.parseEther("100");

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    // Deploy Token
    const Token = await ethers.getContractFactory("TesToken");

    stakingToken = await Token.deploy("StakeToken", "STK");
    await stakingToken.waitForDeployment();

    rewardToken = await Token.deploy("RewardToken", "RWD");
    await rewardToken.waitForDeployment();

    // Deploy Vault
    const Vault = await ethers.getContractFactory("StakingVault");

    vault = await Vault.deploy(
      await stakingToken.getAddress(),
      await rewardToken.getAddress()
    );

    await vault.waitForDeployment();

    await rewardToken.approve(await vault.getAddress(), ethers.parseEther("1000"));

    //Activar Rewards
    await vault.notifyRewardAmount(ethers.parseEther("1000"));

    // Transfer tokens a user1
    await stakingToken.transfer(user1.address, stakeAmount);

    console.log("earned: ", (await vault.earned(user1.address)).toString());

  });

  it("Debe permitir stake", async function () {
    await stakingToken.connect(user1).approve(await vault.getAddress(), stakeAmount);

    await vault.connect(user1).stake(stakeAmount);

    const balance = await vault.balanceOf(user1.address);

    expect(balance).to.equal(stakeAmount);
  });

  it("Debe acumular rewards con el tiempo", async function () {
    await stakingToken.connect(user1).approve(await vault.getAddress(), stakeAmount);
    await vault.connect(user1).stake(stakeAmount);

    // Avanzar tiempo
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    const earned = await vault.earned(user1.address);

    expect(earned).to.be.gt(ethers.parseEther("0"));
  });

  it("Debe permitir reclamar rewards", async function () {
    await stakingToken.connect(user1).approve(await vault.getAddress(), stakeAmount);
    await vault.connect(user1).stake(stakeAmount);

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    await vault.connect(user1).claimReward();

    const rewardBalance = await rewardToken.balanceOf(user1.address);

    expect(rewardBalance).to.be.gt(ethers.parseEther("0"));
  });

  it("Debe permitir withdraw", async function () {
    await stakingToken.connect(user1).approve(await vault.getAddress(), stakeAmount);
    await vault.connect(user1).stake(stakeAmount);

    await vault.connect(user1).withdraw(stakeAmount);

    const balance = await vault.balanceOf(user1.address);

    expect(balance).to.equal(0);
  });

  it("No debe permitir stake sin aprobar tokens", async function () {
    await expect(
      vault.connect(user1).stake(stakeAmount)
    ).to.be.reverted;
  });

  it("No debe permitir withdraw más de lo depositado", async function () {
    await stakingToken.connect(user1).approve(await vault.getAddress(), stakeAmount);
    await vault.connect(user1).stake(stakeAmount);

    await expect(
      vault.connect(user1).withdraw(ethers.parseEther("200"))
    ).to.be.reverted;
  });
});