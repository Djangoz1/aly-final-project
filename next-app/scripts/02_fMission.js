// import { ADDR_FACTORY_CV } from "constants/address";
const ADDR_FACTORY_CV = "0xf5059a5D33d5853360D16C683c16e67980206f36";

const hre = require("hardhat");
const CONTRACT_NAME = "FactoryMission";

async function main() {
  const CommitWorker = await hre.ethers.deployContract("CommitWorker");
  const Milestone = await hre.ethers.deployContract("Milestone");

  // Récupération de l'adresse déployée de la bibliothèque
  const lcwAddr = CommitWorker.address;
  const lmAddr = Milestone.address;

  const FactoryMission = await hre.ethers.getContractFactory(CONTRACT_NAME, {
    libraries: {
      CommitWorker: lcwAddr,
      Milestone: lmAddr,
    },
  });
  const factoryMission = await FactoryMission.deploy(ADDR_FACTORY_CV);
  console.log("test", factoryMission);
  console.log(`FactoryMission deployed to ${factoryMission.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
