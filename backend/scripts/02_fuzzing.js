// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");

const hre = require("hardhat");
const { _testInitFeature, _testInitCV, _testInitMission, _testInitPub, _testInitWorkerProposal } = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryMission";

async function main() {
  const mainDeploy = await deployMain();


  const _accessControl = mainDeploy["accessControl"]
  
  const addresses = [
    this.owner,
    this.addr1,
    this.addr2,
    this.addr3,
    this.addr4,
    this.addr5,
    this.addr6,
    this.addr7,
  ] = await ethers.getSigners();

  for (let index = 0; index < addresses.length; index++) {
    
    const user = addresses[index];
  
    const cv = await _testInitCV(_accessControl, user, 0.2);
    console.log("CV create on ", cv.target);
    

    const pub = await _testInitPub(_accessControl, user)
    console.log("Pub create on id", pub)
    
    const mission = await _testInitMission(_accessControl, user, 1)
    console.log("Mission create on id", mission)
    
    const feature = await _testInitFeature(_accessControl, user, mission)
    console.log("Feature create on id", feature)
    
    const workerProposal = await _testInitWorkerProposal(_accessControl, user, feature)
    console.log("WorkerProposal create on id", feature)

    

    if (index === 0) {
      await cv.connect(user).setName("Ownie");
    } else {
      await cv.connect(user).setName(`Testor${index}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
