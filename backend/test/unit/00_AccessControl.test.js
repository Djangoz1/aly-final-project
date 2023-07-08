const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const {
  _testInitFactoryCV,
  _testInitCV,
  _testInitFactoryMission,
  _testInitAccessControl,
} = require("../../helpers/test_init");

const CONTRACT_NAME = "AccessControl";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let accessControll;
  let factoryCV;
  let factoryMission;
  let pubHub;

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
    accessControll = await _testInitAccessControl();
    console.log(accessControll);

    // pubHub;
    // let factoryCV = await _testInitFactoryCV();
    // factoryMission = await _testInitFactoryMission(factoryCV.target);
    // cv = await _testInitCV({ factoryCV, owner: this.addr1.address });
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe.only("Initialization", () => {
    it("Should deploy smart contract properly", async () => {
      //   expect(cv.target).to.not.equal(0x0);
      //   expect(cv.target).to.not.equal("");
      //   expect(cv.target).to.not.equal(null);
      //   expect(cv.target).to.not.equal(undefined);
    });
  });
});
