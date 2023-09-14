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
  _testInitFactory,
  _testInitCollectWorkInteraction,
  _testInitEscrowDatasHub,
  _testInitApiPost,
  _testInitCollectPubs,
  _testInitCollectFollowCV,
} = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

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
      expect(await contract.factory()).to.equal(ZERO_ADDRESS);
      expect(await contract.escrowDatasHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.pubsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.featuresHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.workerProposalHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.launchpadCohort()).to.equal(ZERO_ADDRESS);
    });

    it("Should deploy accessControl", async () => {
      const accessControl = await _testInitAccessControl(contract.target);
      expect(await contract.accessControl()).to.equal(accessControl.target);
    });

    it("Should deploy collectFollowCV", async () => {
      await _testInitCVHub(contract.target);
      const collectFollowCV = await _testInitCollectFollowCV(contract.target);
      expect(await contract.collectFollowCV()).to.equal(collectFollowCV.target);
    });

    it("Should deploy apiPost", async () => {
      const apiPost = await _testInitApiPost(contract.target);
      expect(await contract.apiPost()).to.equal(apiPost.target);
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

    it("Should deploy factory ", async () => {
      const factory = await _testInitFactory(contract.target);
      expect(await contract.factory()).to.equal(factory.target);
    });

    it("Should deploy collectPubs ", async () => {
      const collectPubs = await _testInitCollectPubs(contract.target);
      // expect(await contract.collectPubs()).to.equal(collectPubs.target);
    });

    it("Should deploy arbitratorsHub ", async () => {
      const arbitratorsHub = await _testInitArbitratorsHub(contract.target);
      expect(await contract.arbitratorsHub()).to.equal(arbitratorsHub.target);
    });

    it("Should deploy escrow datas hub ", async () => {
      const escrowDatasHub = await _testInitEscrowDatasHub(contract.target);
      expect(await contract.escrowDatasHub()).to.equal(escrowDatasHub.target);
    });

    it("Should deploy collect work interaction ", async () => {
      const collectWorkInteraction = await _testInitCollectWorkInteraction(
        contract.target
      );
      expect(await contract.collectWorkInteraction()).to.equal(
        collectWorkInteraction.target
      );
    });

    it("Should init workflow", async () => {
      const accessControl = await _testInitAccessControl(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitMissionsHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitFactory(contract.target);
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
      await _testInitCollectWorkInteraction(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitCollectFollowCV(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitEscrowDatasHub(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitCollectPubs(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitApiPost(contract.target);
      expect(await accessControl.workflow()).to.equal(0);
      await _testInitArbitratorsHub(contract.target);
      expect(await accessControl.workflow()).to.equal(1);
    });

    // ! TO DO
    // ! Launchpad cohort to do

    describe("NOT WORKS", () => {
      it("Should NOT set accessControl twice", async () => {
        await _testInitAccessControl(contract.target);
        await expect(contract.setAccessControl()).to.revertedWith(
          "AccessControl already init"
        );
      });

      it("Should NOT set apiPost twice", async () => {
        await _testInitApiPost(contract.target);
        await expect(contract.setApiPost()).to.revertedWith(
          "APIPost already init"
        );
      });

      it("Should NOT set missionsHub twice", async () => {
        await _testInitMissionsHub(contract.target);
        await expect(contract.setMissionsHub()).to.revertedWith(
          "MissionsHub already init"
        );
      });

      it("Should NOT set cvHub twice", async () => {
        await _testInitCVHub(contract.target);
        await expect(contract.setCVHub()).to.revertedWith("CVHub already init");
      });

      it("Should NOT set pubsHub twice", async () => {
        await _testInitPubHub(contract.target);
        await expect(contract.setPubHub()).to.revertedWith(
          "PubsHub already init"
        );
      });

      it("Should NOT set featuresHub twice", async () => {
        await _testInitFeaturesHub(contract.target);
        await expect(contract.setFeaturesHub()).to.revertedWith(
          "FeaturesHub already init"
        );
      });

      it("Should NOT set workerProposalHub twice", async () => {
        await _testInitWorkerProposalHub(contract.target);
        await expect(contract.setWorkerProposalHub()).to.revertedWith(
          "WorkerProposalHub already init"
        );
      });

      it("Should NOT set launchpadCohort twice", async () => {
        await _testInitLaunchpadContracts(contract.target);
        await expect(contract.setLaunchpadCohort()).to.revertedWith(
          "LaunchpadCohort already init"
        );
      });

      it("Should NOT set disputesHub twice", async () => {
        await _testInitDisputesHub(contract.target);
        await expect(contract.setDisputesHub()).to.revertedWith(
          "DisputesHub already init"
        );
      });

      it("Should NOT set collectPubs twice", async () => {
        await _testInitCollectPubs(contract.target);
        await expect(contract.setCollectPubs()).to.revertedWith(
          "CollectPubs already init"
        );
      });

      it("Should NOT set factory twice ", async () => {
        await _testInitFactory(contract.target);
        await expect(contract.setFactory()).to.revertedWith(
          "Factory already init"
        );
      });

      it("Should NOT set arbitratorsHub twice ", async () => {
        await _testInitArbitratorsHub(contract.target);
        await expect(contract.setArbitratorsHub()).to.revertedWith(
          "ArbitratorsHub already init"
        );
      });

      it("Should NOT set escrow datas hub twice ", async () => {
        await _testInitEscrowDatasHub(contract.target);
        await expect(contract.setEscrowDatasHub()).to.revertedWith(
          "EscrowDatasHub already init"
        );
      });

      it("Should NOT set collectWorkInteraction twice ", async () => {
        await _testInitCollectWorkInteraction(contract.target);
        await expect(contract.setCollectWorkInteraction()).to.revertedWith(
          "CollectWorkInteraction already init"
        );
      });
    });
  });
});
