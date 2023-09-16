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

  const accessControl = contracts.accessControl;
  console.log(`Access control deployed to ${accessControl.target}`);

  const CVsHub = contracts.CVsHub;
  console.log(`CVsHub deployed to ${CVsHub.target}`);

  const missionsHub = contracts.missionsHub;
  console.log(`MissionsHub deployed to ${missionsHub.target}`);

  const featuresHub = contracts.featuresHub;
  console.log(`FeaturesHub deployed to ${featuresHub.target}`);

  const workerProposalHub = contracts.workerProposalHub;
  console.log(`workerProposalHub deployed to ${workerProposalHub.target}`);

  const pubsHub = contracts.pubsHub;
  console.log(`pubsHub deployed to ${pubsHub.target}`);

  const launchpadContracts = contracts.launchpadContracts;
  const { cohort, datas, investors, hub } = launchpadContracts;
  console.log(`launchpadCohort deployed to ${cohort.target}`);
  console.log(`LaunchpadsDatasHub deployed to ${datas.target}`);
  console.log(`LaunchpadsInvestorsHubs deployed to ${investors.target}`);
  console.log(`launchpadHub deployed to ${hub.target}`);

  const addressHub = contracts.addressHub;
  console.log(`addressHub deployed to ${addressHub.target}`);

  const DisputesDatasHub = contracts.DisputesDatasHub;
  console.log(`DisputesDatasHub deployed to ${DisputesDatasHub.target}`);

  const balancesHub = contracts.balancesHub;
  console.log(`balancesHub deployed to ${balancesHub.target}`);

  const apiPost = contracts.apiPost;
  console.log(`apiPost deployed to ${apiPost.target}`);

  const factory = contracts.factory;
  console.log(`factory deployed to ${factory.target}`);
  s;
  const disputesHub = contracts.disputesHub;
  console.log(`disputesHub deployed to ${disputesHub.target}`);

  const arbitratorsHub = contracts.arbitratorsHub;
  console.log(`arbitratorsHub deployed to ${arbitratorsHub.target}`);

  const cvsDatasHub = contracts.cvsDatasHub;
  console.log(`cvsDatasHub deployed to ${cvsDatasHub.target}`);

  const collectWorkInteraction = contracts.collectWorkInteraction;
  console.log(
    `collectWorkInteraction deployed to ${collectWorkInteraction.target}`
  );

  const collecterLike = contracts.collecterLike;
  console.log(`collecterLike deployed to ${collecterLike.target}`);

  const collecterPubs = contracts.collecterPubs;
  console.log(`collecterPubs deployed to ${collecterPubs.target}`);

  const jsonContent = {
    accessControl: accessControl.target,
    CVsHub: CVsHub.target,
    missionsHub: missionsHub.target,
    featuresHub: featuresHub.target,
    workerProposalHub: featuresHub.target,
    pubsHub: pubsHub.target,
    launchpadCohort: cohort.target,
    LaunchpadsDatasHub: datas.target,
    LaunchpadsInvestorsHubs: investors.target,
    launchpadHub: hub.target,
    addressHub: addressHub.target,
    DisputesDatasHub: DisputesDatasHub.target,
    balancesHub: balancesHub.target,
    apiPost: apiPost.target,
    factory: factory.target,
    disputesHub: disputesHub.target,
    arbitratorsHub: arbitratorsHub.target,
    cvsDatasHub: cvsDatasHub.target,
    collectWorkInteraction: collectWorkInteraction.target,
    collecterLike: collecterLike.target,
    collecterPubs: collecterPubs.target,
  };
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return jsonContent;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
