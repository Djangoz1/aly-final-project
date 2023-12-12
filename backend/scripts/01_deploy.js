const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);



const {
  _testInitMissionsHub,
  _testInitFactoryCV,
  _testInitPubHub,
  _testInitWorkerProposalHub,
  _testInitAccessControl,
  _testInitFeaturesHub,
  _testInitLaunchpadContracts,
  _testInitAll,
} = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";

// import ADDRS from "../../core/tasks/helpers/utils";
async function main() {
  // ! FORK UNI en local
  [
    this.owner,
    this.addr1,
    this.addr2,
    this.addr3,
    this.addr4,
    this.addr5,
    this.addr6,
    this.addr7,
  ] = await ethers.getSigners();
  // const core = await deployFactory();
  // console.log(core);
  // const periphery = await deployRouter();
  // console.log(periphery);
  const contracts = await _testInitAll();

  let token = contracts.token;

  const accessControl = contracts.systems.accessControl;

  const cvsHub = contracts.cvs.hub;

  const missionsHub = contracts.works.missionsHub;

  const featuresHub = contracts.works.featuresHub;


  const pubsHub = contracts.pubs.hub;

  const launchpadContracts = contracts.launchpads;
  const { datas, investors, hub } = launchpadContracts;

  const addressSystem = contracts.systems.addressSystem;

  const disputesDatasHub = contracts.escrows.datas;

  const balancesHub = contracts.systems.balancesHub;

  const apiPost = contracts.systems.apiPost;

  const apiPostPayable = contracts.systems.apiPostPayable;

  const apiGet = contracts.systems.apiGet;

  const factory = contracts.systems.factory;

  const disputesHub = contracts.escrows.disputesHub;

  const arbitratorsHub = contracts.escrows.arbitratorsHub;


  const collectWorkInteraction = contracts.works.collectWorkInteraction;

  const pubsDatasHub = contracts.pubs.datas;

  const jsonContent = {

    token: token.target,
    
    accessControl: accessControl.target,
    cvsHub: cvsHub.target,
    missionsHub: missionsHub.target,
    featuresHub: featuresHub.target,
    pubsHub: pubsHub.target,
    launchpadsDatasHub: datas.target,
    launchpadsInvestorsHubs: investors.target,
    launchpadHub: hub.target,
    addressSystem: addressSystem.target,
    disputesDatasHub: disputesDatasHub.target,
    balancesHub: balancesHub.target,
    apiPost: apiPost.target,
    apiPostPayable: apiPostPayable.target,
    apiGet: apiGet.target,
    factory: factory.target,
    disputesHub: disputesHub.target,
    arbitratorsHub: arbitratorsHub.target,
    collectWorkInteraction: collectWorkInteraction.target,
    pubsDatasHub: pubsDatasHub.target,
  };
  console.log("ADDRESS content", jsonContent);

  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return contracts;
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

module.exports = { main };