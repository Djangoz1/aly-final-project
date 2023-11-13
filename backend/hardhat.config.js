require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.5.16",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
      evmVersion: "istanbul",
      viaIR: true,
      outputSelection: {
        "*": {
          "*": [
            "evm.bytecode.object",
            "evm.deployedBytecode.object",
            "abi",
            "evm.bytecode.sourceMap",
            "evm.deployedBytecode.sourceMap",
            "metadata",
          ],
          "": ["ast"],
        },
      },
    },
  },

  // gasReporter: {
  //   currency: "USD",
  //   gasPrice: 21,
  //   enabled: true,
  // },
};
