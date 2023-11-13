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
  describe("Like pub", () => {
    beforeEach(async () => {
      await apiPost.createPub("tokenURI");
    });

    it("should have 1 pub", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
    });

    it("ownerOf(like) should be work", async () => {
      await apiPost.likePub(1);
      expect(await datasHub.ownerOf(1)).to.be.equal(this.owner.address);
    });

    it("should return updated lengths", async () => {
      const cvID = await apiGet.cvOf(this.owner.address);
      await apiPost.likePub(1);
      const indexer = await apiGet.pubsOfCV(cvID);

      expect(await apiGet.lengthOfLikes()).to.be.equal(1);
      expect(indexer.length).to.be.equal(1);
    });

    it("should like pub", async () => {
      await apiPost.likePub(1);

      const indexer = await apiGet.pubsOfCV(1);
      expect(indexer[0]).to.be.equal(1);
    });

    it("should uptdated data indexedAt", async () => {
      await apiPost.likePub(1);
      const datas = await apiGet.datasOfLike(1);
      expect(datas.indexedAt).to.be.equal(0);
    });
    it("should uptdated data pub ID", async () => {
      await apiPost.likePub(1);
      const datas = await apiGet.datasOfLike(1);
      expect(datas.pubID).to.be.equal(1);
    });
    it("should uptdated data id", async () => {
      await apiPost.likePub(1);
      const datas = await apiGet.datasOfLike(1);
      expect(datas.id).to.be.equal(1);
    });

    describe("NOT WORKS", () => {
      it("should NOT like pub without pubsHub bindings", async () => {
        await apiPost.createPub("tokenURI");

        await expect(datasHub.like(this.owner.address, 1)).to.be.revertedWith(
          "Must be call by proxy bindings"
        );
      });

      it("should NOT like pub wich doesn't exist", async () => {
        await expect(apiPost.likePub(2)).to.be.revertedWith(
          "PubsDatasHub: Invalid ID"
        );
      });
      it("should NOT like pub twice", async () => {
        await apiPost.likePub(1);
        await expect(apiPost.likePub(1)).to.be.revertedWith(
          "CV already like this pub"
        );
      });
    });
  });

  describe("Unlike pub", () => {
    beforeEach(async () => {
      await apiPost.createPub("tokenURI");

      await apiPost.likePub(1);
    });

    it("unlikePub: should update indexers pub", async () => {
      let indexerPub = await apiGet.likesOfPub(1);
      expect(indexerPub[0]).to.be.equal(1);
      await apiPost.unlikePub(1);
      let afterUnlike = await apiGet.likesOfPub(1);
      expect(indexerPub[0]).to.be.not.equal(afterUnlike[0]);
      expect(afterUnlike[0]).to.be.equal(0);
    });

    describe("NOT WORKS", () => {
      it("should NOT unlike pub without pubsHub bindings", async () => {
        await apiPost.createPub("tokenURI");

        await expect(datasHub.unlike(this.owner.address, 1)).to.be.revertedWith(
          "Must be call by proxy bindings"
        );
      });

      it("should NOT unlike pub wich not liked", async () => {
        await apiPost.createPub("tokenURI");
        await apiPost.createPub("tokenURI");
        await apiPost.connect(this.addr1).createCV("tokenURI");
        await apiPost.connect(this.addr1).likePub(2);
        await expect(apiPost.unlikePub(2)).to.be.revertedWith(
          "Like ID not exist"
        );
      });

      it("should NOT unlike pub twice", async () => {
        await apiPost.unlikePub(1);
        await expect(apiPost.unlikePub(1)).to.be.revertedWith(
          "Like ID not exist"
        );
      });
      it("should NOT unlike pub wich unknow pub ID", async () => {
        await expect(apiPost.unlikePub(2)).to.be.revertedWith(
          "PubsDatasHub: Invalid ID"
        );
      });
      it("should NOT use ownerOf(likeID) after unlike", async () => {
        await apiPost.unlikePub(1);
        await expect(datasHub.ownerOf(1)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("should NOT use dataOf(likeID) after unlike", async () => {
        await apiPost.unlikePub(1);
        await expect(apiGet.datasOfLike(1)).to.be.revertedWith("Not liked");
      });
    });
  });

  describe("Collect pub", () => {
    beforeEach(async () => {
      await apiPost.createPub("tokenURI");
    });

    it("should get 0 answer", async () => {
      let answers = await apiGet.answersOfPub(1);
      expect(answers.length).to.be.equal(0);
    });

    describe("Pub Answer", () => {
      it("addPubAnswer : should update pubs length", async () => {
        let prevLength = await apiGet.tokensLengthOf(contract.target);
        await apiPost.createPubAnswer(1, "tokenURI");
        let length = await apiGet.tokensLengthOf(contract.target);
        expect(length).to.be.equal(parseInt(prevLength) + 1);
      });

      it("addPubAnswer : should get answers", async () => {
        await apiPost.createPubAnswer(1, "tokenURI");
        let answers = await apiGet.answersOfPub(1);
        expect(answers.length).to.be.equal(1);
        expect(answers[0]).to.be.equal(2);
      });

      it("addPubAnswer : should get token URI", async () => {
        await apiPost.createPubAnswer(1, "answerURI");
        let answers = await apiGet.answersOfPub(1);
        expect(answers.length).to.be.equal(1);
        expect(await contract.tokenURI(answers[0])).to.be.equal("answerURI");
      });

      describe("NOT WORKS", () => {
        it("should NOT get answer for unknow ID", async () => {
          await expect(apiGet.answersOfPub(2)).to.be.revertedWith(
            "PubsDatasHub: Invalid ID"
          );
        });

        it("should NOT answer from unknow cvID", async () => {
          await expect(
            apiPost.connect(this.addr2).createPubAnswer(1, "tokenURI")
          ).to.be.revertedWith("CV not found");
        });

        it("should NOT answer to unknow ID", async () => {
          await expect(
            apiPost.createPubAnswer(2, "tokenURI")
          ).to.be.revertedWith("PubsDatasHub: Invalid ID");
        });
      });
    });

    describe("Pub Mission", () => {
      beforeEach(async () => {
        let price = await balancesHub.missionPrice();
        await apiPostPayable.createMission("tokenURI", { value: `${price}` });
      });

      describe("WORKS", () => {
        it("AddPubMission : should update pubs length", async () => {
          let prevLength = await apiGet.tokensLengthOf(contract.target);
          await apiPost.createPubMission(1, "tokenURI");
          let length = await apiGet.tokensLengthOf(contract.target);
          expect(length).to.be.equal(parseInt(prevLength) + 1);
        });

        it("AddPubMission : should get pubs mission", async () => {
          await apiPost.createPubMission(1, "tokenURI");
          let indexers = await apiGet.pubsOfMission(1);
          expect(indexers.length).to.be.equal(1);
          expect(indexers[0]).to.be.equal(2);
        });

        it("AddPubMission : should get tokenURI", async () => {
          await apiPost.createPubMission(1, "tokenURI");
          let indexers = await apiGet.pubsOfMission(1);
          expect(await contract.tokenURI(indexers[0])).to.be.equal("tokenURI");
        });
      });

      describe("NOT WORKS", () => {
        it("should NOT get pubs mission for unknow ID", async () => {
          await expect(apiGet.pubsOfMission(2)).to.be.revertedWith(
            "PubsDatasHub: Invalid ID"
          );
        });

        it("should NOT create pubs mission from unknow cvID", async () => {
          await expect(
            apiPost.connect(this.addr2).createPubMission(1, "tokenURI")
          ).to.be.revertedWith("CV not found");
        });

        it("should NOT create pubs mission from unknow ID", async () => {
          await expect(
            apiPost.createPubMission(3, "tokenURI")
          ).to.be.revertedWith("PubsDatasHub: Invalid ID");
        });
      });
    });
  });
});
