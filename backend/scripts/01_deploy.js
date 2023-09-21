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
  const contracts = await _testInitAll();

  const accessControl = contracts.systems.accessControl;
  console.log(`Access control deployed to ${accessControl.target}`);

  const cvsHub = contracts.cvs.hub;
  console.log(`CVsHub deployed to ${cvsHub.target}`);

  const missionsHub = contracts.works.missionsHub;
  console.log(`MissionsHub deployed to ${missionsHub.target}`);

  const featuresHub = contracts.works.featuresHub;
  console.log(`FeaturesHub deployed to ${featuresHub.target}`);

  const workProposalHub = contracts.works.workProposalHub;
  console.log(`workProposalHub deployed to ${workProposalHub.target}`);

  const pubsHub = contracts.pubs.hub;
  console.log(`pubsHub deployed to ${pubsHub.target}`);

  const launchpadContracts = contracts.launchpads;
  const { datas, investors, hub } = launchpadContracts;

  console.log(`LaunchpadsDatasHub deployed to ${datas.target}`);
  console.log(`LaunchpadsInvestorsHubs deployed to ${investors.target}`);
  console.log(`launchpadHub deployed to ${hub.target}`);

  const addressSystem = contracts.systems.addressSystem;
  console.log(`addressSystem deployed to ${addressSystem.target}`);

  const disputesDatasHub = contracts.escrows.datas;
  console.log(`disputesDatasHub deployed to ${disputesDatasHub.target}`);

  const balancesHub = contracts.systems.balancesHub;
  console.log(`balancesHub deployed to ${balancesHub.target}`);

  const apiPost = contracts.systems.apiPost;
  console.log(`apiPost deployed to ${apiPost.target}`);

  const apiGet = contracts.systems.apiGet;
  console.log(`apiGet deployed to ${apiGet.target}`);

  const factory = contracts.systems.factory;
  console.log(`factory deployed to ${factory.target}`);

  const disputesHub = contracts.escrows.disputesHub;
  console.log(`disputesHub deployed to ${disputesHub.target}`);

  const arbitratorsHub = contracts.escrows.arbitratorsHub;
  console.log(`arbitratorsHub deployed to ${arbitratorsHub.target}`);

  const cvsDatasHub = contracts.cvs.datas;
  console.log(`cvsDatasHub deployed to ${cvsDatasHub.target}`);

  const collectWorkInteraction = contracts.works.collectWorkInteraction;
  console.log(
    `collectWorkInteraction deployed to ${collectWorkInteraction.target}`
  );

  const pubsDatasHub = contracts.pubs.datas;
  console.log(`collecterLike deployed to ${pubsDatasHub.target}`);

  const jsonContent = {
    accessControl: accessControl.target,
    cvsHub: cvsHub.target,
    missionsHub: missionsHub.target,
    featuresHub: featuresHub.target,
    workProposalHub: featuresHub.target,
    pubsHub: pubsHub.target,
    launchpadsDatasHub: datas.target,
    launchpadsInvestorsHubs: investors.target,
    launchpadHub: hub.target,
    addressSystem: addressSystem.target,
    disputesDatasHub: disputesDatasHub.target,
    balancesHub: balancesHub.target,
    apiPost: apiPost.target,
    apiGet: apiGet.target,
    factory: factory.target,
    disputesHub: disputesHub.target,
    arbitratorsHub: arbitratorsHub.target,
    cvsDatasHub: cvsDatasHub.target,
    collectWorkInteraction: collectWorkInteraction.target,
    pubsDatasHub: pubsDatasHub.target,
  };
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
