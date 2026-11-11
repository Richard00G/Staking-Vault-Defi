const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

const { ethers, network } = hre;

// Cantidad de RWD con la que se fondea el primer periodo (7 días).
const INITIAL_REWARD = ethers.parseEther(process.env.INITIAL_REWARD || "10000");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Red: ${network.name} | Deployer: ${deployer.address}`);

  const Token = await ethers.getContractFactory("TesToken");
  const stakingToken = await Token.deploy("StakeToken", "STK");
  await stakingToken.waitForDeployment();
  const rewardToken = await Token.deploy("RewardToken", "RWD");
  await rewardToken.waitForDeployment();

  const Vault = await ethers.getContractFactory("StakingVault");
  const vault = await Vault.deploy(await stakingToken.getAddress(), await rewardToken.getAddress());
  await vault.waitForDeployment();

  const addresses = {
    chainId: Number(network.config.chainId ?? (await ethers.provider.getNetwork()).chainId),
    stakingToken: await stakingToken.getAddress(),
    rewardToken: await rewardToken.getAddress(),
    vault: await vault.getAddress(),
    // Bloque del deploy: el frontend busca el historial de movimientos desde aquí
    deployBlock: (await vault.deploymentTransaction().wait()).blockNumber,
  };
  console.log(addresses);

  // Fondear el primer periodo de rewards
  await (await rewardToken.approve(addresses.vault, INITIAL_REWARD)).wait();
  await (await vault.notifyRewardAmount(INITIAL_REWARD)).wait();
  console.log(`Rewards fondeados: ${ethers.formatEther(INITIAL_REWARD)} RWD por 7 días`);

  // Exportar direcciones y ABIs al frontend
  const frontendDir = path.join(__dirname, "..", "frontend", "src");
  fs.writeFileSync(
    path.join(frontendDir, "lib", "addresses.json"),
    JSON.stringify(addresses, null, 2) + "\n"
  );
  for (const name of ["StakingVault", "TesToken"]) {
    const { abi } = await hre.artifacts.readArtifact(name);
    const file = name === "TesToken" ? "TestToken.json" : `${name}.json`;
    fs.writeFileSync(path.join(frontendDir, "abi", file), JSON.stringify({ abi }, null, 2) + "\n");
  }
  console.log("Frontend actualizado: lib/addresses.json y abi/*.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
