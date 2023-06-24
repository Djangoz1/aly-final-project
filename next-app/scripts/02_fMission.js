// import { ADDR_FACTORY_CV } from "constants/address";
const ADDR_FACTORY_CV = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
const hre = require("hardhat");
const CONTRACT_NAME = "FactoryMission";

async function main() {
  const FactoryMission = await hre.ethers.getContractFactory(CONTRACT_NAME);

  const factoryMission = await FactoryMission.deploy(ADDR_FACTORY_CV);
  await factoryMission.deployed();
  console.log(`FactoryMission deployed to ${factoryMission.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
