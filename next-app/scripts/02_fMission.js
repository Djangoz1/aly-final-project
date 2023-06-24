// import { ADDR_FACTORY_CV } from "constants/address";
const ADDR_FACTORY_CV = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const ADDR_FACTORY_MISSION = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
const hre = require("hardhat");
const CONTRACT_NAME = "FactoryMission";

async function main() {
  const signer = await hre.ethers.provider.getSigner();

  const factoryMission = await hre.ethers.getContractAt(
    CONTRACT_NAME,
    ADDR_FACTORY_MISSION,
    signer,
    ADDR_FACTORY_CV
  );

  await factoryMission.deployed();
  console.log(`FactoryMission deployed to ${factoryMission.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
