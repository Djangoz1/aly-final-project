const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const getContractCV = async ({ factoryCV, owner }) => {
  await factoryCV.createCV(owner);
  let cvAddr = await factoryCV.cvOf(owner);
  const CV = await ethers.getContractAt("CV", cvAddr);
  return CV;
};

const getContractFactoryCV = async () => {
  const FactoryCV = await ethers.getContractFactory("FactoryCV");
  let factoryCV = await FactoryCV.deploy();
  return factoryCV;
};

module.exports = {
  getContractFactoryCV,
  getContractCV,
};
