const hre = require("hardhat");
const CONTRACT_NAME = process.env.CONTRACT_NAME || "FactoryMission";

async function main() {
  const FactoryMission = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const factoryMission = await FactoryMission.deploy();

  await FactoryMission.deployed();

  console.log(`FactoryMission deployed to ${factoryMission.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
