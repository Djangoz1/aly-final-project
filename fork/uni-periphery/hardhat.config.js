require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.6.6", // Remplacez par la version de Solidity que vous utilisez
    settings: {
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
      evmVersion: "istanbul",
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  // autres configurations...
};
