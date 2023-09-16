const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitLaunchpadsContracts,
  _testInitaddressSystem,
  _testInitAll,
  _testInitSystemsContracts,
  _testInitCVsContracts,
  _testInitWorksContracts,
  _testInitPubsContracts,
  _testInitEscrowsContracts,
  codeSize,
} = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

const CONTRACT_NAME = "addressSystem";

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
    contract = await _testInitaddressSystem();
  });

  // *:::::::: -------------- ::::::::* //
  // *:::::::: INITIALISATION ::::::::* //
  // *:::::::: -------------- ::::::::* //

  describe("Workflow : Initialization", () => {
    it("Should have good owner", async () => {
      expect(await contract.owner()).to.equal(this.owner.address);
    });

    it("Should have 0 address for each contracts", async () => {
      expect(await contract.apiPost()).to.equal(ZERO_ADDRESS);
      expect(await contract.accessControl()).to.equal(ZERO_ADDRESS);
      expect(await contract.missionsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.factory()).to.equal(ZERO_ADDRESS);
      expect(await contract.balancesHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.featuresHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.collectWorkInteraction()).to.equal(ZERO_ADDRESS);
      expect(await contract.disputesHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.arbitratorsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.workProposalHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.disputesDatasHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.cvsDatasHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.cvsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.pubsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.pubsDatasHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.launchpadsDatasHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.launchpadsInvestorsHub()).to.equal(ZERO_ADDRESS);
      expect(await contract.launchpadsHub()).to.equal(ZERO_ADDRESS);
    });

    describe("CV Contracts", () => {
      it("Should deploy CVsDatasHub", async () => {
        let contracts = await _testInitCVsContracts(contract.target);
        const cvsDatasHub = contracts.datas;
        expect(await contract.cvsDatasHub()).to.equal(cvsDatasHub.target);
      });
      it("Should deploy CVsHub", async () => {
        let contracts = await _testInitCVsContracts(contract.target);
        const cvsHub = contracts.hub;
        expect(await contract.cvsHub()).to.equal(cvsHub.target);
      });
    });
    describe("System Contracts", () => {
      it("Should deploy accessControl", async () => {
        const accessControl = await ethers.deployContract("AccessControl", [
          contract.target,
        ]);
        await accessControl.waitForDeployment();
        expect(await contract.accessControl()).to.equal(accessControl.target);
      });

      it("Should deploy apiPost", async () => {
        await _testInitPubsContracts(contract.target);
        await _testInitWorksContracts(contract.target);
        await _testInitCVsContracts(contract.target);
        await _testInitLaunchpadsContracts(contract.target);
        let contracts = await _testInitSystemsContracts(contract.target);

        const apiPost = contracts.apiPost;
        expect(await contract.apiPost()).to.equal(apiPost.target);
      });

      it("Should deploy apiGet ", async () => {
        const apiGet = await ethers.deployContract("APIGet", [contract.target]);
        await apiGet.waitForDeployment();
        expect(await contract.apiGet()).to.equal(apiGet.target);
      });
      it("Should deploy factory ", async () => {
        const factory = await ethers.deployContract("Factory", [
          contract.target,
        ]);
        await factory.waitForDeployment();
        expect(await contract.factory()).to.equal(factory.target);
      });
    });

    describe("Launchpads Contracts", () => {
      it("Should deploy launchpadHub", async () => {
        let contracts = await _testInitLaunchpadsContracts(contract.target);
        const launchpadHub = contracts.launchpadsHub;
        expect(await contract.launchpadsHub()).to.be.equal(launchpadHub.target);
      });

      it("Should deploy LaunchpadsDatasHub", async () => {
        let contracts = await _testInitLaunchpadsContracts(contract.target);
        const launchpadData = contracts.datas;
        expect(await contract.launchpadsDatasHub()).to.be.equal(
          launchpadData.target
        );
      });

      it("Should deploy LaunchpadsInvestorsHub", async () => {
        let contracts = await _testInitLaunchpadsContracts(contract.target);
        const launchpadInvestor = contracts.investors;
        expect(await contract.launchpadsInvestorsHub()).to.be.equal(
          launchpadInvestor.target
        );
      });
    });

    describe("Pubs Contracts", () => {
      it("Should deploy pubsHub", async () => {
        const contracts = await _testInitPubsContracts(contract.target);
        const pubsHub = contracts.hub;
        expect(await contract.pubsHub()).to.equal(pubsHub.target);
      });
      it("Should deploy pubsDatasHub", async () => {
        const contracts = await _testInitPubsContracts(contract.target);
        const pubsDatasHub = contracts.datas;
        expect(await contract.pubsDatasHub()).to.equal(pubsDatasHub.target);
      });
    });

    describe("Escrow Contracts", () => {
      it("Should deploy disputesHub contracts", async () => {
        let escrows = await _testInitEscrowsContracts(contract.target);
        const disputesHub = escrows.disputesHub;
        expect(await contract.disputesHub()).to.equal(disputesHub.target);
      });

      it("Should deploy arbitratorsHub ", async () => {
        let escrows = await _testInitEscrowsContracts(contract.target);
        const arbitratorsHub = contracts.escrows.arbitratorsHub;
        expect(await contract.arbitratorsHub()).to.equal(arbitratorsHub.target);
      });

      it("Should deploy escrow datas hub ", async () => {
        let escrows = await _testInitEscrowsContracts(contract.target);
        const datas = escrows.datas;
        expect(await contract.disputesDatasHub()).to.equal(datas.target);
      });
    });

    describe("Works Contracts", () => {
      it("Should deploy missionsHub", async () => {
        let works = await _testInitWorksContracts(contract.target);
        const missionsHub = works.missionsHub;
        expect(await contract.missionsHub()).to.equal(missionsHub.target);
      });

      it("Should deploy featuresHub", async () => {
        const works = await _testInitWorksContracts(contract.target);
        const featuresHub = works.featuresHub;
        expect(await contract.featuresHub()).to.equal(featuresHub.target);
      });

      it("Should deploy workProposalHub", async () => {
        const works = await _testInitWorksContracts(contract.target);
        const workProposalHub = works.workProposalHub;
        expect(await contract.workProposalHub()).to.equal(
          workProposalHub.target
        );
      });

      it("Should deploy collect work interaction ", async () => {
        let works = await _testInitWorksContracts(contract.target);
        const collectWorkInteraction = works.collectWorkInteraction;
        expect(await contract.collectWorkInteraction()).to.equal(
          collectWorkInteraction.target
        );
      });
    });

    it("FUNCTION TEST : _testInitAll() init workflow", async () => {
      await _testInitAll();
    });

    describe("NOT WORKS", () => {
      it("Should NOT set cvContracts twice", async () => {
        await _testInitCVsContracts(contract.target);
        await expect(contract.setCVsHub()).to.revertedWith(
          "CVsHub already init"
        );
        await expect(contract.setCVsDatasHub()).to.revertedWith(
          "CVsDatasHub already init"
        );
      });

      it("Should NOT set workscontracts twice", async () => {
        await _testInitWorksContracts(contract.target);
        await expect(contract.setFeaturesHub()).to.revertedWith(
          "FeaturesHub already init"
        );
        await expect(contract.setWorkProposalHub()).to.revertedWith(
          "workProposalHub already init"
        );
        await expect(contract.setCollectWorkInteraction()).to.revertedWith(
          "CollectWorkInteraction already init"
        );
        await expect(contract.setMissionsHub()).to.revertedWith(
          "MissionsHub already init"
        );
      });

      it("Should NOT set launchpadContracts twice", async () => {
        await _testInitLaunchpadsContracts(contract.target);
        await expect(contract.setLaunchpadsHub()).to.revertedWith(
          "LaunchpadsHub already init"
        );
        await expect(contract.setLaunchpadsDatasHub()).to.revertedWith(
          "LaunchpadsDatasHub already init"
        );
        await expect(contract.setLaunchpadsInvestorsHub()).to.revertedWith(
          "LaunchpadsInvestorsHub already init"
        );
      });

      it("Should NOT set escrowContracts twice", async () => {
        await _testInitEscrowsContracts(contract.target);
        await expect(contract.setDisputesHub()).to.revertedWith(
          "DisputesHub already init"
        );
        await expect(contract.setArbitratorsHub()).to.revertedWith(
          "ArbitratorsHub already init"
        );
        await expect(contract.setDisputesDatasHub()).to.revertedWith(
          "DisputesDatasHub already init"
        );
      });

      it("Should NOT set pubsContracts twice", async () => {
        await _testInitPubsContracts(contract.target);
        await expect(contract.setPubHub()).to.revertedWith(
          "PubsHub already init"
        );
        await expect(contract.setPubsDatasHub()).to.revertedWith(
          "pubsDatasHub already init"
        );
      });

      it("Should NOT set systemContracts twice ", async () => {
        await _testInitPubsContracts(contract.target);
        await _testInitWorksContracts(contract.target);
        await _testInitCVsContracts(contract.target);
        await _testInitLaunchpadsContracts(contract.target);
        await _testInitSystemsContracts(contract.target);
        await expect(contract.setFactory()).to.revertedWith(
          "Factory already init"
        );
        await expect(contract.setBalancesHub()).to.revertedWith(
          "BalancesHub already init"
        );
        await expect(contract.setAccessControl()).to.revertedWith(
          "AccessControl already init"
        );
        await expect(contract.setApiPost()).to.revertedWith(
          "APIPost already init"
        );
      });
    });
  });
});
