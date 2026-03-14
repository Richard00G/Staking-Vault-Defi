// Importamos las herramientas de testing
// chai → librería de assertions (expect)
// ethers → librería para interactuar con contratos
// network → permite manipular el tiempo de la blockchain local
const { expect } = require("chai");
const { ethers, network } = require("hardhat");


//define el grupo de pruebas para el contrato
describe("StakingVault", function () {

  // Variables
  let stakeToken, rewardToken, vault;
  let owner, user1;

  // beforeEach 
  beforeEach(async function () {

    //cuentas de prueba de Hardhat
    [owner, user1] = await ethers.getSigners();

    //contrato mock ERC20 para crear tokens de prueba
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");

    // Deploy del token staking
    stakeToken = await ERC20Mock.deploy(
      "Stake Token",          // nombre del token
      "STK",                  // símbolo
      owner.address,          // dirección que recibe el supply inicial
      ethers.parseEther("1000000") // supply inicial
    );

    // Deploy del token para pagar recompensas
    rewardToken = await ERC20Mock.deploy(
      "Reward Token",
      "RWD",
      owner.address,
      ethers.parseEther("1000000")
    );

    // StakingVault
    const Vault = await ethers.getContractFactory("StakingVault");

    // Deploy del vault 
    vault = await Vault.deploy(stakeToken.target, rewardToken.target);

    // Aprobamos que el vault pueda tomar tokens de reward
    await rewardToken.approve(vault.target, ethers.parseEther("10000"));

    //define cuánto reward se distribuirá durante el periodo
    await vault.notifyRewardAmount(ethers.parseEther("10000"));

    // Enviamos tokens de staking al usuario
    await stakeToken.transfer(user1.address, ethers.parseEther("100"));
  });


  // =========================
  // TEST 1
  // Verifica que un usuario gane recompensas con el tiempo
  // =========================
  it("User earns rewards over time", async function () {

    // El usuario permite al contrato usar sus tokens
    await stakeToken.connect(user1).approve(
      vault.target,
      ethers.parseEther("100")
    );

    // El usuario deposita tokens en el vault
    await vault.connect(user1).stake(ethers.parseEther("100"));

    // Avanzamos el tiempo de la blockchain (1 día)
    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");

    // Consultamos cuánto reward ha ganado el usuario
    const earned = await vault.earned(user1.address);

    console.log("earned:", earned.toString());

    // Verificamos que haya ganado algo
    expect(earned).to.be.gt(0);
  });


  // =========================
  // TEST 2
  // Verifica que el usuario pueda reclamar sus recompensas
  // =========================
  it("User can claim rewards", async function () {

    // Aprobación de tokens
    await stakeToken.connect(user1).approve(
      vault.target,
      ethers.parseEther("100")
    );

    // Stake del usuario
    await vault.connect(user1).stake(ethers.parseEther("100"));

    // Avanzamos el tiempo para generar rewards
    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");

    // El usuario reclama sus recompensas
    await vault.connect(user1).claimReward();

    // Revisamos el balance del reward token
    const balance = await rewardToken.balanceOf(user1.address);

    console.log("claimed:", balance.toString());

    // Verificamos que el usuario recibió tokens
    expect(balance).to.be.gt(0);

  });


  // =========================
  // TEST 3
  // Verifica que múltiples usuarios reciban rewards proporcionales
  // =========================
  it("Multiple users receive proportional rewards", async function () {

    const [owner, user1, user2, user3] = await ethers.getSigners();

    // Enviamos tokens de staking a los usuarios
    await stakeToken.transfer(user1.address, ethers.parseEther("100"));
    await stakeToken.transfer(user2.address, ethers.parseEther("100"));
    await stakeToken.transfer(user3.address, ethers.parseEther("100"));

    // Aprobaciones para que el vault pueda usar los tokens
    await stakeToken.connect(user1).approve(vault.target, ethers.parseEther("100"));
    await stakeToken.connect(user2).approve(vault.target, ethers.parseEther("100"));
    await stakeToken.connect(user3).approve(vault.target, ethers.parseEther("100"));

    // user1 entra primero al staking
    await vault.connect(user1).stake(ethers.parseEther("100"));

    // Avanzamos tiempo
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    // user2 entra después
    await vault.connect(user2).stake(ethers.parseEther("100"));

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    // user3 entra al final
    await vault.connect(user3).stake(ethers.parseEther("100"));

    // Avanzamos tiempo para acumular rewards
    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");

    // Calculamos rewards de cada usuario
    const r1 = await vault.earned(user1.address);
    const r2 = await vault.earned(user2.address);
    const r3 = await vault.earned(user3.address);

    console.log("user1:", r1.toString());
    console.log("user2:", r2.toString());
    console.log("user3:", r3.toString());

    // El primero debe ganar más
    expect(r1).to.be.gt(r2);
    expect(r2).to.be.gt(r3);

  });


  // =========================
  // TEST 4
  // Simula un usuario "whale" con muchos tokens
  // =========================
  it("Whale does not break reward distribution", async function () {

    const [owner, whale, shrimp] = await ethers.getSigners();

    // Whale recibe muchísimos tokens
    await stakeToken.transfer(whale.address, ethers.parseEther("100000"));

    // Shrimp recibe pocos tokens
    await stakeToken.transfer(shrimp.address, ethers.parseEther("10"));

    // Aprobaciones
    await stakeToken.connect(whale).approve(vault.target, ethers.parseEther("100000"));
    await stakeToken.connect(shrimp).approve(vault.target, ethers.parseEther("10"));

    // Whale entra primero
    await vault.connect(whale).stake(ethers.parseEther("100000"));

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    // Shrimp entra después
    await vault.connect(shrimp).stake(ethers.parseEther("10"));

    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");

    // Calculamos rewards
    const whaleReward = await vault.earned(whale.address);
    const shrimpReward = await vault.earned(shrimp.address);

    console.log("whale:", whaleReward.toString());
    console.log("shrimp:", shrimpReward.toString());

    // El whale gana más porque aportó más capital
    expect(whaleReward).to.be.gt(shrimpReward);

  });

});