const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { _testInitFactoryCV, _testInitCV } = require("../../helpers/test_init");

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

    let factoryCV = await _testInitFactoryCV();

    cv = await _testInitCV({ factoryCV, owner: this.addr1.address });
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization", () => {
    it("Should deploy smart contract properly", async () => {
      expect(cv.target).to.not.equal(0x0);
      expect(cv.target).to.not.equal("");
      expect(cv.target).to.not.equal(null);
      expect(cv.target).to.not.equal(undefined);
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