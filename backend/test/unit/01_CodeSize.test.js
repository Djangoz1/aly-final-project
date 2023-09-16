const { ethers } = require("hardhat");

const { codeSize, _testInitAll } = require("../../helpers/test_init");

describe.only(`TEST CODE SIZE`, () => {
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

  it("AccessControl size", async () => {
    let contract = contracts.systems.accessControl;
    await codeSize(contract.target);
  });
  it("APIPost size", async () => {
    let contract = contracts.systems.apiPost;
    await codeSize(contract.target);
  });
  it("APIGet size", async () => {
    let contract = contracts.systems.apiGet;
    await codeSize(contract.target);
  });
  it("Factory size", async () => {
    let contract = contracts.systems.factory;
    await codeSize(contract.target);
  });
  it("BalancesHub size", async () => {
    let contract = contracts.systems.balancesHub;
    await codeSize(contract.target);
  });
  it("AddressSystem size", async () => {
    let contract = contracts.systems.addressSystem;
    await codeSize(contract.target);
  });
  it("MissionsHub size", async () => {
    let contract = contracts.works.missionsHub;
    await codeSize(contract.target);
  });
  it("WorkProposalHub size", async () => {
    let contract = contracts.works.workProposalHub;
    await codeSize(contract.target);
  });
  it("FeaturesHub size", async () => {
    let contract = contracts.works.featuresHub;
    await codeSize(contract.target);
  });
  it("CollectWorkInteraction size", async () => {
    let contract = contracts.works.collectWorkInteraction;
    await codeSize(contract.target);
  });
  it("CVsHub size", async () => {
    let contract = contracts.cvs.hub;
    await codeSize(contract.target);
  });
  it("CVsDatasHub size", async () => {
    let contract = contracts.cvs.datas;
    await codeSize(contract.target);
  });
  it("DisputesDatasHub size", async () => {
    let contract = contracts.escrows.datas;
    await codeSize(contract.target);
  });
  it("DisputesHub size", async () => {
    let contract = contracts.escrows.disputesHub;
    await codeSize(contract.target);
  });
  it("ArbitratorsHub size", async () => {
    let contract = contracts.escrows.arbitratorsHub;
    await codeSize(contract.target);
  });
  it("PubsHub size", async () => {
    let contract = contracts.pubs.hub;
    await codeSize(contract.target);
  });
  it("PubsDatasHub size", async () => {
    let contract = contracts.pubs.datas;
    await codeSize(contract.target);
  });
});
