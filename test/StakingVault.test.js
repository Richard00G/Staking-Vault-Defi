const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const e = (n) => ethers.parseEther(String(n));
const WEEK = 7 * 24 * 60 * 60;
const REWARD = e(1000);

async function deployFixture() {
  const [owner, alice, bob] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("TesToken");
  const stakingToken = await Token.deploy("StakeToken", "STK");
  const rewardToken = await Token.deploy("RewardToken", "RWD");

  const Vault = await ethers.getContractFactory("StakingVault");
  const vault = await Vault.deploy(await stakingToken.getAddress(), await rewardToken.getAddress());
  const vaultAddr = await vault.getAddress();

  for (const u of [alice, bob]) {
    await stakingToken.transfer(u.address, e(1000));
    await stakingToken.connect(u).approve(vaultAddr, ethers.MaxUint256);
  }
  await rewardToken.approve(vaultAddr, ethers.MaxUint256);

  return { owner, alice, bob, stakingToken, rewardToken, vault };
}

async function fundedFixture() {
  const f = await deployFixture();
  await f.vault.notifyRewardAmount(REWARD);
  return f;
}

describe("StakingVault", function () {
  describe("Stake / withdraw", function () {
    it("permite stake y actualiza balances", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await expect(vault.connect(alice).stake(e(100)))
        .to.emit(vault, "Staked").withArgs(alice.address, e(100));
      expect(await vault.balanceOf(alice.address)).to.equal(e(100));
      expect(await vault.totalSupply()).to.equal(e(100));
    });

    it("rechaza stake de 0", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await expect(vault.connect(alice).stake(0)).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("rechaza stake sin approve", async function () {
      const { vault, owner } = await loadFixture(fundedFixture);
      await expect(vault.connect(owner).stake(e(1))).to.be.reverted;
    });

    it("permite withdraw y devuelve los tokens", async function () {
      const { vault, alice, stakingToken } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await vault.connect(alice).withdraw(e(40));
      expect(await vault.balanceOf(alice.address)).to.equal(e(60));
      expect(await stakingToken.balanceOf(alice.address)).to.equal(e(940));
    });

    it("no permite retirar más de lo depositado", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await expect(vault.connect(alice).withdraw(e(200)))
        .to.be.revertedWithCustomError(vault, "InsufficientBalance");
    });
  });

  describe("Rewards", function () {
    it("acumula rewards con el tiempo", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await time.increase(3600);
      expect(await vault.earned(alice.address)).to.be.gt(0);
    });

    it("los rewards se detienen al terminar el periodo (no paga de más)", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await time.increase(30 * 24 * 60 * 60); // 30 días, el periodo es de 7
      const earned = await vault.earned(alice.address);
      expect(earned).to.be.lte(REWARD);
      expect(earned).to.be.closeTo(REWARD, e("0.01"));
    });

    it("el vault siempre puede pagar todos los rewards", async function () {
      const { vault, alice, bob, rewardToken } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await time.increase(WEEK / 2);
      await vault.connect(bob).stake(e(300));
      await time.increase(2 * WEEK);
      await vault.connect(alice).claimReward();
      await vault.connect(bob).claimReward();
      const paid = (await rewardToken.balanceOf(alice.address)) + (await rewardToken.balanceOf(bob.address));
      expect(paid).to.be.lte(REWARD);
      expect(paid).to.be.closeTo(REWARD, e("0.01"));
    });

    it("reparte proporcional al stake", async function () {
      const { vault, alice, bob } = await loadFixture(deployFixture);
      await vault.connect(alice).stake(e(100));
      await vault.connect(bob).stake(e(300));
      await vault.notifyRewardAmount(REWARD);
      await time.increase(WEEK + 1);
      const a = await vault.earned(alice.address);
      const b = await vault.earned(bob.address);
      expect(b).to.be.closeTo(a * 3n, e("0.01"));
    });

    it("claimReward paga y deja rewards en 0", async function () {
      const { vault, alice, rewardToken } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await time.increase(3600);
      await expect(vault.connect(alice).claimReward()).to.emit(vault, "RewardPaid");
      expect(await rewardToken.balanceOf(alice.address)).to.be.gt(0);
      expect(await vault.rewards(alice.address)).to.equal(0);
    });

    it("claimReward sin rewards revierte", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await expect(vault.connect(alice).claimReward()).to.be.revertedWithCustomError(vault, "NoRewards");
    });

    it("exit retira todo y cobra rewards", async function () {
      const { vault, alice, stakingToken, rewardToken } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await time.increase(3600);
      await vault.connect(alice).exit();
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await stakingToken.balanceOf(alice.address)).to.equal(e(1000));
      expect(await rewardToken.balanceOf(alice.address)).to.be.gt(0);
    });
  });

  describe("Owner", function () {
    it("solo el owner puede fondear rewards", async function () {
      const { vault, alice } = await loadFixture(deployFixture);
      await expect(vault.connect(alice).notifyRewardAmount(e(1)))
        .to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("recargar a mitad de periodo suma lo que faltaba repartir", async function () {
      const { vault } = await loadFixture(fundedFixture);
      await time.increase(WEEK / 2);
      await vault.notifyRewardAmount(REWARD);
      // ~500 sobrantes + 1000 nuevos repartidos en 7 días
      expect(await vault.getRewardForDuration()).to.be.closeTo(e(1500), e(1));
    });

    it("con pausa no se puede stakear pero sí retirar", async function () {
      const { vault, alice } = await loadFixture(fundedFixture);
      await vault.connect(alice).stake(e(100));
      await vault.pause();
      await expect(vault.connect(alice).stake(e(1)))
        .to.be.revertedWithCustomError(vault, "EnforcedPause");
      await vault.connect(alice).withdraw(e(100));
      expect(await vault.balanceOf(alice.address)).to.equal(0);
    });

    it("no deja cambiar la duración a mitad de periodo", async function () {
      const { vault } = await loadFixture(fundedFixture);
      await expect(vault.setRewardsDuration(WEEK * 2))
        .to.be.revertedWithCustomError(vault, "PeriodNotFinished");
      await time.increase(WEEK + 1);
      await vault.setRewardsDuration(WEEK * 2);
      expect(await vault.duration()).to.equal(WEEK * 2);
    });

    it("no deja rescatar los tokens del vault", async function () {
      const { vault, stakingToken, rewardToken } = await loadFixture(fundedFixture);
      await expect(vault.recoverERC20(await stakingToken.getAddress(), 1))
        .to.be.revertedWithCustomError(vault, "CannotRecoverVaultToken");
      await expect(vault.recoverERC20(await rewardToken.getAddress(), 1))
        .to.be.revertedWithCustomError(vault, "CannotRecoverVaultToken");
    });
  });
});

describe("TesToken faucet", function () {
  it("entrega tokens y respeta el cooldown", async function () {
    const { stakingToken, alice } = await loadFixture(deployFixture);
    await stakingToken.connect(alice).faucet(e(100));
    await expect(stakingToken.connect(alice).faucet(e(100)))
      .to.be.revertedWithCustomError(stakingToken, "FaucetCooldown");
    await time.increase(601);
    await stakingToken.connect(alice).faucet(e(100));
  });

  it("no permite pedir más del máximo", async function () {
    const { stakingToken, alice } = await loadFixture(deployFixture);
    await expect(stakingToken.connect(alice).faucet(e(1001)))
      .to.be.revertedWithCustomError(stakingToken, "FaucetAmountTooHigh");
  });
});
