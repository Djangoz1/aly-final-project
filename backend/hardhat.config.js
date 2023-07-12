require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
   networks: {
    hardhat: {
      gas: 100000, // Spécifiez le gas limit souhaité ici
    },
  },

  // gasReporter: {
  //   currency: 'CHF',
  //   gasPrice: 21,
  //   enabled: true,
  // },
  
};
