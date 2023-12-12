require("@nomicfoundation/hardhat-toolbox");


require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env

const privateKey = process.env.PRIVATE_KEY;
const infuraID = process.env.INFURA_ID;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraID}`,
      chainId: 11155111,
      accounts: [`0x${privateKey}`],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraID}`,
      accounts: [`0x${privateKey}`],
    },
  },
  etherscan: {
    apiKey: { sepolia: process.env.ETHERSCAN },
  },

  solidity: "0.8.20",

  
};
