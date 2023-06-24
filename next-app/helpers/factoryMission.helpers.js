const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const getContractFactoryMission = async ({ factoryCV }) => {
  const FactoryMission = await ethers.getContractFactory("FactoryMission");
  let factoryMission = await FactoryMission.deploy(factoryCV.address);
  return factoryMission;
};

const getContractMission = async ({ cv, factoryMission }) => {
  const amount = ethers.utils.parseEther("0.2");

  await cv.buyMission(factoryMission.address, amount);

  let length = await cv.getMissionsLength();

  let missionAddr = await cv.getMission(length - 1);
  const Mission = await ethers.getContractAt("Mission", missionAddr);
  return Mission;
};

const setFeature = async (mission, _addrWorker) => {
  let isInviteOnly;
  const addrZero = ethers.constants.AddressZero;
  if (_addrWorker == addrZero) {
    isInviteOnly = false;
  } else {
    isInviteOnly = true;
  }

  const tx = await mission.setFeature(
    30,
    2000,
    "Fais quelque chose",
    _addrWorker,
    isInviteOnly
  );
  tx.wait();
};

module.exports = {
  getContractFactoryMission,
  getContractMission,
  setFeature,
};
