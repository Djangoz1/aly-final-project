const ADDR_FACTORY_CV = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
// const CVFactory = require( "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json");

const hre = require("hardhat");
const CONTRACT_NAME = "FactoryCV";

async function main() {
  const factoryCV = await hre.ethers.getContractAt(
    CONTRACT_NAME,
    ADDR_FACTORY_CV
  );

  await factoryCV.deployed();
  console.log(`FactoryCV deployed to ${factoryCV.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
