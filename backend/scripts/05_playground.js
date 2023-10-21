// import { ADDR_FACTORY_CV } from "constants/address";
const ADDRESSES = require("../addresses.json");
const hre = require("hardhat");

const {
  _createCV,

  _createFeature,
  _createLaunchpad,
} = require("../utils/web3-tools");
const { getContractAt } = require("../helpers/test_init");

async function main() {
  //   let addressSystem = mainDeploy.systems.addressSystem;
  let apiPost = getContractAt("apiPost", ADDRESSES.apiPost);
  //   let apiGet = getContractAt("apiGet", ADDRESSES.apiGet);

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

  let feature = await _createFeature({
    account: this.owner,
    accounts: [this.addr6],
    specification: 8,
    missionID: 1,
    addressSystem: ADDRESSES.addressSystem,
  });

  await apiPost.contestFeature(feature.id, 20, 3);

  let _missionID = feature.missionID;
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
