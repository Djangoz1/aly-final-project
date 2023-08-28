const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitCVHub,
  _testInitCV,
  _testInitMission,
  _testInitMissionsHub,
  _testInitArbitratorsHub,
  _testInitAccessControl,
  _testInitFeature,
  _testInitFeaturesHub,
  _testInitWorkerProposalHub,
  _testInitWorkerProposal,
  _testInitPubHub,
  _testInitPub,
  _testInitLaunchpad,
  _testInitLaunchpadContracts,
  _testInitAddressHub,
  _testInitAll,
  _testInitDisputesHub,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  ZERO_ADDRESS,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "AddressHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let contract;

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
    contract = await _testInitAddressHub();
  });

  // *:::::::: -------------- ::::::::* //
  // *:::::::: INITIALISATION ::::::::* //
  // *:::::::: -------------- ::::::::* //

  describe("Workflow : Initialization", () => {
    it("Should have good owner", async () => {
      expect(await contract.owner()).to.equal(this.owner.address);
    });
    it("Should have 0 address for each contracts", async () => {
      expect(await contract.accessControl()).to.equal(ZERO_ADDRESS);
      expect(await contract.missionsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.cvHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.pubsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.featuresHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.workerProposalHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.launchpadCohort()).to.equal(ZERO_ADDRESS);
    });

    it("Should deploy accessControl", async () => {
      const accessControl = await _testInitAccessControl(contract.target);
      expect(await contract.accessControl()).to.equal(accessControl.target);
    });

    it("Should deploy missionsHub", async () => {
      const missionsHub = await _testInitMissionsHub(contract.target);
      expect(await contract.missionsHub()).to.equal(missionsHub.target);
    });

    it("Should deploy cvHub", async () => {
      const cvHub = await _testInitCVHub(contract.target);
      expect(await contract.cvHub()).to.equal(cvHub.target);
    });

    it("Should deploy pubsHub", async () => {
      const pubsHub = await _testInitPubHub(contract.target);
      expect(await contract.pubsHub()).to.equal(pubsHub.target);
    });

    it("Should deploy featuresHub", async () => {
      const featuresHub = await _testInitFeaturesHub(contract.target);
      expect(await contract.featuresHub()).to.equal(featuresHub.target);
    });

    it("Should deploy workerProposalHub", async () => {
      const workerProposalHub = await _testInitWorkerProposalHub(
        contract.target
      );
      expect(await contract.workerProposalHub()).to.equal(
        workerProposalHub.target
      );
    });

    it("Should deploy launchpad contracts", async () => {
      const launchpadContracts = await _testInitLaunchpadContracts(
        contract.target
      );
      expect(await contract.launchpadCohort()).to.equal(
        launchpadContracts.cohort.target
      );
    });
    it("Should deploy disputesHub contracts", async () => {
      const disputesHub = await _testInitDisputesHub(contract.target);

      expect(await contract.disputesHub()).to.equal(disputesHub.target);
    });
    it("Should deploy arbitratorsHub ", async () => {
      const arbitratorsHub = await _testInitArbitratorsHub(contract.target);

      expect(await contract.arbitratorsHub()).to.equal(arbitratorsHub.target);
    });

    it("Should init workflow", async () => {
      const accessControl = await _testInitAccessControl(contract.target);

      expect(await accessControl.workflow()).to.equal(0);
      await _testInitMissionsHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitCVHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitPubHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitFeaturesHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitWorkerProposalHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitLaunchpadContracts(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitDisputesHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitArbitratorsHub(contract.target);

      expect(await accessControl.workflow()).to.equal(1);
    });

    // ! TO DO
    // ! Launchpad cohort to do

    describe("NOT WORKS", () => {});
  });
});
