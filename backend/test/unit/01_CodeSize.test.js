const { ethers } = require("hardhat");

const { codeSize, _testInitAll } = require("../../helpers/test_init");

describe(`TEST CODE SIZE`, () => {
  let contracts;

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
    contracts = await _testInitAll();
  });

  describe("System contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.systems.accessControl.target);
      await codeSize(contracts.systems.apiPost.target);
      await codeSize(contracts.systems.apiPostPayable.target);
      await codeSize(contracts.systems.apiGet.target);
      await codeSize(contracts.systems.factory.target);
      await codeSize(contracts.systems.balancesHub.target);
      await codeSize(contracts.systems.addressSystem.target);
    });

    it(`AccessControl | APIPost | APIPostPayable | APIGet | Factory | BalancesHub | AddressSystem`, () => {});
  });
  describe("Works contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.works.missionsHub.target);
      await codeSize(contracts.works.featuresHub.target);
      await codeSize(contracts.works.workProposalHub.target);
      await codeSize(contracts.works.collectWorkInteraction.target);
    });

    it(`MissionsHub | FeaturesHub | WorkProposal | CollectWorkInteraction`, () => {});
  });
  describe("CV contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.cvs.hub.target);
      await codeSize(contracts.cvs.datas.target);
    });

    it(`CVsHub | CVsDatasHub`, () => {});
  });
  describe("Escrow contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.escrows.datas.target);
      await codeSize(contracts.escrows.disputesHub.target);
      await codeSize(contracts.escrows.arbitratorsHub.target);
    });
    it(`DisputesDatasHub | DisputesHub | ArbitratorsHub`, () => {});
  });
  describe("Launchpad contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.launchpads.datas.target);
      await codeSize(contracts.launchpads.investors.target);
      await codeSize(contracts.launchpads.hub.target);
    });
    it(`LaunchpadDatasHub | LaunchpadInvestorsHub | LaunchpadHub`, () => {});
  });
  describe("Pubs contracts", () => {
    afterEach(async () => {
      await codeSize(contracts.pubs.datas.target);
      await codeSize(contracts.pubs.hub.target);
    });
    it(`PubsDatasHub | PubsHub`, () => {});
  });
});
