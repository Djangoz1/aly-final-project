const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const {
  getContractFactoryCV,
  getContractCV,
} = require("../../helpers/cv.helpers");
const { getContractMission } = require("../../helpers/factoryMission.helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const {
  _testInitFactoryMission,
  _testInitFeature,
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

    factoryCV = await getContractFactoryCV();
    cv = await getContractCV({ factoryCV, owner: this.owner.address });

    factoryMission = await _testInitFactoryMission(factoryCV.address);
    mission = await getContractMission({ cv, factoryMission });
  });

  describe("Initialization", () => {
    it("Ownership should owned by cv", async () => {
      expect(await mission.owner()).to.equal(cv.address);
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
    it("Should be a worker", async () => {
      const _length = await cv.getFeaturesLength();
      const _id = await _testInitFeature({ mission });
      await cv.beAssignedWorker(mission.address, _id);
      const _newLength = await cv.getFeaturesLength();
      expect(_length).to.be.equal(_newLength - 1);
    });
  });
});
