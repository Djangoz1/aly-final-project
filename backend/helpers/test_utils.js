const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

module.exports = { _testParseHex, ZERO_ADDRESS };
