const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const {
  _testInitFactoryCV,
  _testInitCV,
  _testInitFactoryMission,
  _testInitAccessControl,
  _testInitPubHub,
} = require("../../helpers/test_init");

const CONTRACT_NAME = "AccessControl";

describe.only(`Contract ${CONTRACT_NAME} `, () => {
  let accessControl;

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
    accessControl = await _testInitAccessControl();
  });

  // *:::::::: -------------- ::::::::* //
  // *:::::::: INITIALISATION ::::::::* //
  // *:::::::: -------------- ::::::::* //

  describe("Workflow : Initialization", () => {
    it("Should deploy to Initialization workflow", async () => {
      const workflow = await accessControl.workflow();
      expect(parseInt(workflow)).to.equal(0);
    });

    it("factoryCV deployment should set his address", async () => {
      let factoryCV = await _testInitFactoryCV(accessControl.target);
      const _fAddress = await accessControl.iFCV();
      expect(_fAddress).to.equal(factoryCV.target);
    });

    it("factoryMission deployment should set his address", async () => {
      let factoryCV = await _testInitFactoryCV(accessControl.target);
      let factoryMission = await _testInitFactoryMission(
        factoryCV.target,
        accessControl.target
      );
      const _fMAddress = await accessControl.iFMI();
      expect(_fMAddress).to.equal(factoryMission.target);
    });

    it("pubHub deployment should set his address", async () => {
      let pubHub = await _testInitPubHub(accessControl.target);
      const pubHubAddr = await accessControl.iPH();
      expect(pubHubAddr).to.equal(pubHub.target);
    });

    it("Should not use onlyInit function", async () => {
      await expect(
        accessControl.getCVByAddress(this.addr1.address)
      ).to.be.revertedWith("Init is not ready");
    });

    it("Should can use onlyInit function", async () => {
      let factoryCV = await _testInitFactoryCV(accessControl.target);
      await _testInitFactoryMission(factoryCV.target, accessControl.target);
      await _testInitPubHub(accessControl.target);
      expect(parseInt(await accessControl.workflow())).to.equal(1);
    });
  });

  // *::::::::::::: ---- :::::::::::::* //
  // *::::::::::::: INIT :::::::::::::* //
  // *::::::::::::: ---- :::::::::::::* //

  describe("Workflow : Init", () => {
    let factoryMission;
    let factoryCV;
    let pubHub;

    beforeEach(async () => {
      factoryCV = await _testInitFactoryCV(accessControl.target);
      factoryMission = await _testInitFactoryMission(
        factoryCV.target,
        accessControl.target
      );
      pubHub = await _testInitPubHub(accessControl.target);
    });

    it("Should deploy to Init workflow", async () => {
      expect(parseInt(await accessControl.workflow())).to.equal(1);
    });

    it("Should not get CV", async () => {
      await expect(
        accessControl.getCVByAddress(this.addr1.address)
      ).to.be.revertedWith("CV not found");
    });

    it("Should not get CV without proxy", async () => {
      await expect(
        factoryCV.getCVByAddress(this.addr2.address)
      ).to.be.revertedWith("Must call function with proxy bindings");
    });
  });
});
