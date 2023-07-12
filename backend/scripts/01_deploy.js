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
  _testInitFeaturesHub
} = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";

// import ADDRS from "../../core/tasks/helpers/utils";
async function main() {
  const accessControl = await _testInitAccessControl()
  console.log(`Access control deployed to ${accessControl.target}`);
  
  const factoryCV = await _testInitFactoryCV(accessControl.target);
  console.log(`FactoryCV deployed to ${factoryCV.target}`);

  const missionsHub = await _testInitMissionsHub(accessControl.target);
  console.log(`MissionsHub deployed to ${missionsHub.target}`);
  
  const featuresHub = await _testInitFeaturesHub(accessControl.target)
  console.log(`FeaturesHub deployed to ${featuresHub.target}`);
  
  const workerProposalHub = await _testInitWorkerProposalHub(accessControl.target)
  console.log(`workerProposalHub deployed to ${workerProposalHub.target}`);
  
  const pubsHub = await _testInitPubHub(accessControl.target)
  console.log(`pubsHub deployed to ${pubsHub.target}`);

  const jsonContent = {
    "accessControl": accessControl.target,
    "factoryCV": factoryCV.target,
    "missionsHub": missionsHub.target,
    "pubsHub": pubsHub.target,
    "featuresHub": featuresHub.target,
    "workerProposalHub": featuresHub.target,
  };
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return { factoryCV: factoryCV.target, missionsHub: missionsHub.target, accessControl : accessControl.target, 
  featuresHub : featuresHub.target, workerProposalHub: workerProposalHub.target, pubsHub: pubsHub.target };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
