const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const {
  getContractFactoryCV,
  getContractCV,
} = require("../../helpers/cv.helpers");
const {
  getContractFactoryMission,
  getContractMission,
  setFeature,
} = require("../../helpers/factoryMission.helpers");

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

    factoryCV = await getContractFactoryCV();
    cv = await getContractCV({ factoryCV, owner: this.owner.address });

    factoryMission = await getContractFactoryMission({ factoryCV });

    mission = await getContractMission({ cv, factoryMission });
  });

  describe("Initialization", () => {
    it("Ownership should owned by cv", async () => {
      expect(await mission.owner()).to.equal(cv.address);
    });

    it("Should set a mission with worker", async () => {
      const tx = await mission.setFeature(
        30,
        2000,
        "Fais quelque chose",
        this.addr2.address,
        true
      );
      tx.wait();

      let length = await mission.getFeaturesLength();
      expect(length.toString()).to.equal("1");
    });

    it("Should set a mission without worker", async () => {
      const addressZero = ethers.constants.AddressZero;
      await setFeature(mission, addressZero);

      let length = await mission.getFeaturesLength();
      expect(length.toString()).to.equal("1");
    });

    it("Should NOT set a mission without worker", async () => {
      const addressZero = ethers.constants.AddressZero;
      await expect(
        mission.setFeature(30, 2000, "Fais quelque chose", addressZero, true)
      ).to.be.revertedWith("You must assign a worker");

      let length = await mission.getFeaturesLength();
      expect(length).to.equal(0);
    });

    it("Should get a mission", async () => {
      const tx = await mission.setFeature(
        30,
        2000,
        "Fais quelque chose",
        this.addr2.address,
        true
      );
      tx.wait();
      const feature = await mission.getFeature(0);
      expect(feature.description).to.equal("Fais quelque chose");
    });
  });
});
