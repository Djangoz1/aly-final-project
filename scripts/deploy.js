const hre = require("hardhat");
const CONTRACT_NAME = process.env.CONTRACT_NAME || "SimpleStorage";

async function main() {
  const SimpleStorage = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const simpleStorage = await SimpleStorage.deploy(777);

  await simpleStorage.deployed();

  console.log(`SimpleStorage deployed to ${simpleStorage.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
