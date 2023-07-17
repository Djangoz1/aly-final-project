const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitFactoryCV,
  _testInitCV,
  _testInitMission,
  _testInitMissionsHub,
  _testInitAccessControl,
  _testInitFeature,
  _testInitFeaturesHub,
  _testInitWorkerProposalHub,
  _testInitWorkerProposal,
  _testInitPubHub,
  _testInitPub,
  _testInitLaunchpad,
  _testInitLaunchpadContracts,
  _testInitToken,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "Launchpad";

describe.only(`Contract ${CONTRACT_NAME} `, () => {
  let accessControl;
  let lHub;
  let lInvestors;
  let lCohort;
  let lDatas;

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
    await _testInitFactoryCV(accessControl.target);
    await _testInitMissionsHub(accessControl.target);
    await _testInitPubHub(accessControl.target);
    await _testInitFeaturesHub(accessControl.target);
    await _testInitWorkerProposalHub(accessControl.target);
    const contracts = await _testInitLaunchpadContracts(
      accessControl.target,
      this.owner.address
    );
    await _testInitCV(accessControl.target, this.owner, 0.5);
    lHub = contracts.hub;
    lInvestors = contracts.investors;
    lCohort = contracts.cohort;
    lDatas = contracts.datas;
  });

  describe("Init : Launchpad", () => {
    it("Should create launchpad", async () => {
      const launchpad = await _testInitLaunchpad(
        accessControl.target,
        this.owner
      );
      
    });
    it("Should init launchpad ", async () => {
      let token = await _testInitToken(this.owner, "Django", "DJN", 10000000);
      datas = LAUNCHPAD_DATAS_EXEMPLE
      
      const launchpad = await _testInitLaunchpad(
        accessControl.target,
        this.owner,
        token,
        datas
      );

      await   token.approve(launchpad.target, 20000);
        console.log(await token.allowance(this.owner.address, launchpad.target))
        await launchpad.lockTokens(20000)

        // await launchpad.buyTokens({value: ethers.parseEther("2")})
    });
  });
});
