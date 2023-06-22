require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_ID = process.env.INFURA_ID || "";
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: { url: "http://127.0.0.1:8545", chainId: 1337 },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN,
    },
  },
};
