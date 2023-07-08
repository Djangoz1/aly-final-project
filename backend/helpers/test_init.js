const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testParseHex, ZERO_ADDRESS } = require("./test_utils");

const FactoryMission_NAME = "FactoryMission";

const _testInitAccessControl = async () => {
  const accessControl = await ethers.deployContract("AccessControl");
  await accessControl.waitForDeployment();
  return accessControl;
};

const _testInitFactoryCV = async () => {
  const factoryCV = await ethers.deployContract("FactoryCV");

  await factoryCV.waitForDeployment();

  return factoryCV;
};

const _testInitCV = async ({ factoryCV, owner }) => {
  await factoryCV.createCV(owner);
  let cvAddr = await factoryCV.getCV(owner);
  const CV = await ethers.getContractAt("CV", cvAddr);
  await CV.waitForDeployment();
  return CV;
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
const _testInitFactoryMission = async (_fcvAddr) => {
  const factoryMission = await ethers.deployContract(FactoryMission_NAME, [
    _fcvAddr,
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
  _testInitFactoryCV,
  _testInitCV,
  _testInitFactoryMission,
  _testInitMission,
  _testInitFeature,
};
