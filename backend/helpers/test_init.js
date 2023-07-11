const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testParseHex,
  ZERO_ADDRESS,
  FEATURE_DATAS_EXEMPLE,
} = require("./test_utils");

const FactoryMission_NAME = "FactoryMission";

const getContractAt = async (_contract, _address) => {
  const contract = await ethers.getContractAt(_contract, _address);
  return contract;
};

const getProxy = async (accessControlAddr) => {
  const accessControl = await getContractAt("AccessControl", accessControlAddr);
  return accessControl;
};

const _testInitAccessControl = async () => {
  const accessControl = await ethers.deployContract("AccessControl");
  await accessControl.waitForDeployment();
  return accessControl;
};
const _testInitPubHub = async (accessControl) => {
  const pubHub = await ethers.deployContract("PubHub", [accessControl]);
  await pubHub.waitForDeployment();
  return pubHub;
};

const _testInitFactoryCV = async (accessControl) => {
  const factoryCV = await ethers.deployContract("FactoryCV", [accessControl]);

  await factoryCV.waitForDeployment();

  return factoryCV;
};

// *:::::::::::::: -- ::::::::::::::*//
// *:::::::::::::: CV ::::::::::::::*//
// *:::::::::::::: -- ::::::::::::::*//

const getCV = async (_cv) => {
  const cv = await ethers.getContractAt("CV", _cv);
  return cv;
};

const _testInitCV = async (accessControl, account, amount) => {
  const newCV = await accessControl.connect(account).buyCV({
    value: ethers.parseEther(`${amount}`),
  });
  const _cv = await accessControl
    .connect(account)
    .getCVByAddress(account.address);
  const cv = await getCV(_cv);
  return cv;
};

// *:::::::::::::: --- ::::::::::::::*//
// *:::::::::::::: PUB ::::::::::::::*//
// *:::::::::::::: --- ::::::::::::::*//

const _testInitPub = async (accessControlAdress, datas) => {
  const accessControl = await ethers.getContractAt(
    "AccessControl",
    accessControlAdress
  );
  let oldIndexers = await accessControl.getPubIndexers(datas.publisher);

  const newPub = await accessControl.createPub(datas);
  await newPub.wait();
  const cvAddr = await accessControl.getCVByAddress(newPub.from);
  const cv = await ethers.getContractAt("CV", cvAddr);

  const indexers = await accessControl.getPubIndexers(cvAddr);
  expect(oldIndexers.length).to.be.equal(indexers.length - 1);
  const pubAddr = await accessControl.getPubById(
    parseInt(indexers[indexers.length - 1])
  );
  const pub = await ethers.getContractAt("Pub", pubAddr);
  expect(await pub.owner()).to.be.equal(cv.target);
  expect(await pub.id()).to.be.equal(indexers[indexers.length - 1]);

  return pub;
};

const _testInitFeaturesHub = async (accessControlAdress) => {
  const featuresHub = await ethers.deployContract("FeaturesHub", [
    accessControlAdress,
  ]);
  return featuresHub;
};

// *:::::::::::::: ------- ::::::::::::::*//
// *:::::::::::::: MISSION ::::::::::::::*//
// *:::::::::::::: ------- ::::::::::::::*//

const _testInitMission = async (_accessControl, _cv) => {
  const amount = ethers.parseEther("2");
  const accessControl = await getProxy(_accessControl);
  const tx = await accessControl.buyMission({ value: amount });
  tx.wait();
  const indexer = await accessControl.getMissionsIndexers(_cv);
  const missionAddr = await accessControl.getMissionById(
    indexer[indexer.length - 1]
  );
  const mission = await getContractAt("Mission", missionAddr);
  expect(await mission.owner()).to.be.equal(_cv);
  return mission;
};

const _testInitFactoryMission = async (_fcvAddr, _accessControl) => {
  const factoryMission = await ethers.deployContract(FactoryMission_NAME, [
    _fcvAddr,
    _accessControl,
  ]);
  return factoryMission;
};

// *:::::::::::::: ------- ::::::::::::::*//
// *:::::::::::::: FEATURE ::::::::::::::*//
// *:::::::::::::: ------- ::::::::::::::*//

const _testInitFeature = async (_accessControl, _cv, datas) => {
  if (!datas) {
    datas = FEATURE_DATAS_EXEMPLE;
  }
  const accessControl = await getProxy(_accessControl);
  const amount = ethers.parseEther(`${datas.wadge}`);
  datas.wadge = amount;

  const tx = await accessControl.postFeature(datas, {
    value: amount,
  });
  await tx.wait();

  const cv = await getContractAt("CV", _cv);
  expect(await cv.owner()).to.be.equal(tx.from);

  const indexer = await accessControl.getFeatureIndexers(await cv.target);
  const address = await accessControl.getFeatureById(
    indexer[indexer.length - 1]
  );
  const _feature = await getContractAt("Feature", address);
  expect(await _feature.owner()).to.be.equal(cv.target);

  return _feature;
};

module.exports = {
  _testInitAccessControl,
  _testInitPubHub,
  _testInitFeaturesHub,
  _testInitFactoryCV,
  _testInitCV,
  _testInitPub,
  _testInitFactoryMission,
  _testInitMission,
  _testInitFeature,
};
