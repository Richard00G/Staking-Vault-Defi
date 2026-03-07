const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("StakingVault", function () {

  let stakeToken, rewardToken, vault;
  let owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");

    stakeToken = await ERC20Mock.deploy(
      "Stake Token",
      "STK", 
      owner.address,
      ethers.parseEther("1000000")
    );

    rewardToken = await ERC20Mock.deploy(
      "Reward Token",
      "RWD",
      owner.address,
      ethers.parseEther("1000000")
    );

    const Vault = await ethers.getContractFactory("StakingVault");
    vault = await Vault.deploy(stakeToken.target, rewardToken.target);

    await rewardToken.transfer(vault.target, ethers.parseEther("10000"));
    await vault.notifyRewardAmount(ethers.parseEther("10000"));

    await stakeToken.transfer(user1.address, ethers.parseEther("100"));
  });

  it("User earns rewards over time", async function () {

    await stakeToken.connect(user1).approve(
      vault.target,
      ethers.parseEther("100")
    );

    await vault.connect(user1).stake(ethers.parseEther("100"));

    // Avanzar 1 hora
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    const earned = await vault.earned(user1.address);

    expect(earned).to.be.gt(0);
  });

  console.log("reward:", ethers.parseEther("1000000000").toString());

});