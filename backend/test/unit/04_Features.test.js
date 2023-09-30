const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const { _testInitAll } = require("../../helpers/test_init");
const { ZERO_ADDRESS } = require("../../helpers/test_utils");

const CONTRACT_NAME = "FeaturesHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let cvsHub;

  let disputesHub;
  let missionID = 1;
  let contract;
  let apiPost;
  let balancesHub;
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
    const contracts = await _testInitAll();

    cvsHub = contracts.cvs.hub;
    apiPost = contracts.systems.apiPost;
    apiGet = contracts.systems.apiGet;
    balancesHub = contracts.systems.balancesHub;
    contract = contracts.works.featuresHub;
    disputesHub = contracts.escrows.disputesHub;

    await apiPost.createCV("tokenURI");
    await apiPost.connect(this.addr1).createCV("tokenURI");
    await apiPost.connect(this.addr2).createCV("tokenURI");

    const missionPrice = await balancesHub.missionPrice();

    await apiPost.createMission("tokenURI", {
      value: missionPrice.toString(),
    });
  });

  describe("Enterprise", () => {
    it("Should have 0 token", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.equal(0);
    });

    it("Should create feature", async () => {
      await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
        value: "10000000",
      });
      expect(await apiGet.tokensLengthOf(contract.target)).to.equal(1);
      expect(await contract.ownerOf(1)).to.equal(this.owner.address);
    });
    it("Should get feature", async () => {
      await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
        value: "10000000",
      });
      let data = await apiGet.datasOfFeature(1);
      expect(data.id).to.equal(1);
      expect(data.missionID).to.equal(1);
      expect(data.startedAt).to.equal(0);
      expect(data.wadge).to.equal(10000000);
      expect(data.estimatedDays).to.equal(1000);
      expect(data.status).to.equal(0);
      expect(await contract.tokenURI(data.id)).to.equal("tokenURI");
      expect(data.isInviteOnly).to.equal(true);
      expect(data.cvWorker).to.equal(0);
    });

    it("Should validate mission", async () => {
      await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
        value: "10000000",
      });
      await apiPost.inviteWorker(2, 1);
      await apiPost.connect(this.addr1).acceptJob(1);

      await apiPost.validFeature(1);
      let data = await apiGet.datasOfFeature(1);
      expect(data.status).to.be.equal(2);
    });

    describe("NOT WORKS", () => {
      it("Should NOT create feature with wrong bindings", async () => {
        await expect(
          contract.mint(this.owner.address, 1, 1000, 1000, true, "tokenURI", 2)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
      it("Should NOT create feature if not owner of mission", async () => {
        await expect(
          apiPost
            .connect(this.addr1)
            .createFeature(missionID, 1000, true, "tokenURI", 3, {
              value: "10000000",
            })
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT create feature if no value", async () => {
        await expect(
          apiPost.createFeature(missionID, 1000, true, "tokenURI", 2)
        ).to.be.revertedWith("Insuficient value");
      });

      it("Should NOT validate mission twice", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await apiPost.inviteWorker(2, 1);
        await apiPost.connect(this.addr1).acceptJob(1);
        await apiPost.validFeature(1);
        await expect(apiPost.validFeature(1)).to.be.revertedWith(
          "Feature already validated"
        );
      });

      it("Should NOT validate mission if no worker", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await expect(apiPost.validFeature(1)).to.be.revertedWith(
          "Must have a worker"
        );
      });
    });
  });

  describe("Create Feature", () => {
    describe("WORKS", () => {
      it("Should update features length", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        expect(await apiGet.tokensLengthOf(contract.target)).to.equal(1);
      });

      it("Should give ownership of feature to owner", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        expect(await contract.ownerOf(1)).to.equal(this.owner.address);
      });

      it("Should get feature ID", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.id).to.equal(1);
      });

      it("Should get feature mission ID", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);

        expect(data.missionID).to.equal(1);
      });

      it("Should get starter at 0", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.startedAt).to.equal(0);
      });

      it("Should get true wadge", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.wadge).to.equal(10000000);
      });

      it("Should get true estimated days", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.estimatedDays).to.equal(1000);
      });

      it("Should get status at 0", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);

        expect(data.status).to.equal(0);
      });

      it("Should get good token URI", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });

        expect(await contract.tokenURI(1)).to.equal("tokenURI");
      });
      it("Should get true specification", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);

        expect(data.specification).to.equal(3);
      });

      it("Should set true is invite only", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.isInviteOnly).to.equal(true);
      });

      it("Should set false is invite only", async () => {
        await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.isInviteOnly).to.equal(false);
      });

      it("Should get 0 cvWorker", async () => {
        await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
          value: "10000000",
        });
        let data = await apiGet.datasOfFeature(1);
        expect(data.cvWorker).to.equal(0);
      });
      it("Should update mission data", async () => {
        let data = await apiGet.datasOfMission(1);
        expect(data.features.length).to.equal(0);
        await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
          value: "10000000",
        });
        data = await apiGet.datasOfMission(1);
        expect(data.features.length).to.equal(1);
        expect(data.features[0]).to.be.equal(1);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT create feature with wrong bindings", async () => {
        await expect(
          contract.mint(this.owner.address, 1, 1000, 1000, true, "tokenURI", 3)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
      it("Should NOT create feature if not owner of mission", async () => {
        await expect(
          apiPost
            .connect(this.addr1)
            .createFeature(missionID, 1000, true, "tokenURI", 3, {
              value: "10000000",
            })
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT create feature for centralized court", async () => {
        await expect(
          apiPost.createFeature(missionID, 1000, true, "tokenURI", 0, {
            value: "10000000",
          })
        ).to.be.revertedWith("Unvalid specification");
      });

      it("Should NOT create feature for kleros court", async () => {
        await expect(
          apiPost.createFeature(missionID, 1000, true, "tokenURI", 1, {
            value: "10000000",
          })
        ).to.be.revertedWith("Unvalid specification");
      });
      it("Should NOT create feature for unknow court", async () => {
        await expect(
          apiPost.createFeature(missionID, 1000, true, "tokenURI", 72, {
            value: "10000000",
          })
        ).to.be.reverted;
      });

      it("Should NOT create feature if no value", async () => {
        await expect(
          apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
            value: "0",
          })
        ).to.be.revertedWith("Insuficient value");
      });

      it("Should NOT create feature for unknow mission ID", async () => {
        await expect(
          apiPost.createFeature(4, 1000, true, "tokenURI", 3, {
            value: "10000000",
          })
        ).to.be.revertedWith("ERC721: invalid token ID");
      });

      it("Should NOT create feature if no cv", async () => {
        await expect(
          apiPost
            .connect(this.addr4)
            .createFeature(1, 1000, true, "tokenURI", 3, {
              value: "10000000",
            })
        ).to.be.revertedWith("CV not found");
      });

      it("Should NOT create feature if mission closed", async () => {
        await apiPost.closeMission(1);
        await expect(
          apiPost.createFeature(1, 1000, true, "tokenURI", 3, {
            value: "10000000",
          })
        ).to.be.revertedWith("Mission closed");
      });
    });
  });

  describe("Invite Worker", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
        value: "10000000",
      });
    });

    it("Should invite worker", async () => {
      await apiPost.inviteWorker(2, 1);
      let data = await apiGet.datasOfFeature(1);
      expect(data.cvWorker).to.be.equal(2);

      const collecterData = await apiGet.datasOfWork(1);
      expect(collecterData.missionID).to.be.equal(data.missionID);
    });

    describe("NOT WORKS", () => {
      it("Should NOT invite worker if mission validated", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await apiPost.inviteWorker(2, 1);
        await apiPost.connect(this.addr1).acceptJob(1);
        await apiPost.validFeature(1);
        await expect(apiPost.inviteWorker(2, 1)).to.be.revertedWith(
          "Wrong feature status"
        );
      });

      it("Should NOT invite worker if not owner", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await expect(
          apiPost.connect(this.addr1).inviteWorker(2, 1)
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT invite worker if feature didn't exist", async () => {
        await expect(apiPost.inviteWorker(2, 2)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });

      it("Should NOT invite yourself for worker", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await expect(apiPost.inviteWorker(1, 1)).to.be.revertedWith(
          "Can't assign yourself"
        );
      });
    });
  });

  describe("Worker accept / decline feature", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
        value: "10000000",
      });
    });

    it("Should worker accept job & update datas hub", async () => {
      await apiPost.inviteWorker(2, 1);
      await apiPost.connect(this.addr1).acceptJob(1);
      let data = await apiGet.datasOfFeature(1);
      expect(data.startedAt).to.not.be.equal(0);
      expect(data.cvWorker).to.be.equal(2);
    });
    it("Should worker accept job & update collecter", async () => {
      await apiPost.inviteWorker(2, 1);
      await apiPost.connect(this.addr1).acceptJob(1);
      const collecterData = await apiGet.datasOfWork(1);
      expect(collecterData.workerAcceptJob).to.be.equal(true);
      expect(collecterData.workerDemand.length).to.be.equal(0);
      expect(collecterData.signedWorker).to.be.equal(2);
    });

    it("Should worker decline job", async () => {
      await apiPost.inviteWorker(2, 1);
      await apiPost.connect(this.addr1).declineJob(1);
      const data = await apiGet.datasOfFeature(1);
      expect(data.cvWorker).to.be.equal(0);
    });

    describe("NOT WORKS", () => {
      it("Should NOT accept job if not worker", async () => {
        await apiPost.inviteWorker(2, 1);
        await expect(apiPost.acceptJob(1)).to.be.revertedWith("Not the worker");
      });
      it("Should NOT accept job if feature didn't exist", async () => {
        await expect(apiPost.acceptJob(2)).to.be.revertedWith(
          "Feature ID out of range"
        );
      });

      it("Should NOT accept job twice", async () => {
        await apiPost.inviteWorker(2, 1);
        await apiPost.connect(this.addr1).acceptJob(1);
        await expect(
          apiPost.connect(this.addr1).acceptJob(1)
        ).to.be.revertedWith("Feature already start");
      });

      it("Should NOT accept if no worker assign", async () => {
        await expect(
          apiPost.connect(this.addr1).acceptJob(1)
        ).to.be.revertedWith("Not the worker");
      });

      it("Should NOT decline if was no worker", async () => {
        await expect(
          apiPost.connect(this.addr2).declineJob(1)
        ).to.be.revertedWith("Not the worker");
      });

      it("Should NOT decline after accept", async () => {
        await apiPost.inviteWorker(2, 1);
        await apiPost.connect(this.addr1).acceptJob(1);

        await expect(
          apiPost.connect(this.addr1).declineJob(1)
        ).to.be.revertedWith("Feature already start");
      });
    });
  });

  describe("Sign worker", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
        value: "10000000",
      });
    });

    it("Should sign worker & update datas hub", async () => {
      await apiPost.connect(this.addr1).askToJoin(1);
      await apiPost.signWorker(1, 2);

      let data = await apiGet.datasOfFeature(1);
      expect(data.startedAt).to.not.be.equal(0);
      expect(data.cvWorker).to.be.equal(2);
    });

    it("Should sign worker & update datas collecter", async () => {
      await apiPost.connect(this.addr1).askToJoin(1);
      await apiPost.signWorker(1, 2);

      let data = await apiGet.datasOfWork(1);
      expect(data.signedWorker).to.be.equal(2);
      expect(data.workerAcceptJob).to.be.equal(true);
      expect(data.workerDemand.length).to.be.equal(0);
    });

    describe("NOT WORKS", () => {
      it("Should NOT sign worker if wasn't owner", async () => {
        await apiPost.connect(this.addr1).askToJoin(1);
        await expect(
          apiPost.connect(this.addr1).signWorker(1, 2)
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT sign worker if worker don't ask", async () => {
        await expect(apiPost.signWorker(1, 2)).to.be.revertedWith(
          "Demand not found"
        );
      });

      it("Should NOT sign worker if already have worker", async () => {
        await apiPost.connect(this.addr1).askToJoin(1);

        await apiPost.signWorker(1, 2);
        await expect(
          apiPost.connect(this.addr2).askToJoin(1)
        ).to.be.revertedWith("Already have worker");
      });
    });
  });

  describe("Worker ask to join", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
        value: "10000000",
      });
    });

    it("Should worker can ask to join", async () => {
      await apiPost.connect(this.addr1).askToJoin(1);
      const collecterData = await apiGet.datasOfWork(1);
      expect(collecterData.workerDemand.length).to.be.equal(1);
      expect(collecterData.workerAcceptJob).to.be.equal(false);
      expect(collecterData.signedWorker).to.be.equal(0);
      let data = await apiGet.datasOfFeature(1);
      expect(data.cvWorker).to.be.equal(0);
    });

    it("Should owner can sign worker who ask join", async () => {
      await apiPost.connect(this.addr1).askToJoin(1);
      await apiPost.signWorker(1, 2);
      const collecterData = await apiGet.datasOfWork(1);
      expect(collecterData.workerDemand.length).to.be.equal(0);
      expect(collecterData.workerAcceptJob).to.be.equal(true);
      expect(collecterData.signedWorker).to.be.equal(2);
      let data = await apiGet.datasOfFeature(1);
      expect(data.cvWorker).to.be.equal(2);
      expect(data.startedAt).to.not.be.equal(0);
    });

    describe("NOT WORKS", () => {
      it("Should NOT ask to join if is on invite only", async () => {
        await apiPost.createFeature(missionID, 1000, true, "tokenURI", 3, {
          value: "10000000",
        });
        await expect(
          apiPost.connect(this.addr1).askToJoin(2)
        ).to.be.revertedWith("Only on invitation");
        const collecterData = await apiGet.datasOfWork(2);
        expect(collecterData.workerDemand.length).to.be.equal(0);
        let data = await apiGet.datasOfFeature(2);
        expect(data.cvWorker).to.be.equal(0);
      });

      it("Should NOT ask to join if feature didn't exist", async () => {
        await expect(
          apiPost.connect(this.addr1).askToJoin(2)
        ).to.be.revertedWith("Feature ID out of range");
      });

      it("Should NOT ask to join if it's own feature", async () => {
        await expect(apiPost.askToJoin(1)).to.be.revertedWith(
          "Can't ask to join for own feature"
        );
      });

      it("Should NOT ask to join if feature already have worker", async () => {
        await apiPost.connect(this.addr1).askToJoin(1);
        await apiPost.signWorker(1, 2);
        await expect(
          apiPost.connect(this.addr2).askToJoin(1)
        ).to.be.revertedWith("Already have worker");
      });

      it("Should NOT ask to join if no CV", async () => {
        await apiPost.connect(this.addr1).askToJoin(1);
        await expect(
          apiPost.connect(this.addr3).askToJoin(1)
        ).to.be.revertedWith("CV not found");
      });
    });
  });

  describe("Validate feature", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
        value: "10000000",
      });
      await apiPost.connect(this.addr1).askToJoin(1);
      await apiPost.signWorker(1, 2);
    });

    describe("WORKS", () => {
      it("Should update status", async () => {
        await apiPost.validFeature(1);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should update after improveFeature", async () => {
        await apiPost.improveFeature(1, 30000);
        await apiPost.validFeature(1);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should update after contestFeature", async () => {
        const reclamationPeriod = await disputesHub.MIN_RECLAMATION_PERIOD();
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await apiPost.validFeature(1);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should validate feature by worker if calc estimated days < 0", async () => {
        await apiPost.improveFeature(1, 0);
        await apiPost.connect(this.addr1).validFeature(1);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should update arbitrators length", async () => {
        await apiPost.validFeature(1);

        let length = await apiGet.lengthOfArbitrators();
        expect(length).to.be.equal(1);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT validate feature if no worker or owner", async () => {
        await expect(
          apiPost.connect(this.addr2).validFeature(1)
        ).to.be.revertedWith("Link to feature not found");
      });
      it("Should NOT validate feature if cv didn't exist", async () => {
        await expect(
          apiPost.connect(this.addr3).validFeature(1)
        ).to.be.revertedWith("CV not found");
      });
      it("Should NOT validate an unknow feature ID", async () => {
        await expect(apiPost.validFeature(2)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });
      it("Should NOT validate twice", async () => {
        await apiPost.validFeature(1);
        await expect(apiPost.validFeature(1)).to.be.revertedWith(
          "Feature already validated"
        );
      });
      it("Should NOT set improve status", async () => {
        await apiPost.validFeature(1);
        await expect(apiPost.improveFeature(1, 40000)).to.be.revertedWith(
          "Wrong feature status"
        );
      });
      it("Should NOT set contest status", async () => {
        const reclamationPeriod = await disputesHub.MIN_RECLAMATION_PERIOD();

        await apiPost.validFeature(1);
        await expect(
          apiPost.contestFeature(
            1,
            parseInt(reclamationPeriod) + 20,
            2,
            "tokenURI"
          )
        ).to.be.revertedWith("Wrong feature status");
      });

      it("Should NOT update after contestFeature", async () => {
        const reclamationPeriod = await disputesHub.MIN_RECLAMATION_PERIOD();
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await expect(
          apiPost.connect(this.addr1).validFeature(1)
        ).to.be.revertedWith("Must wait end of litigation");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should NOT validate feature by worker if calc estimated days > 0", async () => {
        await expect(
          apiPost.connect(this.addr1).validFeature(1)
        ).to.be.revertedWith("Must wait end of feature");
      });
    });
  });

  describe("Contest feature", () => {
    let reclamationPeriod;

    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
        value: "10000000",
      });
      await apiPost.connect(this.addr1).askToJoin(1);
      let cvWorker = await cvsHub.cvOf(this.addr1);
      await apiPost.signWorker(1, cvWorker);
      reclamationPeriod = await disputesHub.MIN_RECLAMATION_PERIOD();
    });

    describe("WORKS", () => {
      it("Should update status", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should update owner contest", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        let data = await apiGet.datasOfWork(1);
        expect(data.workerContest).to.be.equal(false);
        expect(data.ownerContest).to.be.equal(true);
      });

      it("Should update disputesHub length", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );

        expect(await disputesHub.tokensLength()).to.be.equal(1);
      });

      it("Should update worker contest", async () => {
        await apiPost
          .connect(this.addr1)
          .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI");
        let data = await apiGet.datasOfWork(1);
        expect(data.workerContest).to.be.equal(true);
        expect(data.ownerContest).to.be.equal(false);
      });

      it("Should update after improveFeature", async () => {
        await apiPost.improveFeature(1, 30000);
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should contest feature by worker", async () => {
        await apiPost
          .connect(this.addr1)
          .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should validate by owner after contest", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await apiPost.validFeature(1);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT contest feature twice by owner", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await expect(
          apiPost.contestFeature(
            1,
            parseInt(reclamationPeriod) + 20,
            2,
            "tokenURI"
          )
        ).to.be.revertedWith("Already contest");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });
      it("Should NOT contest feature twice by worker", async () => {
        await apiPost
          .connect(this.addr1)
          .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI");
        await expect(
          apiPost
            .connect(this.addr1)
            .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI")
        ).to.be.revertedWith("Already contest");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });
      it("Should NOT contest feature if validated by owner", async () => {
        await apiPost.validFeature(1);

        await expect(
          apiPost.contestFeature(
            1,
            parseInt(reclamationPeriod) + 20,
            2,
            "tokenURI"
          )
        ).to.be.revertedWith("Wrong feature status");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should NOT contest feature by owner & worker", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );

        await expect(
          apiPost
            .connect(this.addr1)
            .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI")
        ).to.be.revertedWith("Dispute already added");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should NOT contest feature if validated by worker", async () => {
        await apiPost.improveFeature(1, 0);
        let _data = await apiGet.datasOfFeature(1);
        expect(_data.cvWorker).to.be.equal(2);
        await apiPost.connect(this.addr1).validFeature(1);

        await expect(
          apiPost.contestFeature(
            1,
            parseInt(reclamationPeriod) + 20,
            2,
            "tokenURI"
          )
        ).to.be.revertedWith("Wrong feature status");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(2);
      });

      it("Should NOT contest an unknow feature ID", async () => {
        await expect(
          apiPost.contestFeature(
            2,
            parseInt(reclamationPeriod) + 20,
            2,
            "tokenURI"
          )
        ).to.be.revertedWith("Feature ID out of range");
      });
      it("Should NOT contest feature if no worker or owner", async () => {
        await expect(
          apiPost
            .connect(this.addr2)
            .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI")
        ).to.be.revertedWith("Must call by owner or worker");
      });

      it("Should NOT validate by worker after contest", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await expect(
          apiPost.connect(this.addr1).validFeature(1)
        ).to.be.revertedWith("Must wait end of litigation");
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(3);
      });

      it("Should NOT contest feature if cv didn't exist", async () => {
        await expect(
          apiPost
            .connect(this.addr3)
            .contestFeature(1, parseInt(reclamationPeriod) + 20, 2, "tokenURI")
        ).to.be.revertedWith("CV not found");
      });

      it("Should NOT set improve status after contest", async () => {
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await expect(apiPost.improveFeature(1, 40000)).to.be.revertedWith(
          "Wrong feature status"
        );
      });
    });
  });

  describe("Improve feature", () => {
    beforeEach(async () => {
      await apiPost.createFeature(missionID, 1000, false, "tokenURI", 3, {
        value: "10000000",
      });
      await apiPost.connect(this.addr1).askToJoin(1);
      await apiPost.signWorker(1, 2);
    });

    describe("WORKS", () => {
      it("Should update status", async () => {
        await apiPost.improveFeature(1, 20000);
        let data = await apiGet.datasOfFeature(1);
        expect(data.status).to.be.equal(1);
      });
      it("Should update estimated days", async () => {
        let data = await apiGet.datasOfFeature(1);
        await apiPost.improveFeature(1, 20000);
        data = await apiGet.datasOfFeature(1);
      });
    });

    describe("NOT WORKS", () => {
      it("Should NOT improve if wasn't owner", async () => {
        await expect(
          apiPost.connect(this.addr2).improveFeature(1, 20000)
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT improve by worker", async () => {
        await expect(
          apiPost.connect(this.addr1).improveFeature(1, 20000)
        ).to.be.revertedWith("Not the owner");
      });

      it("Should NOT improve an unknow feature ID", async () => {
        await expect(apiPost.improveFeature(2, 20000)).to.be.revertedWith(
          "ERC721: invalid token ID"
        );
      });

      it("Should NOT improve a validated feature ID", async () => {
        await apiPost.validFeature(1);
        await expect(apiPost.improveFeature(1, 20000)).to.be.revertedWith(
          "Wrong feature status"
        );
      });

      it("Should NOT improve a contest feature ID", async () => {
        const reclamationPeriod = await disputesHub.MIN_RECLAMATION_PERIOD();
        await apiPost.contestFeature(
          1,
          parseInt(reclamationPeriod) + 20,
          2,
          "tokenURI"
        );
        await expect(apiPost.improveFeature(1, 20000)).to.be.revertedWith(
          "Wrong feature status"
        );
      });

      it("Should NOT improve feature twice", async () => {
        await apiPost.improveFeature(1, 20000);
        await expect(apiPost.improveFeature(1, 20000)).to.be.revertedWith(
          "Wrong feature status"
        );
      });
    });
  });
});
