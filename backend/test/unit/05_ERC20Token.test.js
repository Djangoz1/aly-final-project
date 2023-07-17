const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { createURIPost, createURIFeature } = require("../../utils/pinata");

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
  _testInitLaunchpadHub,
  _testInitLaunchpad,
  _testInitToken,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "ERC20Token";

describe(`Contract ${CONTRACT_NAME} `, () => {
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

  describe("ERC20 : Initialization", () => {
    it("Should deploy ERC20Token contract", async () => {
      const token = await ethers.deployContract("ERC20Token", [
        "Django",
        "DJN",
        1000000,
      ]);
      expect(await token.name()).to.equal("Django");
      expect(await token.totalSupply()).to.equal(1000000);
      expect(await token.symbol()).to.equal("DJN");
      expect(await token.balanceOf(this.owner.address)).to.equal(1000000);
    });
  });
});
