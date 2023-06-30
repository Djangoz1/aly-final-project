const { ethers } = require("hardhat");
// const { ethers } = require("ethers");
const { expect, assert } = require("chai");
const {
  _testInitFactoryMission,
  _testInitFactoryCV,
  _testInitCV,
} = require("../../helpers/test_init");
const { _testParseHex } = require("../../helpers/test_utils");

const CONTRACT_NAME = "FactoryMission";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let factoryMission;
  let factoryCV;
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

    try {
      factoryCV = await _testInitFactoryCV();
      cv = await _testInitCV({ factoryCV, owner: this.owner.address });
      factoryMission = await _testInitFactoryMission(factoryCV.target);
    } catch (error) {
      console.log("error", error);
    }
  });

  // ********************************** //
  // *:::::::: INITIALISATION ::::::::* //
  // ------------------------------------
  describe("Initialization", () => {
    it("Should be ok", async () => {});
    it("Should  get price to 0.1 ether", async () => {
      let price = await factoryMission.getPrice();
      expect(price.toString()).to.equal("100000000000000000");
    });

    it("Should  get balance to 0", async () => {
      let balance = await factoryMission.getBalance();
      expect(balance.toString()).to.equal("0");
    });

    it("Should  get number of mission to 0", async () => {
      let number = await factoryMission.getMissionsLength();
      expect(number.toString()).to.equal("0");
    });

    it("Should  can create a mission", async () => {
      const amount = ethers.parseEther("0.2");

      let transaction = await cv.buyMission(factoryMission.target, amount);

      transaction.wait();
      let number = await factoryMission.getMissionsLength();
      expect(number.toString()).to.equal("1");
    });

    it("Should  get a mission address", async () => {
      const amount = ethers.parseEther("0.2");

      let transaction = await cv.buyMission(factoryMission.target, amount);
      transaction.wait();
      const length = await cv.getMissionsLength();
      expect(length.toString()).to.equal("1");
    });
  });
  // -

  // --------------------------------
  // * --- Set number ---
  // --------------------------------
  // describe("Set number", () => {
  //   let target = 777;
  //   it(`Should set number to ${target}`, async () => {
  //     let transaction = await mission.setNumber(target);
  //     transaction.wait();
  //     let numberAfter = await mission.getNumber();
  //     expect(numberAfter.toString()).to.equal(target.toString());
  //   });
  // });
  // -
});
