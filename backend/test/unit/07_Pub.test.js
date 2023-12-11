const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testInitAll } = require("../../helpers/test_init");
const { transactionCost } = require("../../helpers/test_utils");

const CONTRACT_NAME = "PubHub";

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

    // return;
    await apiPost.createCV("_tokenURI");
  });

  describe("Init : PubHub", () => {
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

  describe("Payable pub", () => {
    beforeEach(async () => {
      await apiPost.connect(this.addr1).createCV("_tokenURI");
    });

    describe("WORKS", () => {
      it("should create pub not payable", async () => {
        await apiPost.createPub("tokenURI");
        await expect(apiGet.datasOfPayablePub(1)).to.be.revertedWith(
          "Not payable pub"
        );
      });

      it("should update amount", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.datasOfPayablePub(1);
        expect(datas.amount).to.be.equal(30);
      });

      it("should return  0 viewers", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.datasOfPayablePub(1);
        expect(datas.viewers).to.be.equal(0);
      });

      it("should return protected tokenURI", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.datasOfPayablePub(1);
        expect(datas.tokenURI).to.be.equal("tokenProtect");
      });
      it("should return empty tokenURI", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.tokenURI).to.be.equal("");
      });

      it("should return  allowance true", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.datasOfPayablePub(1);
        expect(datas.isAllowed).to.be.equal(true);
      });

      it("should return  allowance false", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.isAllowed).to.be.equal(false);
      });
      it("buyPub : should update allowance", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.isAllowed).to.be.equal(false);
        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.isAllowed).to.be.equal(true);
      });
      it("buyPub : should update viewers", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);

        expect(datas.viewers).to.be.equal(0);
        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.viewers).to.be.equal(1);
      });

      it("buyPub : should return  tokenProtect", async () => {
        await apiPost.createPayablePub("tokenURI", 30, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.tokenURI).to.be.equal("");
        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        expect(datas.tokenURI).to.be.equal("tokenProtect");
      });

      it("buyPub : should update  balance of owner", async () => {
        let balanceOwner = await balancesHub.balanceOf(
          await apiGet.cvOf(this.owner.address)
        );
        await apiPost.createPayablePub("tokenURI", 2000000000, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);

        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        let balanceOwner1 = await balancesHub.balanceOf(
          await apiGet.cvOf(this.owner.address)
        );

        expect(balanceOwner + datas.amount).to.be.equal(balanceOwner1);
      });

      it("buyPub : should withdraw balance of payable", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000000, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);
        await apiPost.connect(this.addr2).createCV("tokenURI");

        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        await apiPostPayable
          .connect(this.addr2)
          .buyPub(1, { value: datas.amount });

        let balanceOwner = await balancesHub.balanceOf(
          await apiGet.cvOf(this.owner.address)
        );
        await apiPostPayable.withdraw(2000000000 * 2);
        let balanceOwner1 = await balancesHub.balanceOf(
          await apiGet.cvOf(this.owner.address)
        );
        expect(balanceOwner1).to.be.equal(0);

        expect(balanceOwner > balanceOwner1).to.be.equal(true);
      });

      it("buyPub : should update  balance of payer", async () => {
        let balancePayer = await ethers.provider.getBalance(this.addr1.address);
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);

        let tx = await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        let balancePayer1 = await ethers.provider.getBalance(
          this.addr1.address
        );

        expect(balancePayer > balancePayer1).to.be.equal(true);
      });

      it("buyPub : should update  balance of contract", async () => {
        let balanceContract = await ethers.provider.getBalance(
          apiPostPayable.target
        );
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);

        await apiPostPayable
          .connect(this.addr1)
          .buyPub(1, { value: datas.amount });
        let balanceContract1 = await ethers.provider.getBalance(
          apiPostPayable.target
        );

        expect(balanceContract < balanceContract1).to.be.equal(true);
      });

      it("Should update indexerPayableOf ", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");

        let indexer = await apiGet.pubsPayableOf(
          await apiGet.cvOf(this.owner.address)
        );
        expect(indexer.length).to.be.equal(1);
      });
      it("Should update datasOfPub isPayable  ", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");

        let datas = await apiGet.datasOfPub(1);
        expect(datas.isPayable).to.be.equal(true);
      });
    });
    describe("NOT WORKS", () => {
      it("Should not create pub with wrong bindings", async () => {
        await expect(
          datasHub.mintPayablePub(1, 30, "tokenURI")
        ).to.be.revertedWith("Must be call by proxy bindings");
      });
      it("Should not create pub if no cv", async () => {
        await expect(
          apiPost
            .connect(this.addr3)
            .createPayablePub("tokenURI", 2000000, "tokenProtect")
        ).to.be.revertedWith("CV not found");
      });
      it("Should not buy pub if no cv", async () => {
        apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");
        await expect(
          apiPostPayable.connect(this.addr3).buyPub(1, { value: 2000000 })
        ).to.be.revertedWith("CV not found");
      });
      it("Should not get pub with wrong bindings", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");

        await expect(datasHub.datasOfPayablePub(1)).to.be.revertedWith(
          "Must be call by proxy bindings"
        );
      });
      it("Should not buy pub with wrong bindings", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");

        await expect(datasHub.buyPub(1, 1)).to.be.revertedWith(
          "Must be call by proxy bindings"
        );
      });

      it("Should not create payable pub without tokenURI protect", async () => {
        await expect(
          apiPost.createPayablePub("", 2000000, "")
        ).to.be.revertedWith("Error value pub");
        await expect(
          apiPost.createPayablePub("tokenURI", 2000000, "")
        ).to.be.revertedWith("Error value pub");
        await expect(
          apiPost.createPayablePub("", 2000000, "tokenURI")
        ).to.be.revertedWith("Error value pub");
      });
      it("Should not create payable pub without amount", async () => {
        await expect(
          apiPost.createPayablePub("tokenURI", 0, "tokenURI")
        ).to.be.revertedWith("Error value pub");
      });

      it("Should not buy pub if pub != payable", async () => {
        await apiPost.createPub("tokenURI");

        await expect(
          apiPostPayable.buyPub(1, { value: 2000000 })
        ).to.be.revertedWith("Error value");
      });

      it("Should not get datasPayable if pub != payable", async () => {
        await apiPost.createPub("tokenURI");

        await expect(
          apiGet.connect(this.addr1).datasOfPayablePub(1)
        ).to.be.revertedWith("Not payable pub");
      });

      it("Should not buy pub if value <  amount", async () => {
        await apiPost.createPayablePub("tokenURI", 2000000, "tokenProtect");
        let datas = await apiGet.connect(this.addr1).datasOfPayablePub(1);

        await expect(
          apiPostPayable.buyPub(1, { value: datas.amount - 1n })
        ).to.be.revertedWith("Error value");
      });

      it("Should not update indexerPayableOf if no payable pub", async () => {
        await apiPost.createPub("tokenURI");
        await apiPost.createPubAnswer(1, "tokenURI");
        let indexer = await apiGet.pubsPayableOf(
          await apiGet.cvOf(this.owner.address)
        );
        expect(indexer.length).to.be.equal(0);
      });
    });
  });
});
