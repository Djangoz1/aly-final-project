const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testInitAll } = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
  ZERO_ADDRESS,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "PubHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressHub;
  let contract;
  let accessControl;
  let cvHub;

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
    addressHub = contracts.addressHub;
    accessControl = contracts.accessControl;
    cvHub = contracts.cvHub;
    contract = contracts.pubsHub;
    // return;
    await accessControl.createCV("_tokenURI");
  });

  describe("Init : PubHub", () => {
    it("should deploy properly", async () => {
      expect(contract.target).to.be.equal(await addressHub.pubsHub());
    });
    it("should deploy collecter", async () => {
      expect(await contract.getCollectLikePub()).to.not.be.equal(0x0);
      expect(await contract.getCollectPubs()).to.not.be.equal(0x0);
    });

    it("should have no pub", async () => {
      expect(await contract.getTokensLength()).to.be.equal(0);
    });
    it("should create pub", async () => {
      const length = await contract.getTokensLength();
      await accessControl.createPub("tokenURI");
      expect(await contract.getTokensLength()).to.be.equal(
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
  describe("Like pub", () => {
    let CollectLike;

    beforeEach(async () => {
      await accessControl.createPub("tokenURI");

      CollectLike = await ethers.getContractAt(
        "CollectLikePub",
        await contract.getCollectLikePub()
      );
    });

    it("should deploy Collecter like", async () => {
      expect(await contract.getCollectLikePub()).to.not.be.equal(0x0);
    });

    it("should have 1 pub", async () => {
      expect(await contract.getTokensLength()).to.be.equal(1);
    });

    it("ownerOf(like) should be work", async () => {
      await contract.likePub(1);
      expect(await CollectLike.ownerOf(1)).to.be.equal(this.owner.address);
    });

    it("should return updated lengths", async () => {
      const cvID = await cvHub.getCV(this.owner.address);
      await contract.likePub(1);
      const indexer = await CollectLike.getIndexer(1);

      expect(await CollectLike.getTokensLength()).to.be.equal(1);
      expect(indexer.length).to.be.equal(1);
    });

    it("should like pub", async () => {
      await contract.likePub(1);

      const indexer = await CollectLike.getIndexer(1);
      expect(indexer[0]).to.be.equal(1);
    });

    it("should uptdated data indexedAt", async () => {
      await contract.likePub(1);
      const datas = await CollectLike.getData(1);
      expect(datas.indexedAt).to.be.equal(0);
    });
    it("should uptdated data pub ID", async () => {
      await contract.likePub(1);
      const datas = await CollectLike.getData(1);
      expect(datas.pubID).to.be.equal(1);
    });
    it("should uptdated data id", async () => {
      await contract.likePub(1);
      const datas = await CollectLike.getData(1);
      expect(datas.id).to.be.equal(1);
    });

    describe("NOT WORKS", () => {
      it("should NOT like pub without pubsHub bindings", async () => {
        await accessControl.createPub("tokenURI");

        await expect(
          CollectLike.mint(this.owner.address, 1)
        ).to.be.revertedWith("Must call function with pubsHub bindings");
      });

      it("should NOT like pub wich doesn't exist", async () => {
        await expect(contract.likePub(2)).to.be.revertedWith(
          "Pub ID not exist"
        );
      });
      it("should NOT like pub twice", async () => {
        await contract.likePub(1);
        await expect(contract.likePub(1)).to.be.revertedWith(
          "CV already like this pub"
        );
      });
    });
  });
  describe("Unlike pub", () => {
    let CollectLike;

    beforeEach(async () => {
      await accessControl.createPub("tokenURI");

      CollectLike = await ethers.getContractAt(
        "CollectLikePub",
        await contract.getCollectLikePub()
      );
      await contract.likePub(1);
    });

    it("unlikePub: should update indexers pub", async () => {
      let indexerPub = await CollectLike.getIndexer(1);
      expect(indexerPub[0]).to.be.equal(1);
      await contract.unlikePub(1);
      let afterUnlike = await CollectLike.getIndexer(1);
      expect(indexerPub[0]).to.be.not.equal(afterUnlike[0]);
      expect(afterUnlike[0]).to.be.equal(0);
    });

    describe("NOT WORKS", () => {
      it("should NOT unlike pub without pubsHub bindings", async () => {
        await accessControl.createPub("tokenURI");

        await expect(
          CollectLike.burn(this.owner.address, 1)
        ).to.be.revertedWith("Must call function with pubsHub bindings");
      });

      it("should NOT unlike pub wich not liked", async () => {
        await accessControl.createPub("tokenURI");
        await accessControl.createPub("tokenURI");
        await accessControl.connect(this.addr1).createCV("tokenURI");
        await contract.connect(this.addr1).likePub(2);
        await expect(contract.unlikePub(2)).to.be.revertedWith(
          "Like ID not exist"
        );
      });
      it("should NOT unlike pub twice", async () => {
        await contract.unlikePub(1);
        await expect(contract.unlikePub(1)).to.be.revertedWith(
          "Like ID not exist"
        );
      });
      it("should NOT unlike pub wich unknow pub ID", async () => {
        await expect(contract.unlikePub(2)).to.be.revertedWith(
          "Like ID not exist"
        );
      });
      it("should NOT use ownerOf(likeID) after unlike", async () => {
        await contract.unlikePub(1);
        await expect(CollectLike.ownerOf(1)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("should NOT use getData(likeID) after unlike", async () => {
        await contract.unlikePub(1);
        await expect(CollectLike.getData(1)).to.be.revertedWith("Not liked");
      });
    });
  });
  describe("Collect pub", () => {
    let CollectPubs;

    beforeEach(async () => {
      await accessControl.createPub("tokenURI");

      CollectPubs = await ethers.getContractAt(
        "CollectPubs",
        await contract.getCollectPubs()
      );
    });

    it("should have good collecter", async () => {
      expect(CollectPubs.target).to.not.be.equal(ZERO_ADDRESS);
      expect(CollectPubs.target).to.be.equal(await contract.getCollectPubs());
    });

    it("should get 0 answer", async () => {
      let answers = await CollectPubs.getPubAnswers(1);
      expect(answers.length).to.be.equal(0);
    });

    describe("Pub Answer", () => {
      it("addPubAnswer : should update pubs length", async () => {
        let prevLength = await contract.getTokensLength();
        await CollectPubs.addPubAnswer(1, "tokenURI");
        let length = await contract.getTokensLength();
        expect(length).to.be.equal(parseInt(prevLength) + 1);
      });
      it("addPubAnswer : should get answers", async () => {
        await CollectPubs.addPubAnswer(1, "tokenURI");
        let answers = await CollectPubs.getPubAnswers(1);
        expect(answers.length).to.be.equal(1);
        expect(answers[0]).to.be.equal(2);
      });
      it("addPubAnswer : should get token URI", async () => {
        await CollectPubs.addPubAnswer(1, "answerURI");
        let answers = await CollectPubs.getPubAnswers(1);
        expect(answers.length).to.be.equal(1);
        expect(await contract.tokenURI(answers[0])).to.be.equal("answerURI");
      });
      describe("NOT WORKS", () => {
        it("should NOT get answer for unknow ID", async () => {
          await expect(CollectPubs.getPubAnswers(2)).to.be.revertedWith(
            "Pub not exist"
          );
        });
        it("should NOT answer from unknow cvID", async () => {
          await expect(
            CollectPubs.connect(this.addr2).addPubAnswer(1, "tokenURI")
          ).to.be.revertedWith("CV not exist");
        });
        it("should NOT answer to unknow ID", async () => {
          await expect(
            CollectPubs.addPubAnswer(2, "tokenURI")
          ).to.be.revertedWith("Pub not exist");
        });
      });
    });
    describe("Pub Mission", () => {
      beforeEach(async () => {
        let price = await accessControl.missionPrice();

        await accessControl.buyMission("tokenURI", { value: `${price}` });
      });
      describe("WORKS", () => {
        it("AddPubMission : should update pubs length", async () => {
          let prevLength = await contract.getTokensLength();
          await CollectPubs.addPubMission(1, "tokenURI");
          let length = await contract.getTokensLength();
          expect(length).to.be.equal(parseInt(prevLength) + 1);
        });

        it("AddPubMission : should get pubs mission", async () => {
          await CollectPubs.addPubMission(1, "tokenURI");
          let indexers = await CollectPubs.getPubsMission(1);
          expect(indexers.length).to.be.equal(1);
          expect(indexers[0]).to.be.equal(2);
        });
        it("AddPubMission : should get tokenURI", async () => {
          await CollectPubs.addPubMission(1, "tokenURI");
          let indexers = await CollectPubs.getPubsMission(1);
          expect(await contract.tokenURI(indexers[0])).to.be.equal("tokenURI");
        });
      });

      describe("NOT WORKS", () => {
        it("should NOT get pubs mission for unknow ID", async () => {
          await expect(CollectPubs.getPubsMission(2)).to.be.revertedWith(
            "Mission not exist"
          );
        });
        it("should NOT create pubs mission from unknow cvID", async () => {
          await expect(
            CollectPubs.connect(this.addr2).addPubMission(1, "tokenURI")
          ).to.be.revertedWith("CV not exist");
        });
        it("should NOT create pubs mission from unknow ID", async () => {
          await expect(
            CollectPubs.addPubMission(3, "tokenURI")
          ).to.be.revertedWith("Mission not exist");
        });
      });
    });
  });
});
