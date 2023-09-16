const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { _testInitAll, getContractAt } = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

const CONTRACT_NAME = "CVsHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let contract;
  let apiPost;
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
    apiGet = await contracts.systems.apiGet;
  });

  // *:::::::: INITIALISATION ::::::::* //

  describe("Initialization CV Hub", () => {
    it("Should have 0 token", async () => {
      expect(await apiGet.lengthOfCVs()).to.be.equal(0);
    });

    it("Should create a CV", async () => {
      await apiPost.createCV("tokenURI");
      expect(await apiGet.lengthOfCVs()).to.be.equal(1);
      expect(await apiGet.cvOf(this.owner.address)).to.be.equal(1);
      expect(await contract.ownerOf(1)).to.be.equal(this.owner.address);
      expect(await contract.tokenURI(1)).to.be.equal("tokenURI");
    });
  });

  describe("Create CV", () => {
    beforeEach(async () => {});

    describe("WORKS", () => {
      it("Should create a cv", async () => {
        expect(await apiGet.lengthOfCVs()).to.be.equal(0);
        await apiPost.connect(this.addr1).createCV("tokenURI");
        expect(await apiGet.lengthOfCVs()).to.be.equal(1);
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

  describe("Follow CV", () => {
    beforeEach(async () => {
      await apiPost.createCV("tokenURI");
      await apiPost.connect(this.addr1).createCV("tokenURI");
    });
    describe("WORKS", () => {
      it("Should isFollow return true", async () => {
        await apiPost.followCV(2);
        let isFollow = await apiGet.isFollow(1, 2);
        expect(isFollow).to.be.equal(true);
      });

      it("Should update length followers", async () => {
        let length = await apiGet.lengthOfFollower(2);
        expect(length).to.be.equal(0);
        await apiPost.followCV(2);
        length = await apiGet.lengthOfFollower(2);

        expect(length).to.be.equal(1);
      });
      it("Should update length followed", async () => {
        let length = await apiGet.lengthOfFollowed(1);
        expect(length).to.be.equal(0);
        await apiPost.followCV(2);
        length = await apiGet.lengthOfFollowed(1);

        expect(length).to.be.equal(1);
      });

      it("Should get cv follower", async () => {
        await apiPost.followCV(2);
        let follower = await apiGet.followerOf(2, 0);
        expect(follower).to.be.equal(1);
      });

      it("Should get cv followed", async () => {
        await apiPost.followCV(2);
        let follower = await apiGet.followedOf(1, 0);
        expect(follower).to.be.equal(2);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT follow CV with wrong proxy bindings", async () => {
        await expect(datasHub.follow(this.owner.address, 1)).to.be.revertedWith(
          "Must call function with hub bindings"
        );
      });

      it("Should NOT follow CV twice", async () => {
        await apiPost.followCV(2);
        await expect(apiPost.followCV(2)).to.be.revertedWith(
          "Already followed"
        );
      });

      it("Should NOT follow CV if sender haven't CV", async () => {
        await expect(
          apiPost.connect(this.addr3).followCV(2)
        ).to.be.revertedWith("CV not found");
      });

      it("Should NOT follow CV wich not exist", async () => {
        await expect(apiPost.followCV(3)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });

      it("Should NOT follow own cv", async () => {
        await expect(apiPost.followCV(1)).to.be.revertedWith(
          "Can't follow yourself"
        );
      });
    });
  });

  describe("Unfollow CV", () => {
    beforeEach(async () => {
      await apiPost.createCV("tokenURI");
      await apiPost.connect(this.addr1).createCV("tokenURI");
      await apiPost.followCV(2);
    });
    describe("WORKS", () => {
      it("Should unfollow CV", async () => {
        await apiPost.unfollowCV(2);
        let isFollow = await apiGet.isFollow(1, 2);
        expect(isFollow).to.be.equal(false);
      });

      it("Should update length followers", async () => {
        let length = await apiGet.lengthOfFollower(2);
        expect(length).to.be.equal(1);
        await apiPost.unfollowCV(2);
        length = await apiGet.lengthOfFollower(2);

        expect(length).to.be.equal(0);
      });

      it("Should update length followed", async () => {
        let length = await apiGet.lengthOfFollowed(1);
        expect(length).to.be.equal(1);
        await apiPost.unfollowCV(2);
        length = await apiGet.lengthOfFollowed(1);

        expect(length).to.be.equal(0);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT unfollow CV with wrong proxy bindings", async () => {
        await expect(
          datasHub.unfollow(this.owner.address, 2)
        ).to.be.revertedWith("Must call function with hub bindings");
      });

      it("Should NOT unfollow CV twice", async () => {
        await apiPost.unfollowCV(2);
        await expect(apiPost.unfollowCV(2)).to.be.revertedWith("Not followed");
      });

      it("Should NOT unfollow CV if sender haven't CV", async () => {
        await expect(
          apiPost.connect(this.addr3).unfollowCV(2)
        ).to.be.revertedWith("CV not found");
      });

      it("Should NOT unfollow CV wich not exist", async () => {
        await expect(apiPost.unfollowCV(3)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });

      it("Should NOT unfollow own cv", async () => {
        await expect(apiPost.unfollowCV(1)).to.be.revertedWith(
          "Can't unfollow yourself"
        );
      });

      it("Shoud NOT unfollow CV if not followed", async () => {
        await apiPost.connect(this.addr2).createCV("tokenURI");
        await expect(apiPost.unfollowCV(3)).to.be.revertedWith("Not followed");
      });
    });
  });
});
