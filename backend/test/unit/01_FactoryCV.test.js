const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const CONTRACT_NAME = "FactoryCV";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let factoryCV;

  beforeEach(async () => {
    [
      this.owner,
      this.addr1,
      this.addr2,
      this.addr3,
      this.addr4,
      this.addr5,
      this.addr6,
      this.addr7,
    ] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
    factoryCV = await ethers.deployContract(CONTRACT_NAME);
    await factoryCV.waitForDeployment();
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization", () => {
    it("Should deploy smart contract properly", async () => {
      expect(factoryCV.target).to.not.equal(0x0);
      expect(factoryCV.target).to.not.equal("");
      expect(factoryCV.target).to.not.equal(null);
      expect(factoryCV.target).to.not.equal(undefined);
    });

    it("Should create a CV", async () => {
      await factoryCV.createCV(this.addr1.address);
      let number = await factoryCV.getCVsLength();
      expect(number.toString()).to.equal("1");
    });

    it("Should get a CV", async () => {
      let transaction = await factoryCV.createCV(this.addr1.address);
      transaction.wait();
      let cvAddr = await factoryCV.getCV(this.addr1.address);
      let cv = await ethers.getContractAt("CV", cvAddr);
      expect(await cv.owner()).to.equal(this.addr1.address);
    });
  });
});
