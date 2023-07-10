const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testParseHex, ZERO_ADDRESS } = require("./test_utils");

const FactoryMission_NAME = "FactoryMission";

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

const _testInitCV = async (accessControl, account, amount) => {
  const newCV = await accessControl.connect(account).buyCV({
    value: ethers.parseEther(`${amount}`),
  });
  const _cv = await accessControl
    .connect(account)
    .getCVByAddress(account.address);
  const cv = await ethers.getContractAt("CV", _cv);
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
  let oldIndexers =  await accessControl.getPubIndexers(datas.publisher)
  

  const newPub = await accessControl.createPub(datas);
  await newPub.wait();
  const cvAddr = await accessControl.getCVByAddress(newPub.from);
  const cv = await ethers.getContractAt("CV", cvAddr);


  const indexers = await accessControl.getPubIndexers(cvAddr)
  expect(oldIndexers.length).to.be.equal(indexers.length -1)
  const pubAddr = await accessControl.getPubById(parseInt(indexers[indexers.length - 1]))
  const pub = await ethers.getContractAt("Pub", pubAddr);
  expect(await pub.owner()).to.be.equal(cv.target)
  expect(await pub.id()).to.be.equal(indexers[indexers.length - 1]);
  // console.log(await pub.getMetadata())
  
  return pub
  
};

const _testInitMission = async ({ cv, factoryMission }) => {
  const amount = ethers.parseEther("2");

  let transaction = await cv.buyMission(factoryMission.target, amount);
  transaction.wait();
  const length = parseInt(await cv.getMissionsLength());
  expect(length.toString()).to.equal("1");

  let missionAddr = await cv.getMission(length - 1);
  const mission = await ethers.getContractAt("Mission", missionAddr);

  return mission;
};

// Need Factory CV address in constructor
const _testInitFactoryMission = async (_fcvAddr, _accessControl) => {
  const factoryMission = await ethers.deployContract(FactoryMission_NAME, [
    _fcvAddr,
    _accessControl,
  ]);

  return factoryMission;
};

const _testInitFeature = async ({ mission, values }) => {
  if (!values) {
    values = {};
  }
  const { workerAddr, wadge, estimatedDay, description, isInvite } = values;
  let _length = parseInt(await mission.getFeaturesLength());

  let tx = await mission.setFeature(
    estimatedDay || 30,
    wadge || 2000,
    description || "Fais quelque chose",
    workerAddr || ZERO_ADDRESS,
    isInvite || false
  );

  await tx.wait();
  let _newLength = parseInt(await mission.getFeaturesLength());
  expect(_newLength).to.equal(_length + 1);
  return tx;
};

module.exports = {
  _testInitAccessControl,
  _testInitPubHub,
  _testInitFactoryCV,
  _testInitCV,
  _testInitPub,
  _testInitFactoryMission,
  _testInitMission,
  _testInitFeature,
};
