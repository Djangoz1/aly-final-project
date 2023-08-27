const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { _testInitAll, getContractAt } = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

const CONTRACT_NAME = "CV";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressHub;
  let factoryMission;
  let contract;
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
    addressHub = await contracts.addressHub;
    accessControl = await contracts.accessControl;
    contract = await contracts.cvHub;
    factoryMission = await contracts.missionsHub;
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization CV Hub", () => {
    it("Should have a collecter", async () => {
      expect(await contract.getCollectFollowCv()).to.be.not.equal(ZERO_ADDRESS);
    });

    it("Should have 0 token", async () => {
      expect(await contract.getTokensLength()).to.be.equal(0);
    });

    it("Should create a CV", async () => {
      await accessControl.createCV("tokenURI");
      expect(await contract.getTokensLength()).to.be.equal(1);
      expect(await contract.ownerOf(1)).to.be.equal(this.owner.address);
      expect(await contract.getCV(this.owner.address)).to.be.equal(1);
      expect(await contract.tokenURI(1)).to.be.equal("tokenURI");
    });

    describe("NOT WORKS", () => {
      it("Should NOT mint CV", async () => {
        await expect(
          contract.mint(this.owner.address, "tokenURI")
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
      it("Should NOT mint CV twice", async () => {
        await accessControl.createCV("tokenURI");
        await expect(accessControl.createCV("tokenURI")).to.be.revertedWith(
          "CV already exist"
        );
      });
    });
  });

  describe("Follow CV", () => {
    let collecter;

    beforeEach(async () => {
      collecter = await getContractAt(
        "CollectFollowCv",
        await contract.getCollectFollowCv()
      );
      await accessControl.createCV("tokenURI");
      await accessControl.connect(this.addr1).createCV("tokenURI");
    });
    describe("WORKS", () => {
      it("Should have a collecter", async () => {
        expect(await contract.getCollectFollowCv()).to.be.equal(
          collecter.target
        );
      });
      it("Should isFollow return true", async () => {
        await contract.followCV(2);
        let isFollow = await collecter.isFollow(1, 2);
        expect(isFollow).to.be.equal(true);
      });
      it("Should update length followers", async () => {
        let length = await collecter.getFollowerLength(2);
        expect(length).to.be.equal(0);
        await contract.followCV(2);
        length = await collecter.getFollowerLength(2);

        expect(length).to.be.equal(1);
      });
      it("Should update length followed", async () => {
        let length = await collecter.getFollowedLength(1);
        expect(length).to.be.equal(0);
        await contract.followCV(2);
        length = await collecter.getFollowedLength(1);

        expect(length).to.be.equal(1);
      });

      it("Should get cv follower", async () => {
        await contract.followCV(2);
        let follower = await collecter.getFollower(2, 0);
        expect(follower).to.be.equal(1);
      });

      it("Should get cv followed", async () => {
        await contract.followCV(2);
        let follower = await collecter.getFollowed(1, 0);
        expect(follower).to.be.equal(2);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT follow CV twice", async () => {
        await contract.followCV(2);
        await expect(contract.followCV(2)).to.be.revertedWith(
          "Already followed"
        );
      });
      it("Should NOT follow CV if sender haven't CV", async () => {
        await expect(
          contract.connect(this.addr3).followCV(2)
        ).to.be.revertedWith("CV not exist");
      });
      it("Should NOT follow CV wich not exist", async () => {
        await expect(contract.followCV(3)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("Should NOT follow own cv", async () => {
        await expect(contract.followCV(1)).to.be.revertedWith(
          "Can't follow yourself"
        );
      });
    });
  });

  describe("Unfollow CV", () => {
    let collecter;

    beforeEach(async () => {
      collecter = await getContractAt(
        "CollectFollowCv",
        await contract.getCollectFollowCv()
      );
      await accessControl.createCV("tokenURI");
      await accessControl.connect(this.addr1).createCV("tokenURI");
      await contract.followCV(2);
    });
    describe("WORKS", () => {
      it("Should unfollow CV", async () => {
        await contract.unfollowCV(2);
        let isFollow = await collecter.isFollow(1, 2);
        expect(isFollow).to.be.equal(false);
      });

      it("Should update length followers", async () => {
        let length = await collecter.getFollowerLength(2);
        expect(length).to.be.equal(1);
        await contract.unfollowCV(2);
        length = await collecter.getFollowerLength(2);

        expect(length).to.be.equal(0);
      });
      it("Should update length followed", async () => {
        let length = await collecter.getFollowedLength(1);
        expect(length).to.be.equal(1);
        await contract.unfollowCV(2);
        length = await collecter.getFollowedLength(1);

        expect(length).to.be.equal(0);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT unfollow CV with no proxy bindings", async () => {
        await expect(
          collecter.unfollow(this.owner.address, 2)
        ).to.be.revertedWith("Must call function with hub bindings");
      });
      it("Should NOT unfollow CV twice", async () => {
        await contract.unfollowCV(2);
        await expect(contract.unfollowCV(2)).to.be.revertedWith("Not followed");
      });
      it("Should NOT unfollow CV if sender haven't CV", async () => {
        await expect(
          contract.connect(this.addr3).unfollowCV(2)
        ).to.be.revertedWith("CV not exist");
      });
      it("Should NOT unfollow CV wich not exist", async () => {
        await expect(contract.unfollowCV(3)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("Should NOT unfollow own cv", async () => {
        await expect(contract.unfollowCV(1)).to.be.revertedWith(
          "Can't unfollow yourself"
        );
      });

      it("Shoud NOT unfollow CV if not followed", async () => {
        await accessControl.connect(this.addr2).createCV("tokenURI");
        await expect(contract.unfollowCV(3)).to.be.revertedWith("Not followed");
      });
    });
  });
});
