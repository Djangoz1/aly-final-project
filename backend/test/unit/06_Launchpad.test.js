const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitLaunchpad,

  _testInitToken,
  _testInitAll,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
  ZERO_ADDRESS,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "LaunchpadHub";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let accessControl;
  let addressHub;
  let pubsHub;
  let cLI;
  let LC;
  let cLD;
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
    accessControl = contracts.accessControl;
    addressHub = contracts.addressHub;
    pubsHub = contracts.pubsHub;
    // return;
    let launchpadContracts = contracts.launchpadContracts;

    await accessControl.createCV("_tokenURI");
    await accessControl.connect(this.addr1).createCV("_tokenURI");
    await accessControl.connect(this.addr2).createCV("_tokenURI");

    lHub = launchpadContracts.hub;
    contract = launchpadContracts.hub;
    cLI = launchpadContracts.investors;
    LC = launchpadContracts.cohort;
    cLD = launchpadContracts.datas;
  });

  describe("Init : Launchpad", () => {
    it("Should have good launchpad price", async () => {
      let price = await accessControl.launchpadPrice();

      expect(price).to.be.equal(ethers.parseEther("0.4"));
    });

    it("Should  have cohort", async () => {
      expect(cLI.target).to.not.be.equal(ZERO_ADDRESS);

      expect(contract.target).to.not.be.equal(ZERO_ADDRESS);
      expect(LC.target).to.not.be.equal(ZERO_ADDRESS);
      expect(cLD.target).to.not.be.equal(ZERO_ADDRESS);
    });

    it("Should  have collecter launchpadInvestor", async () => {
      expect(cLI.target).to.be.equal(await LC.launchpadInvestor());
    });
    it("Should  have collecter launchpadDatas", async () => {
      expect(cLD.target).to.be.equal(await LC.launchpadDatas());
    });
    it("Should  have launchpads hub", async () => {
      expect(contract.target).to.be.equal(await LC.launchpadHub());
    });
    it("Should  have launchpad cohort", async () => {
      expect(LC.target).to.be.equal(await addressHub.launchpadCohort());
    });
    it("Should  have address hub", async () => {
      expect(addressHub.target).to.be.equal(await LC.addressHub());
    });
    it("Should  return all address", async () => {
      expect(cLI.target).to.be.equal(await LC.launchpadInvestor());
      expect(cLD.target).to.be.equal(await LC.launchpadDatas());
      expect(contract.target).to.be.equal(await LC.launchpadHub());
      expect(LC.target).to.be.equal(await addressHub.launchpadCohort());
      expect(addressHub.target).to.be.equal(await LC.addressHub());
    });

    it("Should  have 0 token", async () => {
      expect(await contract.getTokensLength()).to.be.equal(0);
    });
    describe("NOT WORKS", () => {
      it("Should  NOT use getLaunchpad for unknow ID", async () => {
        await expect(contract.getLaunchpad(1)).to.be.revertedWith(
          "ID out of range"
        );
      });
      it("Should  NOT mint launchpad without proxyBindings", async () => {
        await expect(
          contract.mint(
            this.owner.address,
            LAUNCHPAD_DATAS_EXEMPLE,
            [TIER_DATAS_EXEMPLE],
            "pubURI"
          )
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
    });
  });
  describe("Create : Launchpad", () => {
    let token;
    let datas;
    let price;

    beforeEach(async () => {
      token = await _testInitToken(this.owner, "Django", "DJN", 300000);
      datas = LAUNCHPAD_DATAS_EXEMPLE;
      datas.saleStart = new Date().getTime() + 10000;

      datas.saleEnd = new Date().getTime() + 100000;
      datas.tokenAddress = token.target;
      price = await accessControl.launchpadPrice();
    });
    describe("WORKS", () => {
      it("Should mint launchpad ", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );

        expect(await contract.getTokensLength()).to.be.equal(1);
      });
      it("Should return true token address", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);

        expect(_datas.tokenAddress).to.be.equal(token.target);
      });

      it("Should return 0 total user", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.totalUser).to.be.equal(0);
      });
      it("Should return true pub URI", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI1",
          {
            value: `${price}`,
          }
        );
        let _length = await pubsHub.getTokensLength();
        let uri = await pubsHub.tokenURI(_length);

        expect(uri).to.be.equal("pubURI1");
      });
      it("Should return true number of tier", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.numberOfTier).to.be.equal(1);
      });

      it("Should return true locked time", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.lockedTime).to.be.equal(datas.lockedTime);
      });
      it("Should return true min invest", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.minInvest).to.be.equal(datas.minInvest);
      });
      it("Should return true max invest", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.maxInvest).to.be.equal(datas.maxInvest);
      });
      it("Should return true sale start", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.saleStart).to.be.equal(datas.saleStart);
      });
      it("Should return true sale end", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await cLD.getLaunchpadData(1);
        expect(_datas.saleEnd).to.be.equal(datas.saleEnd);
      });
      it("Should return true id", async () => {
        await accessControl.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );

        let length = await contract.getTokensLength();
        expect(length).to.be.equal(1);
      });

      it("Should  return true max cap", async () => {
        let tierDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];
        await accessControl.createLaunchpad(datas, tierDatas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await cLD.getLaunchpadData(1);
        let _maxCap = 0;
        for (let index = 0; index < tierDatas.length; index++) {
          const element = tierDatas[index];
          _maxCap += element.maxTierCap;
        }
        expect(_datas.maxCap).to.be.equal(_maxCap);
      });
      it("Should  return true min cap", async () => {
        let tierDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];
        await accessControl.createLaunchpad(datas, tierDatas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await cLD.getLaunchpadData(1);

        let _minCap = 0;
        for (let index = 0; index < tierDatas.length; index++) {
          const element = tierDatas[index];

          _minCap += element.minTierCap;
        }

        expect(_datas.minCap).to.be.equal(_minCap);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT mint launchpad without cv", async () => {
        let price = await accessControl.launchpadPrice();
        await expect(
          accessControl
            .connect(this.addr4)
            .createLaunchpad(
              LAUNCHPAD_DATAS_EXEMPLE,
              [TIER_DATAS_EXEMPLE],
              "pubURI",
              {
                value: `${price}`,
              }
            )
        ).to.be.revertedWith("CV not exist");
      });
      it("Should  NOT mint launchpad with wrong value", async () => {
        await expect(
          accessControl.createLaunchpad(
            LAUNCHPAD_DATAS_EXEMPLE,
            [TIER_DATAS_EXEMPLE],
            "pubURI",
            {
              value: `2000`,
            }
          )
        ).to.be.revertedWith("Invalid value for launchpad");
      });

      it("Should  NOT mint launchpad without pubURI", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;

        await expect(
          accessControl.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Must have pub URI");
      });
      it("Should  NOT mint launchpad with wrong sale start", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        datas.saleStart = 0;

        await expect(
          accessControl.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Invalid sale start");
      });
      it("Should  NOT mint launchpad with wrong sale end", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        datas.saleStart = new Date().getTime();
        datas.saleEnd = 0;
        await expect(
          accessControl.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Invalid sale end");

        datas.saleEnd = datas.saleStart - 1000;

        await expect(
          accessControl.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Missmatch sale time");
      });
      it("Should  NOT mint launchpad with 0 tokenAddress", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        datas.saleEnd = datas.saleStart + 1000;
        datas.tokenAddress = ZERO_ADDRESS;

        await expect(
          accessControl.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Must assign a token address");
      });
      it("Should  NOT mint without balance of tokenAddress", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;
        datas.saleEnd = datas.saleStart + 1000;

        await expect(
          accessControl
            .connect(this.addr2)
            .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
              value: `${price}`,
            })
        ).to.be.revertedWith("0 tokens balance");
      });

      it("Should  NOT mint without tierDatas", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;

        await expect(
          accessControl.createLaunchpad(datas, [], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Must have at least one tier");
      });
      it("Should  NOT mint with 6 tierDatas", async () => {
        let price = await accessControl.launchpadPrice();
        let datas = LAUNCHPAD_DATAS_EXEMPLE;
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;

        await expect(
          accessControl.createLaunchpad(
            datas,
            [
              TIER_DATAS_EXEMPLE,
              TIER_DATAS_EXEMPLE,
              TIER_DATAS_EXEMPLE,
              TIER_DATAS_EXEMPLE,
              TIER_DATAS_EXEMPLE,
              TIER_DATAS_EXEMPLE,
            ],
            "pubURI",
            {
              value: `${price}`,
            }
          )
        ).to.be.revertedWith("Too many tiers datas");
      });
    });
  });
  describe("Lock Token: Launchpad", () => {
    let token;
    let datas;
    let price;

    let launchpad;
    const tokens = 100000000;
    beforeEach(async () => {
      token = await _testInitToken(this.owner, "Django", "DJN", tokens);
      datas = LAUNCHPAD_DATAS_EXEMPLE;
      datas.saleStart = new Date().getTime() + 10000;

      datas.saleEnd = new Date().getTime() + 100000;
      datas.tokenAddress = token.target;
      price = await accessControl.launchpadPrice();
      await token.transfer(this.addr1.address, tokens);
      await accessControl
        .connect(this.addr1)
        .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

      let launchpads = await contract.getLaunchpads(2);

      let _launchpad = await contract.getLaunchpad(launchpads[0]);
      await token.connect(this.addr1).approve(_launchpad, tokens);
      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
    });
    describe("WORKS", () => {
      it("Should  have good allowance", async () => {
        expect(
          await token.allowance(this.addr1.address, launchpad.target)
        ).to.be.equal(tokens);
      });
      it("Should  receive royalties", async () => {
        await launchpad.connect(this.addr1).lockTokens(tokens);
        const royalties = tokens / 100;

        expect(await token.balanceOf(LC.owner())).to.be.equal(royalties);
      });

      it("Should  substract royalties", async () => {
        await launchpad.connect(this.addr1).lockTokens(tokens);

        const royalties = tokens / 100;
        const afterRoyalties = tokens - royalties;
        expect(
          await token.allowance(this.addr1.address, launchpad.target)
        ).to.be.equal(afterRoyalties);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT lock token if you not the owner", async () => {
        await expect(
          launchpad.connect(this.addr2).lockTokens(tokens)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should  NOT lock token if no enough funds", async () => {
        await expect(
          launchpad.connect(this.addr1).lockTokens(tokens + 100)
        ).to.be.revertedWith("No enough funds");
      });
    });
  });

  describe("Init : Launchpad", () => {
    let token;
    let owner;
    let datas;
    let launchpad;
    let _lDatas;
    let _tDatas;

    beforeEach(async () => {
      //  Transfer token to addr2 for testing allowance
      owner = await this.addr1;
      const supply = 2000000000;
      token = await _testInitToken(this.owner, "Django", "DJN", supply);
      expect(await token.balanceOf(this.owner.address)).to.be.equal(supply);

      await token.transfer(owner.address, supply);

      datas = LAUNCHPAD_DATAS_EXEMPLE;

      const currentDate = new Date();
      const futureDate = new Date(
        currentDate.getTime() + 20 * 24 * 60 * 60 * 1000
      );
      const amount = parseInt(await accessControl.launchpadPrice());
      const startDate = new Date(currentDate.getTime());
      datas.saleEnd = futureDate.getTime();
      datas.saleStart = startDate.getTime();
      _tDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];

      launchpad = await _testInitLaunchpad(
        accessControl.target,
        owner,
        token,
        amount,
        datas,
        _tDatas
      );
      _lDatas = await launchpad.getDatas();
    });

    // describe("Launchpad : Buy test", () => {
    //   const txValue = ethers.parseEther("1");
    //   beforeEach(async () => {
    //     const tokens = 100000000;
    //     await token.connect(owner).approve(launchpad.target, tokens);
    //     await launchpad.connect(owner).lockTokens(tokens);
    //   });
    //   it("Should  can buy token", async () => {
    //     await launchpad.connect(this.addr2).buyTokens({ value: txValue });
    //     let investorData = await cLI.getInvestorData(
    //       await launchpad.id(),
    //       this.addr2
    //     );
    //     expect(await token.balanceOf(launchpad.target)).to.be.equal(
    //       investorData.lockedTokens
    //     );
    //     const tierData = await launchpad.getTierDatas(
    //       await launchpad.getCurrentTierID()
    //     );

    //     expect(investorData.tier.length).to.be.equal(1);
    //     expect(investorData.tier[0]).to.be.equal(
    //       await launchpad.getCurrentTierID()
    //     );
    //     let expectedTokens = txValue / tierData.tokenPrice;
    //     expect(investorData.investedAmount).to.be.equal(txValue);
    //     expect(investorData.lockedTokens).to.be.equal(expectedTokens);
    //     await launchpad.connect(this.addr2).buyTokens({ value: txValue });
    //     investorData = await cLI.getInvestorData(
    //       await launchpad.id(),
    //       this.addr2
    //     );
    //     expect(await token.balanceOf(launchpad.target)).to.be.equal(
    //       investorData.lockedTokens
    //     );
    //     expectedTokens = investorData.investedAmount / tierData.tokenPrice;
    //     expect(investorData.tier.length).to.be.equal(1);
    //     expect(investorData.investedAmount).to.be.equal(ethers.parseEther("2"));
    //     expect(investorData.lockedTokens).to.be.equal(expectedTokens);
    //   });
    //   it("Should  have true datas after buying", async () => {
    //     await launchpad.connect(this.addr2).buyTokens({ value: txValue });

    //     let datas = await launchpad.getDatas();
    //     let tierData = await launchpad.getTierDatas(
    //       await launchpad.getCurrentTierID()
    //     );

    //     expect(datas.totalUser).to.be.equal(1);
    //     expect(tierData.users).to.be.equal(1);
    //     expect(tierData.amountRaised).to.be.equal(txValue);

    //     await launchpad.connect(this.addr2).buyTokens({ value: txValue });
    //     tierData = await launchpad.getTierDatas(
    //       await launchpad.getCurrentTierID()
    //     );
    //     expect(datas.totalUser).to.be.equal(1);
    //     expect(tierData.users).to.be.equal(1);
    //     expect(tierData.amountRaised).to.be.equal(ethers.parseEther("2"));
    //   });
    // });
  });
});
