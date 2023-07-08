const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const {
  _testInitFactoryMission,
  _testInitFactoryCV,
} = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";

// import ADDRS from "../../core/tasks/helpers/utils";
async function main() {
  const factoryCV = await _testInitFactoryCV();

  console.log(`FactoryCV deployed to ${factoryCV.target}`);

  const factoryMission = await _testInitFactoryMission(factoryCV.target);
  console.log(`FactoryMission deployed to ${factoryMission.target}`);

  const jsonContent = {
    "factory CV": factoryCV.target,
    "factory Mission": factoryMission.target,
  };
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return { factoryCV: factoryCV.target, factoryMission: factoryMission.target };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
