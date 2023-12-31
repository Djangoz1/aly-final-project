const { ethers } = require("hardhat");
// const { ethers } = require("ethers");
const { expect, assert } = require("chai");
const { _testInitAll } = require("../../helpers/test_init");

const CONTRACT_NAME = "MissionsHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let contract;
  let CVsHub;

  let apiGet;
  let apiPost;
  let apiPostPayable;
  let balancesHub;
  let token;
  let cvID;

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
    const contracts = await _testInitAll();
    try {
      CVsHub = await contracts.cvs.hub;
      apiGet = await contracts.systems.apiGet;
      apiPost = await contracts.systems.apiPost;
      apiPostPayable = await contracts.systems.apiPostPayable;
      balancesHub = await contracts.systems.balancesHub;
      token = contracts.token;
      await apiPost.createCV("tokenURI");
      contract = await contracts.works.missionsHub;
      cvID = await CVsHub.cvOf(this.owner.address);
    } catch (error) {
      console.log("error", error);
    }
  });

  // ********************************** //
  // *:::::::: INITIALISATION ::::::::* //
  // ------------------------------------
  describe("Initialization", () => {
    it("Should  get price of mission", async () => {
      let price = await balancesHub.missionPrice();
      expect(price.toString()).to.equal(ethers.parseEther("0.05"));
    });

    it("Should get 0 token", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.equal(0);
    });

    describe("NOT WORK", () => {
      it("Should NOT create mission out of bindings apiPost", async () => {
        await expect(
          contract.mint(this.owner.address, "tokenURI", 0)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
      it("Should NOT add feature out of bindings features hub", async () => {
        await expect(contract.addFeature(1, 1)).to.be.revertedWith(
          "Must call function with featuresHub bindings"
        );
      });
    });
  });

  describe("Create Mission", () => {
    let missionPrice;

    beforeEach(async () => {
      let price = await balancesHub.missionPrice();
      missionPrice = price.toString();
    });

    describe("With ETHEREUM", () => {
      describe("Works", () => {
        it("Should update ownership of mission ID", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          expect(await contract.ownerOf(1)).to.be.equal(this.owner.address);
        });

        it("Should update balance of owner", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          expect(await contract.balanceOf(this.owner.address)).to.be.equal(1);
        });

        it("Should update tokens length", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
        });

        it("Should get token URI", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          expect(await contract.tokenURI(1)).to.be.equal("tokenURI");
        });

        it("Should update indexer", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          let cvID = await CVsHub.cvOf(this.owner.address);
          let indexer = await apiGet.indexerOfToken(cvID, contract.target);
          expect(indexer.length).to.be.equal(1);
          expect(indexer[0]).to.be.equal(1);
        });

        it("Should update status", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          const datas = await apiGet.datasOfMission(1);
          expect(datas.status).to.be.equal(0);
        });

        it("Should update id", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          const datas = await apiGet.datasOfMission(1);
          expect(datas.id).to.be.equal(1);
        });

        it("Should have 0 features", async () => {
          await apiPostPayable.createMission("tokenURI", {
            value: missionPrice,
          });
          const datas = await apiGet.datasOfMission(1);
          expect(datas.features.length).to.be.equal(0);
        });
      });

      describe("NOT WORK", () => {
        it("Should NOT create mission if no CV", async () => {
          await expect(
            apiPost.connect(this.addr1).createMission("tokenURI")
          ).to.be.revertedWith("CV not found");
        });

        it("Should NOT create mission if under price", async () => {
          await expect(
            apiPostPayable.createMission("tokenURI", {
              value: "100000",
            })
          ).to.be.revertedWith("Mission price : Invalid value");
        });
      });
    });
    describe("With ERC20 Token", () => {
      describe("Works", () => {
        it("Should works like payable function", async () => {
          await apiPost.createMission("tokenURI");
          let indexer = await apiGet.indexerOfToken(cvID, contract.target);
          const datas = await apiGet.datasOfMission(1);
          expect(await contract.balanceOf(this.owner.address)).to.be.equal(1);
          expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
          expect(await contract.tokenURI(1)).to.be.equal("tokenURI");
          expect(indexer.length === 1 && indexer[0] == 1).to.be.equal(true);
          expect(datas.status).to.be.equal(0);
          expect(await contract.ownerOf(1)).to.be.equal(this.owner.address);
          expect(datas.features.length).to.be.equal(0);
        });
        it("Should update balance of owner protocole", async () => {
          await apiPost.connect(this.addr1).createCV("tokenURI");
          let price = BigInt(missionPrice) * (await token.price()) + 1n;
          await token.transfer(this.addr1.address, price);
          let balance = await token.balanceOf(await contract.owner());
          await apiPost.connect(this.addr1).createMission("tokenURI");
          let _balance = await token.balanceOf(await contract.owner());
          expect(_balance > balance).to.be.equal(true);
          expect(_balance - price + 1n).to.be.equal(balance);
        });
        it("Should update balance of owner mission", async () => {
          await apiPost.connect(this.addr1).createCV("tokenURI");
          let price = BigInt(missionPrice) * (await token.price()) + 1n;
          await token.transfer(this.addr1.address, price);
          let balance = await token.balanceOf(this.addr1.address);
          await apiPost.connect(this.addr1).createMission("tokenURI");
          let _balance = await token.balanceOf(this.addr1.address);
          expect(_balance < balance).to.be.equal(true);
          expect(balance - price + 1n).to.be.equal(_balance);
        });
      });

      describe("NOT WORK", () => {
        it("Should NOT create mission if no CV", async () => {
          await expect(
            apiPost.connect(this.addr1).createMission("tokenURI")
          ).to.be.revertedWith("CV not found");
        });

        it("Should NOT create mission if under price", async () => {
          await apiPost.connect(this.addr1).createCV("tokenURI");
          await expect(
            apiPost.connect(this.addr1).createMission("tokenURI")
          ).to.be.revertedWith("Not enough funds");
        });
      });
    });
  });

  describe("Close mission", () => {
    beforeEach(async () => {
      let price = await balancesHub.missionPrice();
      let missionPrice = price.toString();
      await apiPostPayable.createMission("tokenURI", {
        value: missionPrice,
      });
      await apiPost.connect(this.addr1).createCV("tokenURI");
    });

    describe("WORKS", () => {
      it("Should close mission", async () => {
        await apiPost.closeMission(1);
        const datas = await apiGet.datasOfMission(1);
        expect(datas.status).to.be.equal(1);
      });
    });

    describe("NOT WORK", () => {
      it("Should NOT close mission without proxy bindings", async () => {
        await expect(contract.closeMission(1)).to.be.revertedWith(
          "Must call function with proxy bindings"
        );
      });
      it("Should NOT close mission if not owner", async () => {
        await expect(
          apiPost.connect(this.addr1).closeMission(1)
        ).to.be.revertedWith("Not the owner");
        const datas = await apiGet.datasOfMission(1);
        expect(datas.status).to.be.equal(0);
      });

      it("Should NOT close mission if no cv", async () => {
        await expect(
          apiPost.connect(this.addr2).closeMission(1)
        ).to.be.revertedWith("CV not found");
      });

      it("Should NOT close an unknow mission ID", async () => {
        await expect(apiPost.closeMission(2)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("Should NOT close mission twice", async () => {
        await apiPost.closeMission(1);
        await expect(apiPost.closeMission(1)).to.be.revertedWith(
          "Wrong status"
        );
      });
    });
  });

  // describe("Initialization", () => {
  //   it("Ownership should owned by cv", async () => {
  //     expect(await mission.owner()).to.equal(cv.target);
  //   });

  //   it("Should set a mission with worker", async () => {
  //     await _testInitFeature({
  //       mission,
  //       values: { workerAddr: this.addr2.address, isInvite: true },
  //     });
  //   });

  //   it("Should set a mission without worker", async () => {
  //     await _testInitFeature({ mission });
  //   });

  //   it("Should NOT set a mission without worker", async () => {
  //     await expect(
  //       _testInitFeature({
  //         mission,
  //         values: { isInvite: true },
  //       })
  //     ).to.be.revertedWith("You must assign a worker");
  //   });

  //   it("Should get a feature", async () => {
  //     await _testInitFeature({
  //       mission,
  //       values: { description: "its ok" },
  //     });

  //     const feature = await mission.getFeature(0);
  //     expect(feature.description).to.equal("its ok");
  //   });
  //   it("Worker should join feature", async () => {
  //     const _length = parseInt(await cv.getFeaturesLength());
  //     await _testInitFeature({ mission });
  //     await cv.beAssignedWorker(mission.target, _length);
  //     const _newLength = parseInt(await cv.getFeaturesLength());
  //     expect(_length).to.be.equal(_newLength - 1);
  //   });
  // });
});
