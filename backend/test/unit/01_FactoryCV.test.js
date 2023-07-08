const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { LENS_ADDRS } = require("../../constants/address");
const { _testInitFactoryCV } = require("../../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";
const ABI_LENS_HUB = require("../../../core/artifacts/contracts/core/LensHub.sol/LensHub.json");
describe(`Contract ${CONTRACT_NAME} `, () => {
  let factoryCV;
  let lensHubAddr = LENS_ADDRS["lensHub proxy"];

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
    factoryCV = await _testInitFactoryCV(lensHubAddr);
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe.only("Initialization", () => {
    it("Should deploy smart contract properly", async () => {
      expect(factoryCV.target).to.not.equal(0x0);
      expect(factoryCV.target).to.not.equal("");
      expect(factoryCV.target).to.not.equal(null);
      expect(factoryCV.target).to.not.equal(undefined);
    });

    it("Should set the true lens hub address", async () => {
      const _lensHubAddr = await factoryCV.getLensHub();
      expect(_lensHubAddr).to.not.equal(0x0);
      expect(lensHubAddr).to.be.equal(lensHubAddr);
      // console.log(ABI_LENS_HUB.abi);
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
