const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testInitAll } = require("../../helpers/test_init");
const { transactionCost } = require("../../helpers/test_utils");

const CONTRACT_NAME = "Token";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressSystem;
  let contract;
  let balancesHub;
  let cvsHub;
  let datasHub;
  let apiPost;
  let apiPostPayable;
  let apiGet;

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
    let contracts = await _testInitAll();
    addressSystem = contracts.systems.addressSystem;

    apiPost = contracts.systems.apiPost;
    apiPostPayable = contracts.systems.apiPostPayable;
    apiGet = contracts.systems.apiGet;
    cvsHub = contracts.cvs.hub;
    contract = contracts.pubs.hub;
    datasHub = contracts.pubs.datas;
    balancesHub = contracts.systems.balancesHub;

    token = contracts.token;
    uni = contracts.fork.uni;
    // return;
    await apiPost.createCV("_tokenURI");
  });

  describe.only("Init : Token", () => {
    it("should deploy properly", async () => {
      expect(contract.target).to.be.equal(await addressSystem.pubsHub());
    });

    it("should have no pub", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(0);
    });
    it("should create pub", async () => {
      const length = await apiGet.tokensLengthOf(contract.target);
      await apiPost.createPub("tokenURI");
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(
        parseInt(length) + 1
      );
    });

    describe("NOT WORKS", () => {
      it("should NOT create pub without controller bindings", async () => {
        await expect(
          contract.mint(this.addr1.address, "tokenURI")
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
    });
  });
});
