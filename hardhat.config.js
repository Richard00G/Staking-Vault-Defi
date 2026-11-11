require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ quiet: true });

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const networks = {};
// Solo se configura Sepolia si existen las variables; así compile/test
// funcionan en CI y en tu máquina sin necesitar llaves.
if (SEPOLIA_RPC_URL && PRIVATE_KEY) {
  networks.sepolia = { url: SEPOLIA_RPC_URL, accounts: [PRIVATE_KEY] };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks,
  etherscan: { apiKey: ETHERSCAN_API_KEY || "" },
};
