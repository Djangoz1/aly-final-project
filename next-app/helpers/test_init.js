const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { _testParseHex } = require("./test_utils");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const FactoryMission_NAME = "FactoryMission";

const _testInitFactoryCV = async () => {
  const FactoryCV = await hre.ethers.getContractFactory("FactoryCV");
  const factoryCV = await FactoryCV.deploy();

  await factoryCV.deployed();
  return factoryCV;
};

// Need Factory CV address in constructor
const _testInitFactoryMission = async (_fcvAddr) => {
  let factoryMission;
  const CommitWorker = await hre.ethers.deployContract("CommitWorker");
  const Milestone = await hre.ethers.deployContract("Milestone");

  // Récupération de l'adresse déployée de la bibliothèque
  const lcwAddr = CommitWorker.address;
  const lmAddr = Milestone.address;

  let contract = await ethers.getContractFactory(FactoryMission_NAME, {
    libraries: {
      CommitWorker: lcwAddr,
      Milestone: lmAddr,
    },
  });

  factoryMission = await contract.deploy(_fcvAddr);
  await factoryMission.deployed();
  return factoryMission;
};

const _testInitFeature = async ({ mission, values }) => {
  if (!values) {
    values = {};
  }
  const { workerAddr, wadge, estimatedDay, description, isInvite } = values;
  let _length = _testParseHex(await mission.getFeaturesLength());

  let tx = await mission.setFeature(
    estimatedDay || 30,
    wadge || 2000,
    description || "Fais quelque chose",
    workerAddr || ZERO_ADDRESS,
    isInvite || false
  );

  await tx.wait();
  let _newLength = _testParseHex(await mission.getFeaturesLength());
  expect(_newLength).to.equal(_length + 1);
  return tx;
};

module.exports = {
  _testInitFactoryCV,
  _testInitFactoryMission,
  _testInitFeature,
};
