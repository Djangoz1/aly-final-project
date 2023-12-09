// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");
const { deleter } = require("./04_deletePin");

const hre = require("hardhat");

const {
  createURICV,
  getAllPinnedFiles,
  deleteAllPinnedFiles,
  createURI,
  createImage,
} = require("../utils/pinata");
const {
  _createCV,
  _createMission,
  _createFeature,
  _createPub,
  _createLaunchpad,
} = require("../utils/web3-tools");
const { fuzzing } = require("../constants/fuzzing");

async function main() {
  await deleter();
  const mainDeploy = await deployMain();

  let addressSystem = mainDeploy.systems.addressSystem;
  let apiPostPayable = mainDeploy.systems.apiPostPayable;
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

  let accounts = [
    this.owner,
    this.addr1,
    this.addr2,
    this.addr3,
    this.addr4,
    this.addr5,
    this.addr6,
    this.addr7,
  ];
  // await deleteAllPinnedFiles();
  for (let index = 0; index < accounts.length; index++) {
    const account = accounts[index];
    let cv = await _createCV({
      metadatas: {
        username: fuzzing.accounts[index].username,
        avatar: fuzzing.accounts[index]?.avatar,
      },
      account,
      addressSystem: addressSystem.target,
    });
    console.log("cv#", cv, "created for ", fuzzing.accounts[index].username);
  }

  for (let index = 0; index < fuzzing.missions.length; index++) {
    const _mission = fuzzing.missions[index];
    let mission = await _createMission({
      account: this.owner,
      addressSystem: addressSystem.target,
      title: _mission.title,

      domain: _mission.domain,
      abstract: _mission.abstract,
      description: _mission.description,
    });
    for (let index = 0; index < _mission?.gallery?.length; index++) {
      const element = _mission.gallery[index];
      await createImage({
        url: element,
        metadatas: { missionID: mission.missionHash },
      });
    }
    console.log(
      "mission#",
      mission.missionID,
      " ",
      _mission.title,
      " created with ",
      _mission.gallery.length || 0,
      " images"
    );
    for (let _index = 0; _index < _mission.features.length; _index++) {
      const _feature = _mission.features[_index];
      let feature = await _createFeature({
        account: this.owner,
        accounts: [accounts[_feature.account]],
        missionID: mission.missionID,
        specification: _feature.specification,
        domain: _feature.domain,
        estimatedDays: _feature.estimatedDays,
        title: _feature.title,
        skills: _feature.skills,
        description: _feature.description,
        abstract: _feature.abstract,
        addressSystem: addressSystem.target,
      });
      for (let index = 0; index < _feature.toDo.length; index++) {
        const toDo = _feature.toDo[index];
        let workflow = ["to do", "progress", "done"];
        await createURI({
          table: "toDo",
          metadatas: {
            description: toDo.description,
            link: toDo?.link,
            workflow: workflow[toDo.workflow],
            featureID: feature.featureHash,
          },
        });
      }
      console.log(
        "feature#",
        feature.featureID,
        " ",
        _feature.title,
        " created with ",
        _feature?.toDo?.length || 0,
        "to dos"
      );
    }
  }
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
