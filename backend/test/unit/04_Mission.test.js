const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  getContractFactoryCV,
  getContractCV,
} = require("../../helpers/cv.helpers");
const { getContractMission } = require("../../helpers/factoryMission.helpers");

const {
  _testInitFactoryMission,
  _testInitFeature,
  _testInitFactoryCV,
  _testInitCV,
  _testInitMission,
} = require("../../helpers/test_init");

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

    factoryCV = await _testInitFactoryCV();
    cv = await _testInitCV({ factoryCV, owner: this.owner.address });
    factoryMission = await _testInitFactoryMission(factoryCV.target);
    mission = await _testInitMission({ cv, factoryMission });
  });

  describe("Initialization", () => {
    it("Ownership should owned by cv", async () => {
      expect(await mission.owner()).to.equal(cv.target);
    });

    it("Should set a mission with worker", async () => {
      await _testInitFeature({
        mission,
        values: { workerAddr: this.addr2.address, isInvite: true },
      });
    });

    it("Should set a mission without worker", async () => {
      await _testInitFeature({ mission });
    });

    it("Should NOT set a mission without worker", async () => {
      await expect(
        _testInitFeature({
          mission,
          values: { isInvite: true },
        })
      ).to.be.revertedWith("You must assign a worker");
    });

    it("Should get a feature", async () => {
      await _testInitFeature({
        mission,
        values: { description: "its ok" },
      });

      const feature = await mission.getFeature(0);
      expect(feature.description).to.equal("its ok");
    });
    it("Worker should join feature", async () => {
      const _length = parseInt(await cv.getFeaturesLength());
      await _testInitFeature({ mission });
      await cv.beAssignedWorker(mission.target, _length);
      const _newLength = parseInt(await cv.getFeaturesLength());
      expect(_length).to.be.equal(_newLength - 1);
    });
  });
});
