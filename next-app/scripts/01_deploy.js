const hre = require("hardhat");
const {
  _testInitFactoryMission,
  _testInitFactoryCV,
} = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";

async function main() {
  const factoryCV = await _testInitFactoryCV();
  console.log(`FactoryCV deployed to ${factoryCV.address}`);
  const factoryMission = await _testInitFactoryMission(factoryCV.address);
  console.log(`FactoryMission deployed to ${factoryMission.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});