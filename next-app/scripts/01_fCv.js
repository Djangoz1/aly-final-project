const hre = require("hardhat");
const CONTRACT_NAME = "FactoryCV";

async function main() {
  const FactoryCV = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const factoryCV = await FactoryCV.deploy();

  await factoryCV.deployed();
  console.log(`FactoryCV deployed to ${factoryCV.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
