const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitAll,
  _testInitArbitrator,
} = require("../../helpers/test_init");

const CONTRACT_NAME = "ArbitratorsHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressHub;
  let contract;
  let apiPost;
  let CVsHub;

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
    addressHub = contracts.addressHub;
    apiPost = contracts.apiPost;
    CVsHub = contracts.CVsHub;
    contract = contracts.arbitratorsHub;

    // return;
    await apiPost.createCV("_tokenURI");
    await apiPost.connect(this.addr1).createCV("_tokenURI");
    await apiPost.connect(this.addr2).createCV("_tokenURI");
  });

  describe("Initialization", () => {
    describe("Works", () => {
      it("ArbitratorsHub : should have true address", async () => {
        expect(await addressHub.arbitratorsHub()).to.equal(contract.target);
      });
      it("ArbitratorsHub : should have 0 tokens length", async () => {
        expect(await contract.tokensLength()).to.equal(0);
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
        let length = await contract.tokensLength();
        expect(length).to.equal(1);
      });
      it("dataOf : should return arbitrator ID", async () => {
        let data = await contract.dataOf(1);
        expect(data.id).to.equal(1);
      });

      it("dataOf : should return cvID", async () => {
        let cvID = await CVsHub.cvOf(this.addr1.address);
        let data = await contract.dataOf(1);
        expect(data.cvID).to.equal(cvID);
      });
      it("dataOf : should return court ID", async () => {
        let data = await contract.dataOf(1);
        expect(data.courtID).to.equal(3);
      });
      it("dataOf : should return indexedAtCourt & courtLength", async () => {
        let data = await contract.dataOf(1);
        let length = await contract.lengthOfCourt(data.courtID);
        expect(data.indexedAtCourt).to.equal(parseInt(length) - 1);
      });
      it("dataOf : should return 0 balance", async () => {
        let data = await contract.dataOf(1);

        expect(data.balance).to.equal(0);
      });
      it("dataOf : should return 0 nbArbitrations", async () => {
        let data = await contract.dataOf(1);

        expect(data.nbArbitrations).to.equal(0);
      });
      it("dataOf : should return id from indexersCV", async () => {
        let data = await contract.dataOf(1);
        let _id = await contract.arbitrationOfCV(data.cvID, data.courtID);
        expect(data.id).to.equal(_id);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT return data for unexisting ID", async () => {
        await expect(contract.dataOf(2)).to.be.revertedWith(
          "Invalid arbitrator ID"
        );
      });
    });
  });

  describe("Set Arbitrator", () => {
    describe("WORKS", () => {
      it("validateMission : should set arbitrator after validate mission from sender", async () => {
        await _testInitArbitrator(contracts, 3, this.addr1);
        expect(await contract.tokensLength()).to.equal(1);
      });
      it("validateMission : should used twice for different court ID", async () => {
        await _testInitArbitrator(contracts, 3, this.addr1);
        await _testInitArbitrator(contracts, 4, this.addr1);
        expect(await contract.tokensLength()).to.equal(2);
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

  describe("Invest on Court", () => {
    let arbitratorID;
    let courtID = 3;
    let price = 30000;
    beforeEach(async () => {
      arbitratorID = await _testInitArbitrator(contracts, courtID, this.addr1);
    });
    describe("WORKS", () => {
      it("investOnCourt: should update balance", async () => {
        await apiPost
          .connect(this.addr1)
          .investOnCourt(courtID, { value: `${price}` });
        let data = await contract.dataOf(arbitratorID);
        expect(data.balance).to.equal(price);
      });
      it("investOnCourt: should used many times", async () => {
        await apiPost
          .connect(this.addr1)
          .investOnCourt(courtID, { value: `${price}` });
        await apiPost
          .connect(this.addr1)
          .investOnCourt(courtID, { value: `${price}` });
        let data = await contract.dataOf(arbitratorID);
        expect(data.balance).to.equal(price * 2);
        await apiPost
          .connect(this.addr1)
          .investOnCourt(courtID, { value: `${price}` });
        data = await contract.dataOf(arbitratorID);
        expect(data.balance).to.equal(price * 3);
      });
      it("investOnCourt: should update true balance", async () => {
        await _testInitArbitrator(contracts, 4, this.addr1);

        await apiPost
          .connect(this.addr1)
          .investOnCourt(4, { value: `${price}` });
        let data = await contract.dataOf(arbitratorID);
        expect(data.balance).to.equal(0);
        let data2 = await contract.dataOf(parseInt(arbitratorID) + 1);
        expect(data.cvID).to.equal(data2.cvID);
        expect(data2.balance).to.equal(price);
      });
    });
    describe("NOT WORKS", () => {
      it("should NOT call with wrong bindings", async () => {
        await expect(
          contract.investOnCourt(1, 30000, courtID, { value: `${price}` })
        ).to.be.revertedWith("Must call by proxy bindings");
      });

      it("should NOT works if sender haven't place on indexersCourt ", async () => {
        await expect(
          apiPost.investOnCourt(courtID, { value: `${price}` })
        ).to.be.revertedWith("Arbitrator not found");
      });

      it("should NOT works if sender haven't cv ", async () => {
        await expect(
          apiPost
            .connect(this.addr5)
            .investOnCourt(courtID, { value: `${price}` })
        ).to.be.revertedWith("CV not found");
      });

      it("should NOT works if 0 value ", async () => {
        await expect(
          apiPost.connect(this.addr1).investOnCourt(courtID)
        ).to.be.revertedWith("Invalid value");
      });

      it("should NOT works if invest on unknow court ID ", async () => {
        await expect(apiPost.connect(this.addr1).investOnCourt(55)).to.be
          .reverted;
      });
    });
  });

  describe("Withdraw from Court", () => {
    let arbitratorID;
    let courtID = 3;
    let price = ethers.parseEther("4");
    beforeEach(async () => {
      arbitratorID = await _testInitArbitrator(contracts, courtID, this.addr1);
      await apiPost
        .connect(this.addr1)
        .investOnCourt(courtID, { value: `${price}` });
    });
    describe("WORKS", () => {
      it("withdrawFromCourt: should update balance data", async () => {
        let data = await contract.dataOf(arbitratorID);
        expect(data.balance).to.equal(price);
        await apiPost.connect(this.addr1).withdrawFromCourt(price, courtID);
        let data2 = await contract.dataOf(arbitratorID);
        expect(data2.balance).to.equal(0);
      });

      it("withdrawFromCourt: should update balance sender", async () => {
        let balance = await this.addr1.provider.getBalance(this.addr1);
        await apiPost.connect(this.addr1).withdrawFromCourt(price, courtID);

        let balance2 = await this.addr1.provider.getBalance(this.addr1);

        expect(balance2).to.not.be.equal(balance);
        expect(balance2 > balance).to.be.equal(true);

        expect(ethers.formatEther(`${balance2 - balance}`) > 3.9).to.be.equal(
          true
        );
      });
      it("withdrawFromCourt: should can use many times", async () => {
        let _price = ethers.parseEther("1");

        await apiPost.connect(this.addr1).withdrawFromCourt(_price, courtID);
        await apiPost.connect(this.addr1).withdrawFromCourt(_price, courtID);
        await apiPost.connect(this.addr1).withdrawFromCourt(_price, courtID);
        await apiPost.connect(this.addr1).withdrawFromCourt(_price, courtID);
        await expect(
          apiPost.connect(this.addr1).withdrawFromCourt(1, courtID)
        ).to.be.revertedWith("No enough balance");
      });
    });
    describe("NOT WORKS", () => {
      it("should NOT call with wrong bindings", async () => {
        await expect(
          contract.withdrawFromCourt(1, 30000, courtID)
        ).to.be.revertedWith("Must call by proxy bindings");
      });

      it("should NOT works if sender haven't balance ", async () => {
        let _price = ethers.parseEther("4.1");
        await expect(
          apiPost.connect(this.addr1).withdrawFromCourt(_price, courtID)
        ).to.be.revertedWith("No enough balance");
      });

      it("should NOT works if sender haven't cv ", async () => {
        let _price = ethers.parseEther("2");
        await expect(
          apiPost.connect(this.addr5).withdrawFromCourt(_price, 4)
        ).to.be.revertedWith("CV not found");
      });
      it("should NOT works if sender haven't balance on court ", async () => {
        let _price = ethers.parseEther("2");
        await expect(
          apiPost.connect(this.addr1).withdrawFromCourt(_price, 4)
        ).to.be.revertedWith("Arbitrator not found");
      });
    });
  });
});
