const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitAll,
  _testInitArbitrator,
  _testInitFeature,
  getContractAt,
} = require("../../helpers/test_init");
const { ZERO_ADDRESS, getAccount } = require("../../helpers/test_utils");

const CONTRACT_NAME = "DisputesHub";

describe.only(`Contract ${CONTRACT_NAME} `, () => {
  let addressHub;
  let contract;
  let accessControl;
  let cvHub;
  let featuresHub;
  let collecter;
  let contracts;
  let featureID;
  let arbitratorsHub;
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
      this.addr8,
      this.addr9,
      this.addr10,
      this.addr11,
      this.addr12,
      this.addr13,
      this.addr14,
      this.addr15,
      this.addr16,
      this.addr17,
      this.addr18,
      this.addr19,
      this.addr20,
    ] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
    contracts = await _testInitAll();
    addressHub = contracts.addressHub;
    accessControl = contracts.accessControl;
    cvHub = contracts.cvHub;
    featuresHub = contracts.featuresHub;
    contract = contracts.disputesHub;
    collecter = contracts.collecterWorkInteraction;
    arbitratorsHub = contracts.arbitratorsHub;
    // return;
    await accessControl.createCV("_tokenURI");
    await accessControl.connect(this.addr1).createCV("_tokenURI");
    await accessControl.connect(this.addr2).createCV("_tokenURI");
    featureID = await _testInitFeature(contracts, {}, this.addr1);
  });

  describe("Initialization", () => {
    describe("WORKS", () => {
      it("DisputesHub : should have featureID", async () => {
        expect(featureID > 0).to.equal(true);
      });
      it("DisputesHub : should have 0 tokens", async () => {
        expect(await contract.getTokensLength()).to.equal(0);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT works without proxy bindings", async () => {
        await expect(
          contract.mint(
            this.addr1.address,
            featureID,
            3,
            1000,
            10,
            "disputesURI"
          )
        ).to.be.revertedWith("Must call by proxy bindings");
      });

      it("Should NOT get address of unexisting token", async () => {
        await expect(contract.addressOf(1)).to.be.revertedWith(
          "Dispute not found"
        );
      });

      it("Should NOT get dispute of unexisting contest", async () => {
        await expect(contract.disputeOf(featureID)).to.be.revertedWith(
          "Dispute not found"
        );
      });
    });
  });

  describe("Create dispute", () => {
    let reclamationPeriod;
    beforeEach(async () => {
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();
    });
    describe("WORKS", () => {
      it("contestFeature : should create new dispute", async () => {
        await collecter.contestFeature(
          featureID,
          reclamationPeriod,
          3,
          "tokenURI"
        );
        let length = await contract.getTokensLength();
        expect(length).to.equal(1);
      });
      it("contestFeature : should get address of new dispute", async () => {
        await collecter.contestFeature(
          featureID,
          reclamationPeriod,
          3,
          "tokenURI"
        );
        let id = await contract.getTokensLength();
        let address = await contract.addressOf(id);
        expect(address).to.not.equal(ZERO_ADDRESS);
      });
      it("contestFeature : should get id of new dispute with featureID", async () => {
        await collecter.contestFeature(
          featureID,
          reclamationPeriod,
          3,
          "tokenURI"
        );
        let id = await contract.getTokensLength();
        let id2 = await contract.disputeOf(featureID);
        expect(id).to.be.equal(id2);
      });
    });
    describe("NOT WORKS", () => {
      it("should NOT create new dispute with reclamation period < Min", async () => {
        await expect(
          collecter.contestFeature(
            featureID,
            parseInt(reclamationPeriod) - 10,
            3,
            "tokenURI"
          )
        ).to.be.revertedWith("Invalid reclamation period");
      });
      it("should NOT create new dispute with reclamationPeriod > Max", async () => {
        let _reclamationPeriod = await contract.MAX_RECLAMATION_PERIOD();

        await expect(
          collecter.contestFeature(
            featureID,
            parseInt(_reclamationPeriod) + 10,
            3,
            "tokenURI"
          )
        ).to.be.revertedWith("Invalid reclamation period");
      });
    });
  });

  describe("Dispute Contract", () => {
    let dispute;
    let disputeID;
    let nbArbitrators = 3;
    let reclamationPeriod;
    let tokenURI = "disputesURI";
    beforeEach(async () => {
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();
      await collecter.contestFeature(
        featureID,
        reclamationPeriod,
        nbArbitrators,
        tokenURI
      );
      disputeID = await contract.getTokensLength();
      let address = await contract.addressOf(disputeID);
      expect(address).to.not.equal(ZERO_ADDRESS);
      dispute = await getContractAt("Dispute", address);
    });
    describe("WORKS", () => {
      it("data : should update id", async () => {
        let data = await dispute.data();
        expect(data.id).to.equal(disputeID);
      });

      it("data : should update reclamationPeriod", async () => {
        let data = await dispute.data();
        expect(data.reclamationPeriod).to.equal(reclamationPeriod);
      });

      it("data : should update value", async () => {
        let data = await dispute.data();
        let featureData = await featuresHub.getData(featureID);
        expect(data.value).to.equal(featureData.wadge);
      });

      it("data : should have centralized courtID if not enough arbitrators", async () => {
        let data = await dispute.data();
        expect(data.courtID).to.equal(0);
      });

      it("data : should have new address dispute", async () => {
        const accounts = [this.addr3, this.addr4, this.addr5, this.addr6];

        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          await accessControl.connect(account).createCV("_tokenURI");
          let _featureID = await _testInitFeature(contracts, {}, account);
          await featuresHub.validFeature(_featureID);
          let value = 0.3 * index + 0.1;
          let price = ethers.parseEther(`${value}`);

          await arbitratorsHub
            .connect(account)
            .investOnCourt(3, { value: `${price}` });
        }

        let _featureID = await _testInitFeature(contracts, {}, this.addr1);

        await collecter.contestFeature(
          _featureID,
          reclamationPeriod,
          nbArbitrators,
          tokenURI
        );
        let _disputeID = await contract.getTokensLength();
        let address = await contract.addressOf(_disputeID);
        expect(address).to.not.equal(ZERO_ADDRESS);
      });

      it("data : should have true courtID if enough arbitrators", async () => {
        const accounts = [
          this.addr3,

          this.addr4,
          this.addr5,
          this.addr6,
          this.addr7,

          //   this.addr20,
        ];

        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          await accessControl.connect(account).createCV("_tokenURI");
          let _featureID = await _testInitFeature(contracts, {}, account);
          await featuresHub.validFeature(_featureID);
          let value = 0.3 * index + 0.1;
          let price = ethers.parseEther(`${value}`);

          await arbitratorsHub
            .connect(account)
            .investOnCourt(3, { value: `${price}` });
        }

        let _featureID = await _testInitFeature(contracts, {}, this.addr1);

        await collecter.contestFeature(
          _featureID,
          reclamationPeriod,
          nbArbitrators,
          tokenURI
        );
        let _disputeID = await contract.getTokensLength();
        let address = await contract.addressOf(_disputeID);

        expect((await arbitratorsHub.getCourtLength(3)) > 3).to.equal(true);
        let _dispute = await getContractAt("Dispute", address);
        let data = await _dispute.data();
        expect(data.courtID).to.equal(3);
      });

      it("data : should have good nbArbitrators", async () => {
        const accounts = [
          this.addr3,

          this.addr4,
          this.addr5,
          this.addr6,
          this.addr7,
          this.addr8,
          this.addr9,

          //   this.addr20,
        ];

        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          await accessControl.connect(account).createCV("_tokenURI");
          let _featureID = await _testInitFeature(contracts, {}, account);
          await featuresHub.validFeature(_featureID);
          let value = 0.3 * index + 0.1;
          let price = ethers.parseEther(`${value}`);

          await arbitratorsHub
            .connect(account)
            .investOnCourt(3, { value: `${price}` });
        }

        let _featureID = await _testInitFeature(contracts, {}, this.addr1);

        await collecter.contestFeature(
          _featureID,
          reclamationPeriod,
          nbArbitrators,
          tokenURI
        );
        let _disputeID = await contract.getTokensLength();
        let address = await contract.addressOf(_disputeID);

        let _dispute = await getContractAt("Dispute", address);
        let data = await _dispute.data();

        expect(data.nbArbitrators).to.equal(3);

        let arbitrators = await _dispute.getArbitrators();
        expect(arbitrators.length).to.equal(0);
      });

      it("data : should update payeeID", async () => {
        let data = await dispute.data();
        let featureData = await featuresHub.getData(featureID);
        expect(data.payeeID).to.equal(featureData.cvWorker);
      });

      it("data : should update payerID", async () => {
        let data = await dispute.data();
        let owner = await featuresHub.ownerOf(featureID);
        let cvOwner = await cvHub.getCV(owner);
        expect(data.payerID).to.equal(cvOwner);
      });

      it("data : should update tokenURI", async () => {
        let data = await dispute.data();
        expect(data.tokenURI).to.equal(tokenURI);
      });

      it("data : should have 0 createdAt", async () => {
        let data = await dispute.data();
        expect(data.createdAt).to.equal(0);
      });

      it("data : should have 0 resolvedAt", async () => {
        let data = await dispute.data();
        expect(data.resolvedAt).to.equal(0);
      });

      it("data : should have 0 reclaimedAt", async () => {
        let data = await dispute.data();
        expect(data.reclaimedAt).to.equal(0);
      });

      it("data : should have appeal false", async () => {
        let data = await dispute.data();
        expect(data.appeal).to.equal(false);
      });
    });
    describe("NOT WORKS", () => {
      it("should NOT update numbers arbitrators if no 3 arbitrators on Court", async () => {
        let data = await dispute.data();
        expect(data.nbArbitrators).to.not.equal(nbArbitrators);
        expect(data.nbArbitrators).to.equal(0);
      });
    });
  });

  describe("Dispute Contract : Accept Arbitration", () => {
    let dispute;
    let disputeID;
    let nbArbitrators = 3;
    let reclamationPeriod;
    let tokenURI = "disputesURI";
    let accounts;
    beforeEach(async () => {
      accounts = [
        this.addr3,

        this.addr4,
        this.addr5,
        this.addr6,
        this.addr7,
        this.addr8,
        this.addr9,
        this.addr10,
        this.addr11,
        this.addr12,
        this.addr13,
        this.addr14,
        this.addr15,
        this.addr16,
        this.addr17,
        this.addr18,

        //   this.addr20,
      ];
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();

      for (let index = 0; index < accounts.length; index++) {
        const account = accounts[index];
        await accessControl.connect(account).createCV("_tokenURI");
        let _featureID = await _testInitFeature(contracts, {}, account);

        await featuresHub.validFeature(_featureID);
        let value = 0.3 * index + 0.1;
        let price = ethers.parseEther(`${value}`);

        await arbitratorsHub
          .connect(account)
          .investOnCourt(3, { value: `${price}` });
      }
      await collecter.contestFeature(
        featureID,
        reclamationPeriod,
        nbArbitrators,
        tokenURI
      );
      disputeID = await contract.getTokensLength();
      let address = await contract.addressOf(disputeID);

      dispute = await getContractAt("Dispute", address);
    });
    describe("WORKS", () => {
      it("acceptArbitration : Should can accept arbitration", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }

        async () => {
          let allowed;
          for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            addrs.filter((el) => {
              if (el.addr == account.address) {
                async () => await dispute.connect(account).acceptArbitration();
                allowed = async () =>
                  await dispute.hisAllowance(el.arbitratorID);
              }
            });
          }
        };
      });

      it("acceptArbitration : Should update allowance", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let account = getAccount(accounts, addrs[0].addr);
        let cvID = await cvHub.getCV(account[0].address);
        let arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).acceptArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(3);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).acceptArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(3);

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).acceptArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(3);
      });

      it("acceptArbitration : Should update arbritators length", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);
        let arbitrators = await dispute.getArbitrators();
        expect(arbitrators.length).to.equal(0);

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        arbitrators = await dispute.getArbitrators();
        expect(arbitrators.length).to.equal(1);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        arbitrators = await dispute.getArbitrators();
        expect(arbitrators.length).to.equal(2);

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        arbitrators = await dispute.getArbitrators();
        expect(arbitrators.length).to.equal(3);

        expect(await dispute.status()).to.equal(2);
      });

      it("acceptArbitration : Should update dispute status", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.status()).to.equal(2);
      });
    });
    describe("NOT WORKS", () => {
      it("Should can NOT accept arbitration if haven't arbitrator", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }
        await expect(dispute.acceptArbitration()).to.be.revertedWith(
          "Arbitration not found"
        );
      });

      it("Should can NOT accept arbitration if no CV", async () => {
        await expect(
          dispute.connect(this.addr19).acceptArbitration()
        ).to.be.revertedWith("CV not found");
      });

      it("Should can NOT accept arbitration if status != Initial", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);
        let account = getAccount(accounts, addrs[0].addr);

        await dispute.connect(account[0]).acceptArbitration();
        account = getAccount(accounts, addrs[1].addr);

        await dispute.connect(account[0]).acceptArbitration();
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        account = getAccount(accounts, addrs[3].addr);

        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Invalid status");
        account = getAccount(accounts, addrs[4].addr);
        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Invalid status");
        account = getAccount(accounts, addrs[5].addr);
        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Invalid status");
      });

      it("Should can NOT accept arbitration twice", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });

      it("Should can NOT accept arbitration after refused arbitration", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).refuseArbitration();
        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });

      it("Should can NOT accept arbitration if not invited", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 0) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }

        let account = getAccount(accounts, addrs[0].addr);

        await expect(
          dispute.connect(account[0]).acceptArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });
    });
  });

  describe("Dispute Contract : Vote", () => {
    let dispute;
    let disputeID;
    let nbArbitrators = 3;
    let reclamationPeriod;
    let tokenURI = "disputesURI";
    let accounts;
    let addrs;

    beforeEach(async () => {
      accounts = [
        this.addr3,

        this.addr4,
        this.addr5,
        this.addr6,
        this.addr7,
        this.addr8,
        this.addr9,
        this.addr10,
        this.addr11,
        this.addr12,
        this.addr13,
        this.addr14,
        this.addr15,
        this.addr16,
        this.addr17,
        this.addr18,

        //   this.addr20,
      ];
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();

      for (let index = 0; index < accounts.length; index++) {
        const account = accounts[index];
        await accessControl.connect(account).createCV("_tokenURI");
        let _featureID = await _testInitFeature(contracts, {}, account);

        await featuresHub.validFeature(_featureID);
        let value = 0.3 * index + 0.1;
        let price = ethers.parseEther(`${value}`);

        await arbitratorsHub
          .connect(account)
          .investOnCourt(3, { value: `${price}` });
      }
      await collecter.contestFeature(
        featureID,
        reclamationPeriod,
        nbArbitrators,
        tokenURI
      );
      disputeID = await contract.getTokensLength();
      let address = await contract.addressOf(disputeID);

      dispute = await getContractAt("Dispute", address);
      let data = await dispute.data();
      let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
      addrs = [];

      for (let index = 1; index <= courtLength; index++) {
        let allowed = await dispute.hisAllowance(index);

        if (allowed == 1) {
          const address = await arbitratorsHub.ownerOf(index);

          addrs.push({ addr: address, arbitratorID: index });

          if (addrs.length > data.nbArbitrators) {
            break;
          }
        }
      }
    });

    describe("WORKS", () => {
      it("vote : Should update vote status", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        await dispute.connect(account[0]).vote(3);
        await expect(dispute.connect(account[0]).vote(3)).to.be.revertedWith(
          "Already voted"
        );
      });

      it("vote : Should update dispute status if voteLength == nbArbitrators", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.status()).to.equal(2);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);
        expect(await dispute.status()).to.equal(3);
      });

      it("vote : Should update decision if voteLength == nbArbitrators", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(2);

        expect(await dispute.decision()).to.equal(2);
      });

      it("vote : Should have true decision if voteLength == nbArbitrators", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);

        expect(await dispute.decision()).to.equal(3);
      });

      it("vote : Should update wadge feature data", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);

        let data = await featuresHub.getData(featureID);
        expect(data.wadge).to.be.equal(0);
      });

      it("vote : Should update balance of winner", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        let _accounts = [this.addr1, this.owner];
        await dispute.connect(account[0]).acceptArbitration();
        let data = await dispute.data();
        let winner = await cvHub.ownerOf(data.payeeID);
        let winnerAccount = getAccount(_accounts, winner)[0];

        let balance = await winnerAccount.provider.getBalance(winner);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);
        let _balance = await winnerAccount.provider.getBalance(winner);
        expect(balance < _balance).to.equal(true);
      });

      it("vote : Should haven't winner if vote equal", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(1);

        expect(await dispute.decision()).to.equal(1);
      });

      it("vote : Should update data resolvedAt if voteLength == nbArbitrators", async () => {
        let data = await dispute.data();
        expect(data.resolvedAt).to.equal(0);
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(2);

        data = await dispute.data();
        expect(data.resolvedAt).to.not.equal(0);
      });

      it("vote : Should update feature data status to Validated", async () => {
        let data = await dispute.data();
        expect(data.resolvedAt).to.equal(0);
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(2);

        data = await featuresHub.getData(featureID);
        expect(data.status).to.equal(2);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT update if vote status == Waiting", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        await expect(dispute.connect(account[0]).vote(0)).to.be.revertedWith(
          "Invalid ruling vote"
        );
      });

      it("Should NOT update vote if status != Disputed", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await expect(dispute.connect(account[0]).vote(0)).to.be.revertedWith(
          "Invalid status"
        );
      });

      it("Should NOT update vote if no arbitrator", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        await expect(dispute.vote(0)).to.be.revertedWith(
          "Arbitration not found"
        );
      });

      it("Should NOT update vote if no cv", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        await expect(dispute.connect(this.addr19).vote(0)).to.be.revertedWith(
          "CV not found"
        );
      });

      it("Should NOT update vote twice ", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();

        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();

        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        await expect(dispute.connect(account[0]).vote(2)).to.be.revertedWith(
          "Already voted"
        );
      });

      it("Should NOT update vote if not  accepted", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();
        let status = await dispute.status();

        expect(status).to.equal(2);
        account = getAccount(accounts, addrs[3].addr);

        await expect(dispute.connect(account[0]).vote(0)).to.be.revertedWith(
          "Invalid arbitrator status"
        );
      });

      it("Should NOT vote if dispute status == Resolved", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);

        await expect(dispute.connect(account[0]).vote(3)).to.be.revertedWith(
          "Invalid status"
        );
      });

      it("Should NOT update balance", async () => {
        let account = getAccount(accounts, addrs[0].addr);
        let _accounts = [this.addr1, this.owner];
        await dispute.connect(account[0]).acceptArbitration();
        let data = await dispute.data();
        let winner = await cvHub.ownerOf(data.payeeID);
        let winner1 = await cvHub.ownerOf(data.payerID);
        let winnerAccount = getAccount(_accounts, winner)[0];

        let balance = await winnerAccount.provider.getBalance(winner);
        let balance1 = await winnerAccount.provider.getBalance(winner1);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        await dispute.connect(account[0]).vote(3);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(1);

        let _balance = await winnerAccount.provider.getBalance(winner);
        let _balance1 = await winnerAccount.provider.getBalance(winner1);

        expect(balance).to.equal(_balance);
        expect(balance1).to.equal(_balance1);
      });

      it("Should NOT update feature data status to Validated", async () => {
        let data = await featuresHub.getData(featureID);

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();
        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // expect(await dispute.decision()).to.equal(0);
        await dispute.connect(account[0]).vote(2);
        account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).vote(1);
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).vote(3);

        let _data = await featuresHub.getData(featureID);
        expect(data.status).to.equal(_data.status);
      });
    });
  });

  describe("DisputeHub : Metaevidence", () => {
    let addrs;
    let featureID;
    beforeEach(async () => {
      featureID = await _testInitFeature(contracts, {}, this.addr1);
    });

    describe("WORKS", () => {
      it("vote : Should get metaevidence", async () => {
        let metaevidence = await contract.metaevidence(featureID);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT update if vote status == Waiting", async () => {
        // let account = getAccount(accounts, addrs[0].addr);
        // await dispute.connect(account[0]).acceptArbitration();
        // // New arbitre
        // account = getAccount(accounts, addrs[1].addr);
        // await dispute.connect(account[0]).acceptArbitration();
        // // New arbitre
        // account = getAccount(accounts, addrs[2].addr);
        // await dispute.connect(account[0]).acceptArbitration();
        // await expect(dispute.connect(account[0]).vote(0)).to.be.revertedWith(
        //   "Invalid ruling vote"
        // );
      });
    });
  });

  describe("Dispute Contract : Refuse Arbitration", () => {
    let dispute;
    let disputeID;
    let nbArbitrators = 3;
    let reclamationPeriod;
    let tokenURI = "disputesURI";
    let accounts;
    beforeEach(async () => {
      accounts = [
        this.addr3,

        this.addr4,
        this.addr5,
        this.addr6,
        this.addr7,
        this.addr8,
        this.addr9,
        this.addr10,
        this.addr11,
        this.addr12,
        this.addr13,
        this.addr14,
        this.addr15,
        this.addr16,
        this.addr17,
        this.addr18,

        //   this.addr20,
      ];
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();

      for (let index = 0; index < accounts.length; index++) {
        const account = accounts[index];
        await accessControl.connect(account).createCV("_tokenURI");
        let _featureID = await _testInitFeature(contracts, {}, account);

        await featuresHub.validFeature(_featureID);
        let value = 0.3 * index + 0.1;
        let price = ethers.parseEther(`${value}`);

        await arbitratorsHub
          .connect(account)
          .investOnCourt(3, { value: `${price}` });
      }
      await collecter.contestFeature(
        featureID,
        reclamationPeriod,
        nbArbitrators,
        tokenURI
      );
      disputeID = await contract.getTokensLength();
      let address = await contract.addressOf(disputeID);

      dispute = await getContractAt("Dispute", address);
    });
    describe("WORKS", () => {
      it("refuseArbitration : Should update allowance", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];
        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let account = getAccount(accounts, addrs[0].addr);
        let cvID = await cvHub.getCV(account[0].address);
        let arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(2);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(2);

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        expect(await dispute.hisAllowance(arbitratorID)).to.equal(2);
      });

      it("refuseArbitration : Should update length", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let length = parseInt(await dispute.getArbitratorsLength());
        let account = getAccount(accounts, addrs[0].addr);
        let cvID = await cvHub.getCV(account[0].address);
        let arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        let _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 1).to.equal(length);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 2).to.equal(length);

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        cvID = await cvHub.getCV(account[0].address);
        arbitratorID = await arbitratorsHub.getArbitrationOfCV(
          cvID,
          data.courtID
        );
        await dispute.connect(account[0]).refuseArbitration();
        _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 3).to.equal(length);
      });

      it("refuseArbitration : Should upgrade length if length < 3", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let length = parseInt(await dispute.getArbitratorsLength());
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).refuseArbitration();
        let _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 1).to.equal(length);

        // New arbitre
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).refuseArbitration();
        _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 2).to.equal(length);

        // New arbitre
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).refuseArbitration();
        _length = parseInt(await dispute.getArbitratorsLength());
        expect(_length + 3).to.equal(length);

        // ! New arbitre
        account = getAccount(accounts, addrs[3].addr);
        await dispute.connect(account[0]).refuseArbitration();
        _length = parseInt(await dispute.getArbitratorsLength());

        expect(_length > length).to.equal(true);
      });
    });
    describe("NOT WORKS", () => {
      it("Should NOT works if already accepted", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }
        expect(data.nbArbitrators).to.equal(3);

        let account = getAccount(accounts, addrs[0].addr);

        await dispute.connect(account[0]).acceptArbitration();
        await expect(
          dispute.connect(account[0]).refuseArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });
      it("Should NOT works if dispute status != Initial", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
          }
        }
        expect(data.nbArbitrators).to.equal(3);
        // New arbitrator
        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // New arbitrator
        account = getAccount(accounts, addrs[1].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // New arbitrator
        account = getAccount(accounts, addrs[2].addr);
        await dispute.connect(account[0]).acceptArbitration();

        // ! New arbitrator
        account = getAccount(accounts, addrs[3].addr);
        await expect(
          dispute.connect(account[0]).refuseArbitration()
        ).to.be.revertedWith("Invalid status");
      });
      it("Should NOT refused twice", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 1) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }

        let account = getAccount(accounts, addrs[0].addr);
        await dispute.connect(account[0]).refuseArbitration();
        await expect(
          dispute.connect(account[0]).refuseArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });

      it("Should NOT works if arbitrator isn't invited", async () => {
        let data = await dispute.data();
        let courtLength = await arbitratorsHub.getCourtLength(data.courtID);
        let addrs = [];

        for (let index = 1; index <= courtLength; index++) {
          let allowed = await dispute.hisAllowance(index);

          if (allowed == 0) {
            const address = await arbitratorsHub.ownerOf(index);
            addrs.push({ addr: address, arbitratorID: index });
            break;
          }
        }
        let account = getAccount(accounts, addrs[0].addr);
        await expect(
          dispute.connect(account[0]).refuseArbitration()
        ).to.be.revertedWith("Wrong allowance arbitrator");
      });

      it("Should NOT works if arbitrator haven't cv", async () => {
        await expect(
          dispute.connect(this.addr19).refuseArbitration()
        ).to.be.revertedWith("CV not found");
      });
    });
  });
});
