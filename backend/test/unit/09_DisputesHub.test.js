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

describe(`Contract ${CONTRACT_NAME} `, () => {
  let addressSystem;
  let contract;
  let apiPost;
  let apiPostPayable;
  let apiGet;
  let CVsHub;
  let featuresHub;
  let collecter;
  let token;
  let datasHub;
  let contracts;
  let featureID;
  let arbitratorsHub;
  let tokenPrice;

  /**
   * @notice On viens créer les cv des arbitres
   * Ainsi que celui du worker et du owner de la feature arbitré
   * Puis on crée la feature
   */
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
    addressSystem = contracts.systems.addressSystem;
    apiPost = contracts.systems.apiPost;
    apiPostPayable = contracts.systems.apiPostPayable;
    apiGet = contracts.systems.apiGet;
    CVsHub = contracts.cvs.hub;
    featuresHub = contracts.works.featuresHub;
    datasHub = contracts.escrows.datas;
    contract = contracts.escrows.disputesHub;
    collecter = contracts.works.collectWorkInteraction;
    arbitratorsHub = contracts.escrows.arbitratorsHub;
    token = contracts.token;
    tokenPrice = await token.price();
    // return;
    await apiPost.createCV("_tokenURI");
    await apiPost.connect(this.addr1).createCV("_tokenURI");
    await apiPost.connect(this.addr2).createCV("_tokenURI");
    featureID = await _testInitFeature(contracts, {}, this.addr1);
  });

  /**
   * @notice S'assure que tout les getter de DisputesHub fonctionne bien
   */
  describe("Initialization", () => {
    describe("WORKS", () => {
      it("DisputesHub : should have featureID", async () => {
        expect(featureID > 0).to.equal(true);
      });
      it("DisputesHub : should have 0 tokens", async () => {
        expect(await apiGet.tokensLengthOf(contract.target)).to.equal(0);
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
        await expect(apiGet.addressOfDispute(1)).to.be.revertedWith(
          "Dispute not found"
        );
      });

      it("Should NOT get dispute of unexisting contest", async () => {
        await expect(apiGet.disputeOfFeature(featureID)).to.be.revertedWith(
          "Dispute not found"
        );
      });
    });
  });

  describe("Scenario", () => {
    /**
     * @notice Test la création d'une dispute par le worker || le owner d'une feature
     */
    let reclamationPeriod;
    /**
     * @notice On récupère le minimum de réclamation period possible afin de pouvoir facilement testé
     */
    beforeEach(async () => {
      reclamationPeriod = await contract.MIN_RECLAMATION_PERIOD();
    });
    describe("Create dispute", () => {
      describe("WORKS", () => {
        it("contestFeature : should create new dispute", async () => {
          await apiPost.contestFeature(
            featureID,
            reclamationPeriod,
            3,
            "tokenURI"
          );
          let length = await apiGet.tokensLengthOf(contract.target);
          expect(length).to.equal(1);
        });
        it("contestFeature : should get address of new dispute", async () => {
          await apiPost.contestFeature(
            featureID,
            reclamationPeriod,
            3,
            "tokenURI"
          );
          let id = await apiGet.tokensLengthOf(contract.target);
          let address = await apiGet.addressOfDispute(id);
          expect(address).to.not.equal(ZERO_ADDRESS);
        });
        it("contestFeature : should get id of new dispute with featureID", async () => {
          await apiPost.contestFeature(
            featureID,
            reclamationPeriod,
            3,
            "tokenURI"
          );
          let id = await apiGet.tokensLengthOf(contract.target);
          let id2 = await apiGet.disputeOfFeature(featureID);

          expect(id).to.be.equal(id2);
        });
      });

      describe("NOT WORKS", () => {
        it("should NOT create dispute with wrong bindings", async () => {
          await expect(
            collecter.contestFeature(
              1,
              featureID,
              parseInt(reclamationPeriod) - 3,
              3,
              "tokenURI"
            )
          ).to.be.revertedWith("Must be call by proxy bindings");
        });

        it("should NOT create new dispute with reclamation period < Min", async () => {
          await expect(
            apiPost.contestFeature(
              featureID,
              parseInt(reclamationPeriod) - 3,
              3,
              "tokenURI"
            )
          ).to.be.revertedWith("Invalid reclamation period");
        });

        it("should NOT create new dispute with reclamationPeriod > Max", async () => {
          let _reclamationPeriod = await contract.MAX_RECLAMATION_PERIOD();

          await expect(
            apiPost.contestFeature(
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
      let tokenURI = "disputesURI";
      let nbArbitrators = 4;
      let accounts;
      /**
       * @notice Le owner de la feature viens la contesté
       * Et on viens récupérer l'instance du contrat dispute créée
       * Avec seulement 3 arbitres demandés
       */
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
        ];
        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          await apiPost.connect(account).createCV("_tokenURI");

          await _testInitArbitrator(contracts, 3, account);
        }

        await apiPost.contestFeature(
          featureID,
          reclamationPeriod,
          nbArbitrators,
          tokenURI
        );
        disputeID = await apiGet.tokensLengthOf(contract.target);
        let address = await apiGet.addressOfDispute(disputeID);
        token = contracts.token;
        expect(address).to.not.equal(ZERO_ADDRESS);
        dispute = await getContractAt("Dispute", address);
      });

      /**
       * @notice S'assure que tout les getter de Dispute fonctionne bien
       */
      describe("Initialisation", () => {
        describe("WORKS", () => {
          it("data : should update id", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            expect(data.id).to.equal(disputeID);
          });

          it("data : should update reclamationPeriod", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            expect(data.reclamationPeriod).to.equal(reclamationPeriod);
          });

          it("data : should update value", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            let featureData = await apiGet.datasOfFeature(featureID);
            expect(data.value).to.equal(featureData.wadge);
          });

          it("data : should have new address dispute", async () => {
            let _featureID = await _testInitFeature(contracts, {}, this.addr1);

            await apiPost.contestFeature(
              _featureID,
              reclamationPeriod,
              nbArbitrators,
              tokenURI
            );
            let _disputeID = await apiGet.tokensLengthOf(contract.target);
            let address = await apiGet.addressOfDispute(_disputeID);
            expect(address).to.not.equal(ZERO_ADDRESS);
            expect(address).to.not.equal(dispute.target);
          });

          it("data : should have true courtID if enough arbitrators", async () => {
            expect((await apiGet.lengthOfCourt(3)) > 3).to.equal(true);
            let data = await apiGet.datasOfDispute(disputeID);
            expect(data.courtID).to.equal(3);
          });

          it("data : should have good nbArbitrators", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            expect(data.nbArbitrators).to.equal(nbArbitrators);
            let arbitrators = await apiGet.arbitratorsOfDispute(disputeID);
            expect(arbitrators.length).to.equal(0);
          });

          it("data : should update payeeID", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            let featureData = await apiGet.datasOfFeature(featureID);
            expect(data.payeeID).to.equal(featureData.cvWorker);
          });

          it("data : should update payerID", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            let owner = await featuresHub.ownerOf(featureID);
            let cvOwner = await apiGet.cvOf(owner);
            expect(data.payerID).to.equal(cvOwner);
          });

          it("data : should update tokenURI", async () => {
            let data = await apiGet.datasOfDispute(disputeID);
            expect(data.tokenURI).to.equal(tokenURI);
          });

          it("timersOf : should have 0 resolvedAt", async () => {
            let timers = await apiGet.timersOfDispute(disputeID);
            expect(timers.resolvedAt).to.equal(0);
          });

          it("timersOf : should have 0 reclaimedAt", async () => {
            let timers = await apiGet.timersOfDispute(disputeID);
            expect(timers.reclaimedAt).to.equal(0);
          });

          it("rulesOf : should have appeal false", async () => {
            let rules = await apiGet.rulesOfDispute(disputeID);
            expect(rules.appeal).to.equal(false);
          });
        });

        describe("NOT WORKS", () => {
          it("Should have centralized courtID if not enough arbitrators", async () => {
            let _featureID = await _testInitFeature(
              contracts,
              { courtID: 4 },
              this.addr1
            );

            await apiPost.contestFeature(
              _featureID,
              reclamationPeriod,
              nbArbitrators,
              tokenURI
            );
            let _disputeID = await apiGet.tokensLengthOf(contract.target);
            let address = await apiGet.addressOfDispute(_disputeID);

            let _dispute = await getContractAt("Dispute", address);
            let data = await apiGet.datasOfDispute(_disputeID);

            expect(data.nbArbitrators).to.not.equal(nbArbitrators);
            expect(data.nbArbitrators).to.equal(1); // nbArbitrators == 1 if centralized or kleros court
            expect(data.courtID).to.equal(0);
          });
        });
      });

      describe("Scenario", () => {
        describe("Senario : With 4 arbitrators", () => {
          /**
           * @notice Test de l'init de la dispute
           * Il est obligatoire de l'initialisé pour pouvoir progresser dans le workflow
           */
          describe("Init dispute", () => {
            describe("WORKS", () => {
              it("init : Should update arbitrator length", async () => {
                let counters = await apiGet.countersOfDispute(disputeID);
                expect(counters._arbitratorIDs).to.be.equal(0);
                await apiPost.initDispute(disputeID);
                counters = await apiGet.countersOfDispute(disputeID);
                expect(counters._arbitratorIDs > 0).to.be.equal(true);
              });

              it("init : Should update createdAt", async () => {
                let timers = await apiGet.timersOfDispute(disputeID);
                expect(timers.createdAt).to.be.equal(0);
                await apiPost.initDispute(disputeID);
                timers = await apiGet.timersOfDispute(disputeID);
                expect(timers.createdAt > 0).to.be.equal(true);
              });

              it("init : Should work with worker account", async () => {
                let timers = await apiGet.timersOfDispute(disputeID);
                expect(timers.createdAt).to.be.equal(0);
                await apiPost.connect(this.addr1).initDispute(disputeID);
                timers = await apiGet.timersOfDispute(disputeID);
                expect(timers.createdAt > 0).to.be.equal(true);
              });
            });

            describe("NOT WORKS", () => {
              it("Should can NOT init with wrong bindings", async () => {
                await expect(dispute.init(1)).to.be.revertedWith(
                  "Must call function with proxy bindings"
                );
              });

              it("Should NOT init not owner or worker account", async () => {
                await expect(
                  apiPost.connect(this.addr2).initDispute(disputeID)
                ).to.be.revertedWith("Not part of dispute");
              });

              it("Should NOT init an unknow ID", async () => {
                await expect(apiPost.initDispute(3)).to.be.revertedWith(
                  "Dispute not found"
                );
              });

              it("Should NOT init twice", async () => {
                await apiPost.initDispute(disputeID);
                await expect(apiPost.initDispute(disputeID)).to.be.revertedWith(
                  "Dispute already init"
                );
              });
            });
          });

          describe("Scenario : Dispute init", () => {
            /**
             * Init de la dispute
             */

            let addrs = [];

            beforeEach(async () => {
              await apiPost.initDispute(disputeID);
              let data = await apiGet.datasOfDispute(disputeID);
              let courtLength = await apiGet.lengthOfCourt(data.courtID);
              addrs = [];
              for (let index = 1; index <= courtLength; index++) {
                let allowed = await apiGet.allowanceOfArbitrator(
                  disputeID,
                  index
                );

                if (allowed == 1) {
                  const address = await arbitratorsHub.ownerOf(index);
                  let cvID = await apiGet.cvOf(address);
                  let arbitratorID = await apiGet.arbitrationOfCV(
                    cvID,
                    data.courtID
                  );
                  addrs.push({ addr: address, arbitratorID: arbitratorID });
                }
              }
            });

            describe("Scenario : Before accept arbitration ", () => {
              /**
               * @notice Test de l'acceptation par un arbitre de jugée la dispute
               * Les arbitres sont invités à participé aléatoirement avec un avantage pour ceux qui ont stack de l'argent dans une court
               */
              describe("Accept Arbitration", () => {
                describe("WORKS", () => {
                  it("acceptArbitration : Should update allowance", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);

                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        expect(
                          await apiGet.allowanceOfArbitrator(
                            disputeID,
                            user.arbitratorID
                          )
                        ).to.equal(3);
                        counter++;
                      }
                    }
                  });

                  it("acceptArbitration : Should update arbritators length", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                        let arbitrators = await apiGet.arbitratorsOfDispute(
                          disputeID
                        );
                        expect(arbitrators.length).to.equal(counter);
                      }
                    }
                  });

                  it("acceptArbitration : Should update dispute status if nbArbitrators == nbAccept", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let account = getAccount(
                          accounts,
                          addrs[index].addr
                        )[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(2);
                  });
                });

                describe("NOT WORKS", () => {
                  it("Should can NOT accept arbitration with wrong bindings", async () => {
                    await expect(
                      dispute.acceptArbitration(1)
                    ).to.be.revertedWith(
                      "Must call function with proxy bindings"
                    );
                  });

                  it("Should can NOT accept arbitration if haven't arbitrator", async () => {
                    await expect(
                      apiPost.acceptArbitration(disputeID)
                    ).to.be.revertedWith("Arbitration not found");
                  });

                  it("Should can NOT accept arbitration if no CV", async () => {
                    await expect(
                      apiPost.connect(this.addr19).acceptArbitration(disputeID)
                    ).to.be.revertedWith("CV not found");
                  });

                  it("Should can NOT accept arbitration twice", async () => {
                    let account = getAccount(accounts, addrs[0].addr);
                    await apiPost
                      .connect(account[0])
                      .acceptArbitration(disputeID);
                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should can NOT accept arbitration after refused arbitration", async () => {
                    let account = getAccount(accounts, addrs[0].addr);
                    await apiPost
                      .connect(account[0])
                      .refuseArbitration(disputeID);
                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should can NOT accept arbitration if not invited", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let courtLength = await apiGet.lengthOfCourt(data.courtID);
                    let _addrs = [];
                    for (let index = 1; index <= courtLength; index++) {
                      let allowed = await apiGet.allowanceOfArbitrator(
                        disputeID,
                        index
                      );

                      if (allowed == 0) {
                        const address = await arbitratorsHub.ownerOf(index);
                        _addrs.push({ addr: address, arbitratorID: index });
                        break;
                      }
                    }

                    let account = getAccount(accounts, _addrs[0].addr);

                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });
                });
              });

              /**
               * @notice Test du commencement des votes de la dispute
               * Cette fonction ne peut être appelé que par le worker ou le owner de la feature
               */
              describe("Started vote period", () => {
                describe("WORKS", () => {
                  it("startedVotePeriod : Should started vote period after call", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < parseInt(data.nbArbitrators) - 1) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(0);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await apiPost.startedVotePeriod(disputeID);
                    rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(2);
                  });

                  it("startedVotePeriod : Should started vote period if arbitrators == nbArbitrators", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(2);
                  });

                  it("startedVotePeriod : Should started vote period with worker account", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < parseInt(data.nbArbitrators) - 1) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(0);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await apiPost
                      .connect(this.addr1)
                      .startedVotePeriod(disputeID);
                    rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(2);
                  });

                  it("startedVotePeriod : Should started vote period before & after appeal", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < parseInt(data.nbArbitrators) - 1) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await apiPost
                      .connect(this.addr1)
                      .startedVotePeriod(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (index < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost.connect(account).vote(disputeID, 3);
                      }
                    }

                    await apiPost.appeal(disputeID);

                    let courtLength = await apiGet.lengthOfCourt(data.courtID);
                    let _counter = 0;
                    for (let index = 1; index <= courtLength; index++) {
                      let allowed = await apiGet.allowanceOfArbitrator(
                        disputeID,
                        index
                      );
                      if (
                        allowed == 1 &&
                        _counter < parseInt(data.nbArbitrators) - 1
                      ) {
                        const address = await arbitratorsHub.ownerOf(index);
                        let account = getAccount(accounts, address);
                        const counter = await apiGet.countersOfDispute(
                          disputeID
                        );

                        await apiPost
                          .connect(account[0])
                          .acceptArbitration(disputeID);
                        _counter++;
                      }
                    }

                    await apiPost
                      .connect(this.addr1)
                      .startedVotePeriod(disputeID);
                    let rules = await apiGet.rulesOfDispute(disputeID);

                    expect(rules.status).to.equal(2);
                  });
                });

                describe("NOT WORKS", () => {
                  it("Should NOT call with wrong bindings", async () => {
                    await expect(
                      dispute.startedVotePeriod(disputeID)
                    ).to.be.revertedWith(
                      "Must call function with proxy bindings"
                    );
                  });

                  it("Should NOT call started vote period twice", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < parseInt(data.nbArbitrators) - 1) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await apiPost.startedVotePeriod(disputeID);
                    await expect(
                      apiPost.startedVotePeriod(disputeID)
                    ).to.be.revertedWith("Invalid status");
                  });

                  it("Should NOT started vote period if startedAt + reclamationPeriod <= block.timestamp", async () => {
                    await expect(
                      apiPost.startedVotePeriod(disputeID)
                    ).to.be.revertedWith("Must wait started period");
                  });

                  it("Should NOT started vote period if arbitrators accept <  3", async () => {
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < 2) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }
                    await expect(
                      apiPost.startedVotePeriod(disputeID)
                    ).to.be.revertedWith("Insuficient arbitrators");
                  });

                  it("Should NOT started vote period by not part of dispute account", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    let account;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                      }
                    }
                    await expect(
                      apiPost.connect(account).startedVotePeriod(disputeID)
                    ).to.be.revertedWith("Not part of dispute");
                  });
                });
              });

              describe("Refuse Arbitration", () => {
                describe("WORKS", () => {
                  it("refuseArbitration : Should update allowance", async () => {
                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < 4) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .refuseArbitration(disputeID);
                        expect(
                          await apiGet.allowanceOfArbitrator(
                            disputeID,
                            user.arbitratorID
                          )
                        ).to.equal(2);
                        counter++;
                      }
                    }
                  });

                  it("refuseArbitration : Should update length", async () => {
                    let counters = await apiGet.countersOfDispute(disputeID);
                    let length = parseInt(counters._arbitratorIDs);

                    let counter = 0;
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < 4) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost
                          .connect(account)
                          .refuseArbitration(disputeID);
                        counters = await apiGet.countersOfDispute(disputeID);
                        let _length = parseInt(counters._arbitratorIDs);
                        counter++;
                        expect(_length + counter).to.equal(length);
                      }
                    }
                  });

                  /**
                   * Lorsqu'il y a moins de 3 arbitres restant qui est invité. Une nouvelle sélection s'effectue
                   * data.nbArbitrators = 4
                   * slot == nbArbitrators * 2
                   * Alors il faut ici que 6 arbitres refuse pour que slot < 3
                   */
                  it("refuseArbitration : Should upgrade length if length < 3", async () => {
                    for (let index = 1; index <= addrs.length; index++) {
                      let counters = await apiGet.countersOfDispute(disputeID);
                      let length = parseInt(counters._arbitratorIDs);
                      let user = addrs[index];
                      let account = getAccount(accounts, user.addr)[0];
                      await apiPost
                        .connect(account)
                        .refuseArbitration(disputeID);
                      if (length == 3) {
                        break;
                      }
                    }
                    let counters = await apiGet.countersOfDispute(disputeID);
                    let _length = parseInt(counters._arbitratorIDs);
                    let data = await apiGet.datasOfDispute(disputeID);
                    expect(_length > data.nbArbitrators).to.equal(true);
                  });
                });

                describe("NOT WORKS", () => {
                  it("Should NOT call with wrong bindings", async () => {
                    await expect(
                      dispute.refuseArbitration(1)
                    ).to.be.revertedWith(
                      "Must call function with proxy bindings"
                    );
                  });

                  it("Should NOT works if already accepted", async () => {
                    let account = getAccount(accounts, addrs[0].addr);
                    await apiPost
                      .connect(account[0])
                      .acceptArbitration(disputeID);
                    await expect(
                      apiPost.connect(account[0]).refuseArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should NOT refused twice", async () => {
                    let account = getAccount(accounts, addrs[0].addr);
                    await apiPost
                      .connect(account[0])
                      .refuseArbitration(disputeID);
                    await expect(
                      apiPost.connect(account[0]).refuseArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should NOT works if arbitrator isn't invited", async () => {
                    let data = await apiGet.datasOfDispute(disputeID);
                    let courtLength = await apiGet.lengthOfCourt(data.courtID);
                    let addrs = [];

                    for (let index = 1; index <= courtLength; index++) {
                      let allowed = await apiGet.allowanceOfArbitrator(
                        disputeID,
                        index
                      );

                      if (allowed == 0) {
                        const address = await arbitratorsHub.ownerOf(index);
                        addrs.push({ addr: address, arbitratorID: index });
                        break;
                      }
                    }
                    let account = getAccount(accounts, addrs[0].addr);
                    await expect(
                      apiPost.connect(account[0]).refuseArbitration(disputeID)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should NOT works if arbitrator haven't cv", async () => {
                    await expect(
                      apiPost.connect(this.addr19).refuseArbitration(disputeID)
                    ).to.be.revertedWith("CV not found");
                  });
                });
              });

              /**
               * @notice Les votes ne fonctionneras pas tant que la période de vote n'a pas démarré
               */
              describe("NOT WORKS Vote", () => {
                it("Should NOT update vote if status != Disputed", async () => {
                  let account = getAccount(accounts, addrs[0].addr);
                  await expect(
                    apiPost.connect(account[0]).vote(disputeID, 0)
                  ).to.be.revertedWith("Invalid status");
                });
              });
            });

            describe("After accept arbitration", () => {
              /**
               *  On accepte l'arbitration et ainsi lancé la session des votes
               */
              beforeEach(async () => {
                let counter = 0;
                let data = await apiGet.datasOfDispute(disputeID);
                for (let index = 1; index <= addrs.length; index++) {
                  if (counter < data.nbArbitrators) {
                    let user = addrs[index];
                    let account = getAccount(accounts, user.addr)[0];
                    await apiPost.connect(account).acceptArbitration(disputeID);
                    counter++;
                  }
                }
                let rules = await apiGet.rulesOfDispute(disputeID);
                expect(rules.status).to.equal(2);
              });

              describe("INVALID WORKFLOW", () => {
                /**
                 * @notice Lorsque le workflow est passé au vote period
                 * Alors il n'est plus possible de refuser une arbitration
                 */
                describe("NOT WORKS Refuse Arbitration", () => {
                  it("Should NOT works if dispute status != Initial", async () => {
                    let account = getAccount(accounts, addrs[3].addr);
                    await expect(
                      apiPost.connect(account[0]).refuseArbitration(disputeID)
                    ).to.be.revertedWith("Invalid status");
                  });
                });

                /**
                 * @notice Lorsque le workflow est passé au vote period
                 * Alors il n'est plus possible d'accepter une arbitration
                 */
                describe("NOT WORKS Accept Arbitration ", () => {
                  it("Should can NOT accept arbitration if status != Initial", async () => {
                    let account = getAccount(accounts, addrs[3].addr);
                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Invalid status");
                    account = getAccount(accounts, addrs[4].addr);
                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Invalid status");
                    account = getAccount(accounts, addrs[5].addr);
                    await expect(
                      apiPost.connect(account[0]).acceptArbitration(disputeID)
                    ).to.be.revertedWith("Invalid status");
                  });
                });

                /**
                 * @notice L'appel ne peux pas être trigger tant que les votes n'ont pas commencé
                 */
                describe("NOT WORKS Appeal ", () => {
                  it("Should NOT appeal if no session vote", async () => {
                    await expect(apiPost.appeal(disputeID)).to.be.revertedWith(
                      "Invalid status"
                    );
                  });
                });

                /**
                 * @notice Si le nombre d'arbitre qui a été accepté == nbArbitrators
                 * Alors started vote period ne peux pas fonctionner
                 */
                describe("NOT WORKS Started vote period", () => {
                  it("Should NOT started vote period if already started because arbitrators == nbArbitrators", async () => {
                    await expect(
                      apiPost.startedVotePeriod(disputeID)
                    ).to.be.revertedWith("Invalid status");
                  });
                });
              });

              /**
               * @notice Test des votes
               * Cette fonction ne peut être appelé que par un arbitre qui y a été accepté
               */
              describe("Vote", () => {
                describe("WORKS", () => {
                  it("vote : Should update vote status", async () => {
                    let account = getAccount(accounts, addrs[1].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 3);
                    await expect(
                      apiPost.connect(account[0]).vote(disputeID, 3)
                    ).to.be.revertedWith("Already voted");
                  });

                  it("voter : Should receive token from feature ETHEREUM", async () => {
                    let account = getAccount(accounts, addrs[1].addr);
                    let balance = await token.balanceOf(account[0].address);
                    let datas = await apiGet.datasOfDispute(disputeID);

                    await apiPost.connect(account[0]).vote(disputeID, 3);
                    let _balance = await token.balanceOf(account[0].address);

                    expect(balance + datas.value / tokenPrice / 2n).to.be.equal(
                      _balance
                    );
                    expect(_balance > balance).to.be.equal(true);
                  });
                  it("voter : Should receive token from ERC feature", async () => {
                    await apiPost.createMission("tokenURI");
                    await apiPost.createFeature(
                      900,
                      await apiGet.tokensLengthOf(
                        await addressSystem.missionsHub()
                      ),
                      50,
                      false,
                      "tokenURI",
                      3
                    );
                    let featureID = await apiGet.tokensLengthOf(
                      await addressSystem.featuresHub()
                    );
                    await apiPost.inviteWorker(2, featureID);
                    await apiPost.connect(this.addr1).acceptJob(featureID);
                    await apiPost.contestFeature(featureID, 7, 3, "tokenURi");
                    let _disputeID = await apiGet.tokensLengthOf(
                      await addressSystem.disputesHub()
                    );
                    await apiPost.initDispute(_disputeID);
                    let arbitratorID;
                    let nbArbitrator = 0;
                    for (let index = 1; index < 10; index++) {
                      let bool = await apiGet.allowanceOfArbitrator(
                        _disputeID,
                        index
                      );
                      if (bool) {
                        arbitratorID = index;
                        let _account = getAccount(
                          accounts,
                          await apiGet.ownerOfToken(
                            arbitratorID,
                            await addressSystem.arbitratorsHub()
                          )
                        );
                        _account = _account[0];

                        await apiPost
                          .connect(_account)
                          .acceptArbitration(_disputeID);
                        nbArbitrator++;
                        if (nbArbitrator === 3) {
                          datas = await apiGet.datasOfDispute(_disputeID);
                          balance = await token.balanceOf(_account.address);
                          await apiPost.connect(_account).vote(_disputeID, 2);
                          _balance = await token.balanceOf(_account.address);
                          expect(balance + datas.value / 2n).to.be.equal(
                            _balance
                          );

                          break;
                        }
                      }
                    }
                  });

                  it("vote : Should update counters votes length", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                        let counters = await apiGet.countersOfDispute(
                          disputeID
                        );
                        expect(counters._voteIDs).to.equal(counter);
                      }
                    }
                  });

                  it("vote : Should update counters payeeVote if vote == Vote.PayeeVote ", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                        let counters = await apiGet.countersOfDispute(
                          disputeID
                        );
                        expect(counters._payeeVote).to.equal(counter);
                        expect(counters._payerVote).to.equal(0);
                      }
                    }
                  });

                  it("vote : Should update counters payerVote if vote == Vote.PayerVote ", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 2);
                        counter++;
                        let counters = await apiGet.countersOfDispute(
                          disputeID
                        );
                        expect(counters._payerVote).to.equal(counter);
                        expect(counters._payeeVote).to.equal(0);
                      }
                    }
                  });

                  it("vote : Should update dispute status if voteLength == nbArbitrators", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                      }
                    }
                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(3);
                  });

                  it("vote : Should PayeeWin decision when voteLength == nbArbitrators", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                      }
                    }
                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.decision).to.equal(3);
                  });

                  it("vote : Should PayerWin decision if voteLength == nbArbitrators", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];
                        await apiPost.connect(account).vote(disputeID, 2);
                        counter++;
                      }
                    }
                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.decision).to.equal(2);
                  });

                  it("vote : Should haven't winner if vote equal", async () => {
                    let account = getAccount(accounts, addrs[1].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 3);
                    account = getAccount(accounts, addrs[2].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 1);
                    account = getAccount(accounts, addrs[3].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 1);
                    account = getAccount(accounts, addrs[4].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 2);
                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.decision).to.equal(1);
                  });
                });

                describe("NOT WORKS", () => {
                  it("Should NOT call with wrong bindings", async () => {
                    await expect(dispute.vote(disputeID, 0)).to.be.revertedWith(
                      "Must call function with proxy bindings"
                    );
                  });

                  it("Should NOT update if vote status == Waiting", async () => {
                    let account = getAccount(accounts, addrs[1].addr);
                    await expect(
                      apiPost.connect(account[0]).vote(disputeID, 0)
                    ).to.be.revertedWith("Invalid vote");
                  });

                  it("Should NOT update vote if no arbitrator", async () => {
                    await expect(apiPost.vote(disputeID, 0)).to.be.revertedWith(
                      "Arbitration not found"
                    );
                  });

                  it("Should NOT update vote if no cv", async () => {
                    await expect(
                      apiPost.connect(this.addr19).vote(disputeID, 0)
                    ).to.be.revertedWith("CV not found");
                  });

                  it("Should NOT update vote twice ", async () => {
                    let account = getAccount(accounts, addrs[1].addr);
                    await apiPost.connect(account[0]).vote(disputeID, 2);
                    await expect(
                      apiPost.connect(account[0]).vote(disputeID, 2)
                    ).to.be.revertedWith("Already voted");
                  });

                  it("Should NOT update vote if not  accepted", async () => {
                    let account = getAccount(accounts, addrs[6].addr);
                    let rules = await apiGet.rulesOfDispute(disputeID);
                    expect(rules.status).to.equal(2);
                    await expect(
                      apiPost.connect(account[0]).vote(disputeID, 0)
                    ).to.be.revertedWith("Not allowed");
                  });

                  it("Should NOT vote if dispute status == Resolved", async () => {
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                      }
                    }
                    let account = getAccount(accounts, addrs[1].addr);
                    await expect(
                      apiPost.connect(account[0]).vote(disputeID, 3)
                    ).to.be.revertedWith("Invalid status");
                  });

                  it("Should NOT update balance before appeal", async () => {
                    let _accounts = [this.addr1, this.owner];

                    let data = await apiGet.datasOfDispute(disputeID);
                    let winner = await CVsHub.ownerOf(data.payeeID);
                    let winner1 = await CVsHub.ownerOf(data.payerID);
                    let winnerAccount = getAccount(_accounts, winner)[0];

                    let balance = await winnerAccount.provider.getBalance(
                      winner
                    );
                    let balance1 = await winnerAccount.provider.getBalance(
                      winner1
                    );

                    let counter = 0;

                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                      }
                    }

                    let _balance = await winnerAccount.provider.getBalance(
                      winner
                    );
                    let _balance1 = await winnerAccount.provider.getBalance(
                      winner1
                    );

                    expect(balance).to.equal(_balance);
                    expect(balance1).to.equal(_balance1);
                  });

                  it("Should NOT update feature data status to Validated", async () => {
                    let fdata = await apiGet.datasOfFeature(featureID);
                    let counter = 0;
                    let data = await apiGet.datasOfDispute(disputeID);
                    for (let index = 1; index <= addrs.length; index++) {
                      if (counter < data.nbArbitrators) {
                        let user = addrs[index];
                        let account = getAccount(accounts, user.addr)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                      }
                    }
                    let _fdata = await apiGet.datasOfFeature(featureID);
                    expect(fdata.status).to.equal(_fdata.status);
                  });
                });
              });
              describe("Workflow : After vote", () => {
                /**
                 * Les arbitres votes pour résoudre le conflit et on passe au tallied
                 */
                beforeEach(async () => {
                  let counter = 0;
                  let data = await apiGet.datasOfDispute(disputeID);
                  for (let index = 1; index <= addrs.length; index++) {
                    if (counter < data.nbArbitrators) {
                      let user = addrs[index];
                      let account = getAccount(accounts, user.addr)[0];

                      await apiPost.connect(account).vote(disputeID, 3);
                      counter++;
                    }
                  }
                });

                /**
                 * @notice Test de la fonction appel
                 * Cette fonction ne peut être appelé qu'une fois que lorque la décision a été rendu
                 * Seulement utilisable par le owner ou le worker de la feature
                 */
                describe("Appeal", () => {
                  describe("WORKS", () => {
                    it("appeal : Should update appeal bool", async () => {
                      await apiPost.appeal(disputeID);
                      let rules = await apiGet.rulesOfDispute(disputeID);
                      expect(rules.appeal).to.equal(true);
                    });

                    it("appeal : Should appeal with worker contract", async () => {
                      await apiPost.connect(this.addr1).appeal(disputeID);
                      let rules = await apiGet.rulesOfDispute(disputeID);
                      expect(rules.appeal).to.equal(true);
                    });

                    it("appeal : Should refresh votes ", async () => {
                      let counters = await apiGet.countersOfDispute(disputeID);
                      expect(counters._voteIDs).to.not.equal(0);
                      await apiPost.appeal(disputeID);
                      counters = await apiGet.countersOfDispute(disputeID);
                      expect(counters._voteIDs).to.equal(0);
                      expect(counters._payerVote).to.equal(0);
                      expect(counters._payeeVote).to.equal(0);
                    });

                    it("appeal : Should renew arbitrators length", async () => {
                      let arbitrators = await apiGet.arbitratorsOfDispute(
                        disputeID
                      );
                      expect(arbitrators.length).to.not.equal(0);
                      await apiPost.appeal(disputeID);
                      arbitrators = await apiGet.arbitratorsOfDispute(
                        disputeID
                      );
                      expect(arbitrators.length).to.equal(0);
                    });

                    it("appeal : Should refresh arbitrators ", async () => {
                      let data = await apiGet.datasOfDispute(disputeID);
                      let courtLength = await apiGet.lengthOfCourt(
                        data.courtID
                      );

                      let counterIDs = 0;
                      for (let index = 1; index <= addrs.length; index++) {
                        let allowed = await apiGet.allowanceOfArbitrator(
                          disputeID,
                          index
                        );
                        if (allowed == 1) {
                          counterIDs += index;
                        }
                      }

                      await apiPost.appeal(disputeID);

                      let _counterIDs = 0;
                      for (let index = 1; index <= courtLength; index++) {
                        let allowed = await apiGet.allowanceOfArbitrator(
                          disputeID,
                          index
                        );
                        if (allowed == 1) {
                          _counterIDs += index;
                        }
                      }
                      expect(counterIDs).to.not.be.equal(_counterIDs);
                    });

                    it("appeal : Should update value after voting appeal session", async () => {
                      let data = await apiGet.datasOfDispute(disputeID);
                      let courtLength = await apiGet.lengthOfCourt(
                        data.courtID
                      );

                      await apiPost.appeal(disputeID);

                      let _addrs = [];
                      let counter = 0;
                      for (let index = 1; index <= courtLength; index++) {
                        let allowed = await apiGet.allowanceOfArbitrator(
                          disputeID,
                          index
                        );
                        if (allowed == 1) {
                          const address = await arbitratorsHub.ownerOf(index);
                          _addrs.push({ addr: address, arbitratorID: index });
                          let account = getAccount(accounts, address)[0];
                          await apiPost
                            .connect(account)
                            .acceptArbitration(disputeID);
                          counter++;
                          if (counter == data.nbArbitrators) {
                            break;
                          }
                        }
                      }

                      for (let index = 0; index < _addrs.length; index++) {
                        const address = _addrs[index].addr;
                        let account = getAccount(accounts, address)[0];

                        await apiPost.connect(account).vote(disputeID, 3);
                        counter++;
                        if (counter == data.nbArbitrators) {
                          break;
                        }
                      }
                      let _data = await apiGet.datasOfDispute(disputeID);
                      expect(data.value).to.not.be.equal(_data.value);
                      expect(_data.value).to.be.equal(0);
                    });
                  });

                  describe("NOT WORKS", () => {
                    it("Should NOT call with wrong bindings", async () => {
                      let account = getAccount(accounts, addrs[0].addr);
                      await expect(
                        dispute.connect(account[0]).doAppeal(1)
                      ).to.be.revertedWith(
                        "Must call function with proxy bindings"
                      );
                    });

                    it("Should NOT appeal with not worker or owner account", async () => {
                      let account = getAccount(accounts, addrs[0].addr);
                      await expect(
                        apiPost.connect(account[0]).appeal(disputeID)
                      ).to.be.revertedWith("Not part of dispute");
                    });

                    it("Should NOT appeal twice", async () => {
                      await apiPost.appeal(disputeID);

                      await expect(
                        apiPost.appeal(disputeID)
                      ).to.be.revertedWith("Invalid status");
                    });

                    it("Should NOT appeal with worker account after appeal", async () => {
                      await apiPost.appeal(disputeID);
                      await expect(
                        apiPost.connect(this.addr1).appeal(disputeID)
                      ).to.be.revertedWith("Invalid status");
                    });
                  });
                });

                describe("Resolved dispute", () => {
                  let data;
                  let timing;
                  beforeEach(async () => {
                    // Vote != data.nbArbitrators

                    data = await apiGet.datasOfDispute(disputeID);

                    let appeal = parseInt(await dispute.APPEAL_PERIOD());
                    let reclamationPeriod = parseInt(
                      await data.reclamationPeriod
                    );

                    timing = appeal + reclamationPeriod;
                  });
                  describe("WORKS", () => {
                    it("resolvedDispute : Should update ALL GOOD datas with owner account", async () => {
                      await new Promise((resolve) =>
                        setTimeout(resolve, 12000)
                      );
                      await apiPost.resolvedDispute(disputeID);
                      let data = await apiGet.datasOfDispute(disputeID);
                      let rules = await apiGet.rulesOfDispute(disputeID);
                      let timers = await apiGet.timersOfDispute(disputeID);
                      expect(data.value).to.equal(0);
                      expect(rules.status).to.equal(1);
                      expect(timers.reclaimedAt).to.not.equal(0);
                      data = await apiGet.datasOfFeature(featureID);
                      expect(data.wadge).to.equal(0);
                      expect(data.status).to.equal(2);
                    });

                    it("resolvedDispute : Should update ALL GOOD datas with worker account", async () => {
                      await new Promise((resolve) =>
                        setTimeout(resolve, 12000)
                      );
                      await apiPost
                        .connect(this.addr1)
                        .resolvedDispute(disputeID);
                      let data = await apiGet.datasOfDispute(disputeID);
                      let rules = await apiGet.rulesOfDispute(disputeID);
                      let timers = await apiGet.timersOfDispute(disputeID);
                      expect(data.value).to.equal(0);
                      expect(rules.status).to.equal(1);
                      expect(timers.reclaimedAt).to.not.equal(0);
                      data = await apiGet.datasOfFeature(featureID);
                      expect(data.wadge).to.equal(0);
                      expect(data.status).to.equal(2);
                    });
                  });

                  describe("NOT WORKS", () => {
                    it("Should NOT work with wrong bindings", async () => {
                      await expect(
                        dispute.resolvedDispute(1)
                      ).to.be.revertedWith(
                        "Must call function with proxy bindings"
                      );
                    });

                    it("Should NOT work twice", async () => {
                      await new Promise((resolve) =>
                        setTimeout(resolve, 12000)
                      );
                      await apiPost.resolvedDispute(disputeID);
                      await expect(
                        apiPost.resolvedDispute(disputeID)
                      ).to.be.revertedWith("Invalid status");
                    });

                    it("Should NOT work twice if account == worker && owner", async () => {
                      await new Promise((resolve) =>
                        setTimeout(resolve, 12000)
                      );
                      await apiPost.resolvedDispute(disputeID);
                      await expect(
                        apiPost.connect(this.addr1).resolvedDispute(disputeID)
                      ).to.be.revertedWith("Invalid status");
                    });

                    it("Should NOT work if account != worker && owner", async () => {
                      await expect(
                        apiPost.connect(this.addr9).resolvedDispute(disputeID)
                      ).to.be.revertedWith("Not part of dispute");
                    });

                    it("Should NOT work if trigger before released period", async () => {
                      await expect(
                        apiPost.resolvedDispute(disputeID)
                      ).to.be.revertedWith("Must wait release period");
                    });
                  });
                });

                describe("Workflow after appeal", () => {
                  let addrs = [];
                  let timers;
                  beforeEach(async () => {
                    timers = await apiGet.timersOfDispute(disputeID);
                    await apiPost.appeal(disputeID);
                    let datas = await apiGet.datasOfDispute(disputeID);
                    let counter = 0;
                    addrs = [];
                    let courtLength = await apiGet.lengthOfCourt(datas.courtID);
                    for (let index = 1; index <= courtLength; index++) {
                      let allowed = await apiGet.allowanceOfArbitrator(
                        disputeID,
                        index
                      );

                      if (allowed == 1) {
                        const address = await arbitratorsHub.ownerOf(index);

                        addrs.push({ addr: address, arbitratorID: index });
                        account = getAccount(accounts, address)[0];
                        await apiPost
                          .connect(account)
                          .acceptArbitration(disputeID);
                        counter++;
                        if (counter == datas.nbArbitrators) {
                          break;
                        }
                      }
                    }
                  });

                  describe("Vote", () => {
                    describe("WORKS", () => {
                      it("vote : Should update status to Reclaimed after appeal ", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }
                        let rules = await apiGet.rulesOfDispute(disputeID);
                        expect(rules.status).to.equal(1);
                      });

                      it("vote : Should update data resolvedAt if voteLength == nbArbitrators && appeal == true", async () => {
                        let timers = await apiGet.timersOfDispute(disputeID);
                        expect(timers.resolvedAt).to.equal(0);

                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        timers = await apiGet.timersOfDispute(disputeID);

                        expect(timers.resolvedAt).to.not.equal(0);
                      });

                      it("vote : Should update value after voting appeal session", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }
                        let _data = await apiGet.datasOfDispute(disputeID);
                        expect(_data.value).to.be.equal(0);
                      });

                      it("vote : Should update wadge feature data", async () => {
                        let _data = await apiGet.datasOfFeature(featureID);
                        expect(_data.wadge).to.not.be.equal(0);
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        let data = await apiGet.datasOfFeature(featureID);
                        expect(data.wadge).to.be.equal(0);
                      });

                      it("vote : Should update balance of winner", async () => {
                        let _accounts = [this.addr1, this.owner];
                        let _data = await apiGet.datasOfDispute(disputeID);
                        let winner = await CVsHub.ownerOf(_data.payeeID);
                        let winnerAccount = getAccount(_accounts, winner)[0];
                        let balance = await winnerAccount.provider.getBalance(
                          winner
                        );

                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        let _balance = await winnerAccount.provider.getBalance(
                          winner
                        );
                        expect(balance < _balance).to.equal(true);
                      });

                      it("vote : Should update resolvedAt value after 2 voting session", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        let _timers = await apiGet.timersOfDispute(disputeID);
                        expect(timers.resolvedAt).to.not.be.equal(
                          _timers.resolvedAt
                        );
                        expect(
                          timers.resolvedAt < _timers.resolvedAt
                        ).to.be.equal(true);
                      });

                      it("vote : Should refresh startedAt ", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        let _timers = await apiGet.timersOfDispute(disputeID);
                        expect(timers.startedAt).to.not.be.equal(
                          _timers.startedAt
                        );
                        expect(
                          timers.startedAt < _timers.startedAt
                        ).to.be.equal(true);
                      });

                      it("vote : Should update feature data status to Validated", async () => {
                        let data = await apiGet.datasOfDispute(disputeID);
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        data = await apiGet.datasOfFeature(featureID);
                        expect(data.status).to.equal(2);
                      });
                    });

                    describe("NOT WORKS", () => {
                      it("Should NOT appeal with worker account after first appeal", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }

                        await expect(
                          apiPost.connect(this.addr1).appeal(disputeID)
                        ).to.be.revertedWith("Invalid status");
                      });

                      it("Should NOT appeal twice with owner account after new session vote", async () => {
                        for (let index = 0; index < addrs.length; index++) {
                          const address = addrs[index].addr;
                          let account = getAccount(accounts, address)[0];
                          await apiPost.connect(account).vote(disputeID, 3);
                        }
                        await expect(
                          apiPost.appeal(disputeID)
                        ).to.be.revertedWith("Invalid status");
                      });
                    });
                  });
                });
              });
            });
          });
        });
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
        // await apiPost.connect(account[0]).acceptArbitration(disputeID);
        // // New arbitre
        // account = getAccount(accounts, addrs[1].addr);
        // await apiPost.connect(account[0]).acceptArbitration(disputeID);
        // // New arbitre
        // account = getAccount(accounts, addrs[2].addr);
        // await apiPost.connect(account[0]).acceptArbitration(disputeID);
        // await expect(apiPost.connect(account[0]).vote(disputeID, 0)).to.be.revertedWith(
        //   "Invalid ruling vote"
        // );
      });
    });
  });

  describe("Escrow datas hub : Setter not works", () => {
    describe("NOT WORKS", () => {
      it("Should NOT start vote of without dispute bindings", async () => {
        await expect(datasHub.startVotesOf(1)).to.be.reverted;
      });
      it("Should NOT add arbitrator without dispute bindings", async () => {
        await expect(datasHub.addArbitratorOn(1, 1)).to.be.reverted;
      });
      it("Should NOT vote for without dispute bindings", async () => {
        await expect(datasHub.voteFor(1, 1, 2)).to.be.reverted;
      });
      it("Should NOT tally for without dispute bindings", async () => {
        await expect(datasHub.tallyFor(1)).to.be.reverted;
      });
      it("Should NOT resolve dispute of without dispute bindings", async () => {
        await expect(datasHub.resolveDisputeOf(1)).to.be.reverted;
      });
      it("Should NOT reclaimed for without dispute bindings", async () => {
        await expect(datasHub.reclaimedFor(1)).to.be.reverted;
      });
      it("Should NOT refuse arbitration for without dispute bindings", async () => {
        await expect(datasHub.refuseArbitration(1, 1)).to.be.reverted;
      });
      it("Should NOT appeal of without dispute bindings", async () => {
        await expect(datasHub.appealOf(1)).to.be.reverted;
      });
    });
  });
});
