const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitAll,
  _testInitArbitrator,
} = require("../../helpers/test_init");

const CONTRACT_NAME = "ArbitratorsHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let contract;
  let apiPost;
  let apiPostPayable;
  let apiGet;

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

    apiPost = contracts.systems.apiPost;
    apiPostPayable = contracts.systems.apiPostPayable;
    apiGet = contracts.systems.apiGet;
    contract = contracts.escrows.arbitratorsHub;

    // return;
    await apiPost.createCV("_tokenURI");
    await apiPost.connect(this.addr1).createCV("_tokenURI");
    await apiPost.connect(this.addr2).createCV("_tokenURI");
  });

  describe("Initialization", () => {
    describe("Works", () => {
      it("ArbitratorsHub : should have 0 tokens length", async () => {
        expect(await apiGet.tokensLengthOf(contract.target)).to.equal(0);
      });
    });
    describe("NOT WORKS", () => {});
  });

  describe("Get Arbitrator Data", () => {
    beforeEach(async () => {
      await _testInitArbitrator(contracts, 3, this.addr1);
    });
    describe("WORKS", () => {
      it("dataOf : should return tokens Length", async () => {
        let length = await apiGet.tokensLengthOf(contract.target);
        expect(length).to.equal(1);
      });
      it("dataOf : should return arbitrator ID", async () => {
        let data = await apiGet.datasOfArbitrator(1);
        expect(data.id).to.equal(1);
      });

      it("dataOf : should return cvID", async () => {
        let cvID = await apiGet.cvOf(this.addr1.address);
        let data = await apiGet.datasOfArbitrator(1);
        expect(data.cvID).to.equal(cvID);
      });
      it("dataOf : should return court ID", async () => {
        let data = await apiGet.datasOfArbitrator(1);
        expect(data.courtID).to.equal(3);
      });
      it("dataOf : should return indexedAtCourt & courtLength", async () => {
        let data = await apiGet.datasOfArbitrator(1);
        let length = await apiGet.lengthOfCourt(data.courtID);
        expect(data.indexedAtCourt).to.equal(parseInt(length) - 1);
      });
      it("dataOf : should return > balance for MOOC", async () => {
        let data = await apiGet.datasOfArbitrator(1);
        expect(data.balance > 0).to.equal(true);
      });
      it("dataOf : should return 0 nbArbitrations", async () => {
        let data = await apiGet.datasOfArbitrator(1);

        expect(data.nbArbitrations).to.equal(0);
      });
      it("dataOf : should return id from indexersCV", async () => {
        let data = await apiGet.datasOfArbitrator(1);
        let _id = await apiGet.arbitrationOfCV(data.cvID, data.courtID);
        expect(data.id).to.equal(_id);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT return data for unexisting ID", async () => {
        await expect(apiGet.datasOfArbitrator(2)).to.be.revertedWith(
          "Invalid arbitrator ID"
        );
      });
    });
  });

  describe("Set Arbitrator", () => {
    describe("WORKS", () => {
      it("validateMission : should set arbitrator after validate mission from sender", async () => {
        await _testInitArbitrator(contracts, 3, this.addr1);
        expect(await apiGet.tokensLengthOf(contract.target)).to.equal(1);
      });
      it("validateMission : should used twice for different court ID", async () => {
        await _testInitArbitrator(contracts, 3, this.addr1);
        await _testInitArbitrator(contracts, 4, this.addr1);
        expect(await apiGet.tokensLengthOf(contract.target)).to.equal(2);
      });
    });
    describe("NOT WORKS", () => {
      it("should NOT works without proxy bindings", async () => {
        await expect(contract.setArbitrator(1, 1)).to.be.revertedWith(
          "Must call by proxy bindings"
        );
      });

      it("should NOT used twice for same court ID", async () => {
        await _testInitArbitrator(contracts, 3, this.addr1);
        await expect(
          _testInitArbitrator(contracts, 3, this.addr1)
        ).to.be.revertedWith("Arbitrator already added");
      });
      it("should NOT used twice for unvalid court ID", async () => {
        await expect(
          _testInitArbitrator(contracts, 1, this.addr1)
        ).to.be.revertedWith("Unvalid specification");
      });
    });
  });
});
