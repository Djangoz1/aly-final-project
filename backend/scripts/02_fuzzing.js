// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");
const { deleter } = require("./04_deletePin");

const hre = require("hardhat");

const { createURI, createImage } = require("../utils/pinata");
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
  let launchpadID = await _createLaunchpad({
    account: this.owner,
    addressSystem: addressSystem.target,
  });
  console.log("launchpad created at id ", launchpadID);
  launchpadID = await _createLaunchpad({
    account: this.owner,
    addressSystem: addressSystem.target,
  });
  console.log("launchpad created at id ", launchpadID);
  let datas = await apiGet.datasOfLaunchpad(launchpadID);
  await apiPostPayable
    .connect(this.addr2)
    .buyTokens(launchpadID, { value: datas.maxInvest });

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
    await _createFeature({
      account: this.addr5,
      accounts: [this.addr4],
      specification: 6,
      finish: true,
      addressSystem: addressSystem.target,
    });
    await _createFeature({
      account: this.addr5,

      accounts: [this.addr2],
      specification: 6,
      finish: true,
      addressSystem: addressSystem.target,
    });
    await _createFeature({
      account: this.addr5,

      accounts: [this.owner],
      specification: 6,
      finish: true,
      addressSystem: addressSystem.target,
    });

    await _createFeature({
      account: this.addr5,

      accounts: [this.addr6],
      specification: 6,
      finish: true,
      addressSystem: addressSystem.target,
    });
    let feature = await _createFeature({
      account: this.addr5,

      accounts: [this.addr3],
      specification: 6,
      finish: true,
      addressSystem: addressSystem.target,
    });

    feature = await _createFeature({
      account: this.addr5,
      missionID: feature.missionID,
      specification: 7,
      addressSystem: addressSystem.target,
    });

    await apiPost.connect(this.addr5).inviteWorker(1, feature.featureID);

    feature = await _createFeature({
      account: this.owner,
      accounts: [this.addr1],
      specification: 6,
      addressSystem: addressSystem.target,
    });
    let uri = await createURI({
      table: "escrows",
      metadatas: {
        description:
          "Je n'ai plus de nouvelles du dev depuis la création de la mission. Il ne répond pas à mes messages alors que je le vois publier sur son mur. Le temps file et j'ai peur qu'il attende la période d'unlock pour partir avec son salaire sans me délivrer ce que j'attendais",
        featureID: feature.featureHash,
      },
    });
    await apiPost.contestFeature(feature.featureID, 30, 3, uri);

    let disputeID = await apiGet.tokensLengthOf(
      await addressSystem.disputesHub()
    );
    console.log("dispute created at", disputeID);
    await apiPost.initDispute(disputeID);
    for (let _index = 0; _index < _mission.features.length; _index++) {
      const _feature = _mission.features[_index];
      let feature = await _createFeature({
        account: this.owner,
        accounts: _feature?.account ? [accounts[_feature.account]] : undefined,
        missionID: mission.missionID,
        specification: _feature.specification,
        domain: _feature.domain,
        isInviteOnly: false,
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
        "to dos "
      );
      console.log(
        _feature.account
          ? `${
              fuzzing.accounts[_feature.account]?.username
            } is worker of feature`
          : "No worker on feature"
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
