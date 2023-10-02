// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");
const { deleter } = require("./04_deletePin");

const hre = require("hardhat");
const {
  _testInitFeature,

  _testInitMission,
  _testInitPub,
  _testInitWorkerProposal,
  _testInitArbitrator,
} = require("../helpers/test_init");
const {
  createURICV,
  getAllPinnedFiles,
  deleteAllPinnedFiles,
} = require("../utils/pinata");
const {
  _createCV,
  _createMission,
  _createFeature,
  _createPub,
  _createLaunchpad,
} = require("../utils/web3-tools");

async function main() {
  await deleter();
  const mainDeploy = await deployMain();

  let addressSystem = mainDeploy.systems.addressSystem;
  let apiPost = mainDeploy.systems.apiPost;
  let apiGet = mainDeploy.systems.apiGet;
  let cvsHub = mainDeploy.cvs.hub;
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

  // await deleteAllPinnedFiles();

  let cv = await _createCV("Django", this.owner, addressSystem.target);
  console.log("cv#", cv, "created");

  cv = await _createCV("Testor1", this.addr1, addressSystem.target);
  console.log("cv#", cv, "created");
  cv = await _createCV("Testor2", this.addr2, addressSystem.target);
  console.log("cv#", cv, "created");
  cv = await _createCV("Testor3", this.addr3, addressSystem.target);
  console.log("cv#", cv, "created");
  cv = await _createCV("Testor4", this.addr4, addressSystem.target);
  console.log("cv#", cv, "created");
  cv = await _createCV("Testor5", this.addr5, addressSystem.target);
  console.log("cv#", cv, "created");
  cv = await _createCV("Testor6", this.addr6, addressSystem.target);
  console.log("cv#", cv, "created");

  let launchpad = await _createLaunchpad({
    account: this.owner,
    addressSystem: addressSystem.target,
  });

  console.log("launchpad#", launchpad, "created");

  let pub = await _createPub({
    account: this.owner,
    addressSystem: addressSystem.target,
  });
  console.log("pub#", pub, "created");
  pub = await _createPub({
    account: this.owner,
    addressSystem: addressSystem.target,
  });
  console.log("pub#", pub, "created");

  let feature = await _createFeature({
    account: this.owner,
    accounts: [this.addr1, this.addr2, this.addr3, this.addr4],
    addressSystem: addressSystem.target,
  });
  let _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);
  feature = await _createFeature({
    account: this.owner,
    isInviteOnly: false,
    missionID: _missionID,
    specification: 8,
    title: "Dev Backend",
    accounts: [this.addr1, this.addr2, this.addr3, this.addr4],
    addressSystem: addressSystem.target,
  });
  _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);
  feature = await _createFeature({
    account: this.owner,
    isInviteOnly: false,
    missionID: _missionID,
    specification: 12,
    title: "IA engeneer",
    accounts: [this.addr1, this.addr2, this.addr3, this.addr4],
    addressSystem: addressSystem.target,
  });
  _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);
  feature = await _createFeature({
    account: this.owner,
    isInviteOnly: false,
    missionID: _missionID,
    specification: 15,
    title: "Dev frontend",
    addressSystem: addressSystem.target,
  });
  _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);

  feature = await _createFeature({
    account: this.owner,
    accounts: [this.addr1, this.addr2, this.addr3, this.addr4],
    addressSystem: addressSystem.target,
  });
  _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);

  feature = await _createFeature({
    account: this.owner,
    accounts: [this.addr1, this.addr2, this.addr3, this.addr4],
    addressSystem: addressSystem.target,
    specification: 5,
  });
  _missionID = feature.missionID;
  console.log("mission#", _missionID, "feature#", feature?.id);

  return;

  // if (index === 0) {
  // } else {
  //   await cv.connect(user).setName(`Testor${index}`);
  // }
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
