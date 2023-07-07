require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_ID = process.env.INFURA_ID || "";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "../**/contracts/**/*.sol",
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
};
