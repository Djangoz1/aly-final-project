const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const CONTRACT_NAME = "CV";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let cv;
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
    let contract = await ethers.getContractFactory("FactoryCV");
    let factoryCV = await contract.deploy();
    await factoryCV.createCV(this.addr1.address);
    let cvI = await ethers.getContractAt(
      CONTRACT_NAME,
      await factoryCV.getCV(this.addr1.address)
    );
    cv = await cvI.deployed();
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization", () => {
    it("Should deploy smart contract properly", async () => {
      expect(cv.address).to.not.equal(0x0);
      expect(cv.address).to.not.equal("");
      expect(cv.address).to.not.equal(null);
      expect(cv.address).to.not.equal(undefined);
    });

    it("Should NOT get mission", async () => {
      let length = await cv.getMissionsLength();
      expect(length).to.equal(0);
    });

    it("Should get the good owner", async () => {
      expect(await cv.owner()).to.equal(this.addr1.address);
    });

    // it("Should set a mission", async () => {
    //   let transaction = await cv.setMission(
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test",
    //     "test"
    //   );
    //   transaction.wait();
    //   let length = await cv.getMissionLength();
    //   expect(length).to.equal(1);
    // });
  });
});
