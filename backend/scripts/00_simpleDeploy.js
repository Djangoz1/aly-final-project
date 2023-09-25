// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");

const hre = require("hardhat");

async function main() {
  await deployMain();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
