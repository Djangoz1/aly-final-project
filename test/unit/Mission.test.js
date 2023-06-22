const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const CONTRACT_NAME = "Mission";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let factoryMission;
  let factoryCV;
  let cv;
  let mission;
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
    const FactoryCV = await ethers.getContractFactory("FactoryCV");
    const FactoryMission = await ethers.getContractFactory("FactoryMission");
    factoryCV = await FactoryCV.deploy();
    factoryMission = await FactoryMission.deploy(factoryCV.address);
    await factoryCV.createCV(this.owner.address);
    let cvAddr = await factoryCV.getCV(this.owner.address);
    cv = await ethers.getContractAt("CV", cvAddr);

    const amount = ethers.utils.parseEther("0.2");
    await factoryMission.createMission(amount);
    let missionAddr = cv.getMission(1);
    const Mission = await ethers.getContractAt(CONTRACT_NAME, missionAddr);
    mission = Mission;

    // console.log(factoryCV);
  });

  describe("Initialization", () => {
    it("Should be ok", async () => {
      console.log(mission);
    });
  });
});
