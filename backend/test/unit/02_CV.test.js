const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { _testInitAll, getContractAt } = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

const CONTRACT_NAME = "CVsHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let contract;
  let apiPost;
  let apiPostPayable;

  let apiGet;
  let datasHub;
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

    contract = await contracts.cvs.hub;
    datasHub = await contracts.cvs.datas;
    apiPost = await contracts.systems.apiPost;
    apiPostPayable = await contracts.systems.apiPostPayable;

    apiGet = await contracts.systems.apiGet;
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization CV Hub", () => {
    it("Should have 0 token", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(0);
    });

    it("Should create a CV", async () => {
      await apiPost.createCV("tokenURI");
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
      expect(await apiGet.cvOf(this.owner.address)).to.be.equal(1);
      expect(await contract.ownerOf(1)).to.be.equal(this.owner.address);
      expect(await contract.tokenURI(1)).to.be.equal("tokenURI");
    });
  });

  describe("Create CV", () => {
    beforeEach(async () => {});

    describe("WORKS", () => {
      it("Should create a cv", async () => {
        expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(0);
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
      });

      it("Should have an arbitrator", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await ap, lkù, iGet.lengthOfCourt(2)).to.be.equal(1);
      });

      it("Should accept token", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.isAcceptToken(1)).to.be.equal(true);
      });
      it("Should return true id", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.cvOf(this.addr1.address)).to.be.equal(1);
      });

      it("Should return true tokenURI", async () => {
        await apiPost.connect(this.addr1).createCV("TOKENURI");
        expect(await contract.tokenURI(1)).to.be.equal("TOKENURI");
      });

      it("Should return true owner", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await contract.ownerOf(1)).to.be.equal(this.addr1.address);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT mint CV out of API post", async () => {
        await expect(
          contract.mint(this.owner.address, "tokenURI")
        ).to.be.revertedWith("Must call function with proxy bindings");
      });

      it("Should NOT mint CV twice", async () => {
        await apiPost.createCV("tokenURI");
        await expect(apiPost.createCV("tokenURI")).to.be.revertedWith(
          "CV already exist"
        );
      });
    });
  });
  describe("Accept token", () => {
    beforeEach(async () => {});

    describe("WORKS", () => {
      it("Should accept token by default", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.isAcceptToken(1)).to.be.equal(true);
      });

      it("Should can refuse token", async () => {
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.isAcceptToken(1)).to.be.equal(true);
        await apiPost.connect(this.addr1).changeAcceptToken();
        expect(await apiGet.isAcceptToken(1)).to.be.equal(false);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT change acceptToken with wrong bindings", async () => {
        await expect(contract.setAcceptToken(1)).to.be.revertedWith(
          "Must call function with proxy bindings"
        );
      });
      it("Should NOT change acceptToken if no cv", async () => {
        await expect(
          apiPost.connect(this.addr4).changeAcceptToken()
        ).to.be.revertedWith("CV not found");
      });
    });
  });
});
