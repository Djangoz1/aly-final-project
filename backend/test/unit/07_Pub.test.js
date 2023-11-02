const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testInitAll } = require("../../helpers/test_init");

const CONTRACT_NAME = "PubHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressSystem;
  let contract;
  let balancesHub;
  let cvsHub;
  let datasHub;
  let apiPost;
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
    beforeEach(async () => {});

    it("should have 0 pub", async () => {
      expect(await apiGet.pubsPayableLength()).to.be.equal(0);
      await apiPost.createPub("tokenURI");

      expect(await apiGet.pubsPayableLength()).to.be.equal(0);
    });

    it("should create payable pub", async () => {
      expect(await apiGet.pubsPayableLength()).to.be.equal(0);
      await apiPost.createPubPayable(200, "tokenURI");
      expect(await apiGet.pubsPayableLength()).to.be.equal(1);
    });

    describe("NOT WORKS", () => {
      it("should NOT like pub without pubsHub bindings", async () => {
        await expect(contract.mint(1, "tokenURI", true)).to.be.revertedWith(
          "Must call function with proxy bindings"
        );
      });
      it("should NOT work if amount === 0", async () => {
        await expect(
          apiPost.createPubPayable(0, "tokenURI")
        ).to.be.revertedWith("Must have a value");
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
        await apiPost.createMission("tokenURI", { value: `${price}` });
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
