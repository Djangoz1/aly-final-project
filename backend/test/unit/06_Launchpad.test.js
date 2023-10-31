// 2040
const { ethers, network } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitLaunchpad,

  _testInitToken,
  _testInitAll,
  getContractAt,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
  ZERO_ADDRESS,
  waitSeconds,
} = require("../../helpers/test_utils");
const { _createFeature } = require("../../utils/web3-tools");

const CONTRACT_NAME = "LaunchpadHub";

describe.only(`Contract ${CONTRACT_NAME} `, () => {
  let apiPost;
  let apiGet;
  let addressSystem;

  let balancesHub;
  let contract;
  let contracts;
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
    contracts = await _testInitAll();
    apiPost = contracts.systems.apiPost;
    apiGet = contracts.systems.apiGet;
    addressSystem = contracts.systems.addressSystem;
    balancesHub = contracts.systems.balancesHub;
    // return;

    await apiPost.createCV("_tokenURI");
    await apiPost.connect(this.addr1).createCV("_tokenURI");
    await apiPost.connect(this.addr2).createCV("_tokenURI");

    contract = contracts.launchpads.hub;
  });

  describe("Init : Launchpad", () => {
    it("Should have good launchpad price", async () => {
      let price = await balancesHub.launchpadPrice();
      expect(price).to.be.equal(ethers.parseEther("0.4"));
    });

    it("Should  have 0 token", async () => {
      expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(0);
    });
    describe("NOT WORKS", () => {
      it("Should  NOT use getLaunchpad for unknow ID", async () => {
        await expect(apiGet.addressOfLaunchpad(1)).to.be.revertedWith(
          "Error ID"
        );
      });

      it("Should  NOT mint launchpad without proxyBindings", async () => {
        await expect(
          contract.mint(1, LAUNCHPAD_DATAS_EXEMPLE, [TIER_DATAS_EXEMPLE])
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
      price = await balancesHub.launchpadPrice();
    });

    describe("WORKS", () => {
      it("Should mint launchpad ", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "tokenURI", {
          value: `${price}`,
        });
        expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
      });

      it("Should return true token address", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);

        expect(_datas.tokenAddress).to.be.equal(token.target);
      });

      it("Should return 0 total user", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.totalUser).to.be.equal(0);
      });

      it("Should return true pub URI", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI1", {
          value: `${price}`,
        });
        let _length = await apiGet.tokensLengthOf(contract.target);
        let uri = await apiGet.tokenURIOf(
          _length,
          await addressSystem.launchpadsDatasHub()
        );

        expect(uri).to.be.equal("pubURI1");
      });

      it("Should return true number of tier", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.numberOfTier).to.be.equal(1);
      });

      it("Should return true locked time", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.lockedTime).to.be.equal(datas.lockedTime);
      });

      it("Should return true min invest", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.minInvest).to.be.equal(datas.minInvest);
      });

      it("Should return true max invest", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.maxInvest).to.be.equal(datas.maxInvest);
      });

      it("Should return true sale start", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.saleStart).to.be.equal(datas.saleStart);
      });

      it("Should return true sale end", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.saleEnd).to.be.equal(datas.saleEnd);
      });

      it("Should return true id", async () => {
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

        let length = await apiGet.tokensLengthOf(contract.target);
        expect(length).to.be.equal(1);
      });

      it("Should  return true max cap", async () => {
        let tierDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];
        await apiPost.createLaunchpad(datas, tierDatas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);
        let _maxCap = 0n;
        for (let index = 0; index < tierDatas.length; index++) {
          const element = tierDatas[index];
          _maxCap += element.maxTierCap;
        }
        expect(_datas.maxCap).to.be.equal(_maxCap);
      });

      it("Should  return true min cap", async () => {
        let tierDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];
        await apiPost.createLaunchpad(datas, tierDatas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);

        let _minCap = 0n;
        for (let index = 0; index < tierDatas.length; index++) {
          const element = tierDatas[index];

          _minCap += element.minTierCap;
        }

        expect(_datas.minCap).to.be.equal(_minCap);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT mint launchpad with wrong bindings", async () => {
        await expect(
          contract.mint(1, LAUNCHPAD_DATAS_EXEMPLE, [TIER_DATAS_EXEMPLE])
        ).to.be.revertedWith("Must call function with proxy bindings");
      });

      it("Should  NOT mint launchpad without cv", async () => {
        let price = await balancesHub.launchpadPrice();
        await expect(
          apiPost
            .connect(this.addr4)
            .createLaunchpad(
              LAUNCHPAD_DATAS_EXEMPLE,
              [TIER_DATAS_EXEMPLE],
              "pubURI",
              {
                value: `${price}`,
              }
            )
        ).to.be.revertedWith("CV not found");
      });

      it("Should  NOT mint launchpad with wrong value", async () => {
        await expect(
          apiPost.createLaunchpad(
            LAUNCHPAD_DATAS_EXEMPLE,
            [TIER_DATAS_EXEMPLE],
            "pubURI",
            {
              value: `2000`,
            }
          )
        ).to.be.revertedWith("Launchpad price : Invalid value");
      });

      it("Should  NOT mint launchpad without pubURI", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };

        await expect(
          apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], {
            value: `${price}`,
          })
        ).to.be.revertedWith("Launchpad price : Invalid value");
      });

      it("Should  NOT mint launchpad with wrong sale start", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = 0;

        await expect(
          apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Invalid sale start");
      });

      it("Should  NOT mint launchpad with wrong sale end", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime();
        datas.saleEnd = 0;
        await expect(
          apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Invalid sale end");

        datas.saleEnd = datas.saleStart - 1000;

        await expect(
          apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Missmatch sale time");
      });

      it("Should  NOT mint launchpad with 0 tokenAddress", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleEnd = datas.saleStart + 1000;
        datas.tokenAddress = ZERO_ADDRESS;

        await expect(
          apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Invalid address");
      });

      it("Should  NOT mint without balance of tokenAddress", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;
        datas.saleEnd = datas.saleStart + 1000;

        await expect(
          apiPost
            .connect(this.addr2)
            .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
              value: `${price}`,
            })
        ).to.be.revertedWith("0 tokens balance");
      });

      it("Should  NOT mint without tierDatas", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;

        await expect(
          apiPost.createLaunchpad(datas, [], "pubURI", {
            value: `${price}`,
          })
        ).to.be.revertedWith("Must have at least one tier");
      });

      it("Should  NOT mint with 6 tierDatas", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        let token = await _testInitToken(this.owner, "Django", "DJN", 300000);
        datas.tokenAddress = token.target;

        await expect(
          apiPost.createLaunchpad(
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
    let launchpadID;
    let launchpad;
    const tokens = 100000000;
    beforeEach(async () => {
      token = await _testInitToken(this.owner, "Django", "DJN", tokens);
      datas = LAUNCHPAD_DATAS_EXEMPLE;
      datas.saleStart = new Date().getTime() + 10000;

      datas.saleEnd = new Date().getTime() + 100000;
      datas.tokenAddress = token.target;
      price = await balancesHub.launchpadPrice();
      await token.transfer(this.addr1.address, tokens);
      await apiPost
        .connect(this.addr1)
        .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

      let launchpads = await contract.indexerOf(2);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      await token.connect(this.addr1).approve(_launchpad, tokens);
      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();
    });
    describe("WORKS", () => {
      it("Should  have good allowance", async () => {
        expect(
          await token.allowance(this.addr1.address, launchpad.target)
        ).to.be.equal(tokens);
      });

      it("Should  receive royalties", async () => {
        let balance = await token.balanceOf(contract.owner());
        await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);
        let _balance = await token.balanceOf(contract.owner());
        expect(_balance > balance).to.equal(true);
      });

      it("Should  substract royalties", async () => {
        await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);

        const royalties = tokens / 100;
        const afterRoyalties = tokens - royalties;
        expect(
          await token.allowance(this.addr1.address, launchpad.target)
        ).to.be.equal(afterRoyalties);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT works with wrong bindings", async () => {
        await expect(launchpad.lockTokens(1, tokens)).to.be.revertedWith(
          "Must call function with proxy bindings"
        );
      });

      it("Should  NOT lock with 0 token", async () => {
        await expect(apiPost.lockTokens(launchpadID, 0)).to.be.revertedWith(
          "Invalid tokens quantity"
        );
      });

      it("Should  NOT work twice", async () => {
        await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);
        await expect(
          apiPost.connect(this.addr1).lockTokens(launchpadID, tokens)
        ).to.be.revertedWith("Wrong status expected");
      });

      it("Should  NOT lock token if you not the owner", async () => {
        await expect(
          apiPost.connect(this.addr2).lockTokens(launchpadID, tokens)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should  NOT lock token if no enough funds", async () => {
        await expect(
          apiPost.connect(this.addr1).lockTokens(launchpadID, tokens + 100)
        ).to.be.revertedWith("No enough funds");
      });
    });
  });

  describe.only("Buy Token: Launchpad", () => {
    let token;
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    const tokens = 100000000;
    let timestamp;
    beforeEach(async () => {
      token = await _testInitToken(this.addr1, "Django", "DJN", tokens);
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;
      datas.tokenAddress = token.target;
      datas.saleStart = timestamp + 3000;
      await apiPost
        .connect(this.addr1)
        .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

      let launchpads = await contract.indexerOf(2);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      await token
        .connect(this.addr1)
        .approve(_launchpad, await token.totalSupply());

      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();
      await apiPost
        .connect(this.addr1)
        .lockTokens(launchpadID, await token.totalSupply());

      const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }
      await network.provider.send("evm_mine");

      block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      expect(await apiGet.currentTierIDOf(launchpadID)).to.equal(0);
    });
    describe("WORKS", () => {
      it("Should  have good status", async () => {
        expect(await launchpad.status()).to.be.equal(1);
      });

      it("Should have good current tier ID", async () => {
        expect(await apiGet.currentTierIDOf(launchpadID)).to.be.equal(0);
      });

      it("Should  buy tokens ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.investedAmount).to.equal(price * 30n);
        expect(datasInvest.tier.length).to.equal(1);
        expect(datasInvest.tier[0]).to.equal(currentTier);
        expect(datasInvest.lockedTokens).to.equal(
          BigInt(30) * BigInt(10 ** 18)
        );
      });

      it("Should  update launchpad balance ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          BigInt(30 * 10 ** 18)
        );
      });

      it("Should  return 0 balance for investor ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(this.addr2.address)).to.be.equal(0);
      });

      it("Should  return launchpad balance after multiple buy ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          BigInt(60 * 10 ** 18)
        );
      });

      it("Should  update lockedTokens investor", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.lockedTokens).to.equal(
          BigInt(30) * BigInt(10 ** 18)
        );
      });

      it("Should  return lockedTokens investor after multiple buy", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.lockedTokens).to.equal(
          BigInt(60) * BigInt(10 ** 18)
        );
      });

      it("Should  update investedAmount  ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.investedAmount).to.equal(price * 30n);
      });

      it("Should  update change tier datas invest  ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.tier.length).to.equal(1);
        expect(datasInvest.tier[0]).to.equal(currentTier);
      });

      it("Should  return tier datas invest after multiple buy  ", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.tier.length).to.equal(1);
        expect(datasInvest.tier[0]).to.equal(currentTier);
      });

      it("Should  update change amountRaised", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        currentDatas = await apiGet.tierOfLaunchpad(launchpadID, currentTier);

        expect(currentDatas.amountRaised).to.equal(price * 30n);
      });

      it("Should  return  amountRaised after multiple buy", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        currentDatas = await apiGet.tierOfLaunchpad(launchpadID, currentTier);

        expect(currentDatas.amountRaised).to.equal(price * 30n * 2n);
      });

      it("Should  update tier users", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        currentDatas = await apiGet.tierOfLaunchpad(launchpadID, currentTier);
        expect(currentDatas.users).to.equal(1);
      });

      it("Should  return true tier users after multiple buy", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        currentDatas = await apiGet.tierOfLaunchpad(launchpadID, currentTier);

        expect(currentDatas.users).to.equal(1);
      });

      it("Should  return true users after different buyer", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });
        currentDatas = await apiGet.tierOfLaunchpad(launchpadID, currentTier);
        expect(currentDatas.users).to.equal(2);
      });

      it("Should  update total users", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
      });

      it("Should  update for min invest value", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.minInvest });
        datas = await apiGet.datasOfLaunchpad(launchpadID);
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        expect(datasInvest.lockedTokens).to.equal(
          (datas.minInvest * BigInt(10 ** 18)) / price
        );
        expect(datas.totalUser).to.equal(1);
        expect(currentDatas.amountRaised).to.equal(datas.minInvest);
      });

      it("Should  update for max invest value", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        datas = await apiGet.datasOfLaunchpad(launchpadID);
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        expect(datasInvest.lockedTokens).to.equal(
          (datas.maxInvest * BigInt(10 ** 18)) / price
        );
        expect(datas.totalUser).to.equal(1);
        expect(currentDatas.amountRaised).to.equal(datas.maxInvest);
      });

      it("Should  return true total users after multiple buy", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
      });

      it("Should  return true total users after different buyer", async () => {
        let currentTier = await apiGet.currentTierIDOf(launchpadID);
        let currentDatas = await apiGet.tierOfLaunchpad(
          launchpadID,
          currentTier
        );
        let price = currentDatas.tokenPrice;
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(2);
      });

      it("Should  change tier ID if amountRaised > maxTierCap", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest =
          TIER_DATAS_EXEMPLE.maxTierCap + TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(
            datas,
            [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
            "pubURI",
            {
              value: `${price}`,
            }
          );

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await apiPost.connect(this.addr1).buyTokens(launchpadID, {
          value: TIER_DATAS_EXEMPLE.maxTierCap,
        });

        await apiPost.connect(this.addr1).buyTokens(launchpadID, {
          value: TIER_DATAS_EXEMPLE.maxTierCap,
        });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );

        expect(datasInvest.investedAmount).to.equal(datas.maxInvest);
        expect(datasInvest.tier.length).to.equal(2);
      });

      it("Should  change status if amountRaised == maxCap", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpadID = await apiGet.tokensLengthOf(
          await addressSystem.launchpadsHub()
        );
        let _launchpad = await apiGet.addressOfLaunchpad(launchpadID);
        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await apiPost.connect(this.addr1).buyTokens(launchpadID, {
          value: TIER_DATAS_EXEMPLE.maxTierCap,
        });
        // await apiPost.connect(this.addr1).buyTokens(launchpadID, {
        //   value: 10,
        // });

        expect(await launchpad.status()).to.be.equal(3);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT works with wrong bindings", async () => {
        await expect(
          launchpad.connect(this.addr1).buyTokens(2, 500)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });

      it("Should  NOT works if status not started", async () => {
        let _datas = datas;
        _datas.saleEnd = timestamp + 50000;
        _datas.saleStart = timestamp + 30000;
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(_datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          }); // revert invalid sale start

        await expect(
          apiPost.connect(this.addr1).buyTokens(2, { value: 3000 })
        ).to.be.revertedWith("Wrong status expected");
      });

      it("Should  NOT works  before saleStart", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime() + 1000;

        datas.saleEnd = new Date().getTime() + 1100;
        datas.tokenAddress = token.target;

        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        await expect(
          apiPost
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Sale not started");
      });

      it("Should  NOT works  after saleEnd", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime() + 1000;

        datas.saleEnd = new Date().getTime() + 1100;
        datas.tokenAddress = token.target;

        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const currentTimestamp = Math.floor(Date.now() / 1000); // Convertit le timestamp en secondes
        const secondsToIncrease = datas.saleEnd - currentTimestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPost
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Sale ended");
      });

      it("Should  NOT works if balance owner < invest ", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 100;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        await token
          .connect(this.addr1)
          .transfer(this.owner.address, await token.balanceOf(this.addr1));
        const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }
        await expect(
          apiPost
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Error value transfer");
      });

      it("Should  NOT works if amountRaised > maxCap", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 100;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        await expect(
          apiPost
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Wrong status expected");
      });

      it("Should  NOT works if 0 value", async () => {
        await expect(
          apiPost.connect(this.addr1).buyTokens(launchpadID, { value: 0 })
        ).to.be.revertedWith("Value must be more than 0");
      });

      it("Should  NOT works if value < minInvest", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);
        await expect(
          apiPost
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.minInvest - 1n })
        ).to.be.revertedWith("Value not in range invest");
      });

      it("Should  NOT works if value > maxTierCap", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest =
          TIER_DATAS_EXEMPLE.maxTierCap + TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(
            datas,
            [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
            "pubURI",
            {
              value: `${price}`,
            }
          );

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPost.connect(this.addr1).buyTokens(launchpadID, {
            value: datas.maxInvest + 1n,
          })
        ).to.be.revertedWith("AddAmount: Error tier value");
      });

      it("Should  NOT works if value > maxInvest", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.minTierCap + 1n;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPost.connect(this.addr1).buyTokens(launchpadID, {
            value: datas.maxInvest + 1n,
          })
        ).to.be.revertedWith("Value not in range invest");
      });

      it("Should  NOT works for an unknown launchpad", async () => {
        await expect(
          apiPost.connect(this.addr1).buyTokens(10, { value: 100 })
        ).to.be.revertedWith("LaunchpadHub: Error ID");
      });

      it("Should  NOT works if buyer havn't cv", async () => {
        await expect(
          apiPost.connect(this.addr7).buyTokens(launchpadID, { value: 100 })
        ).to.be.revertedWith("CV not found");
      });
    });
  });

  describe("Withdraw Tokens: Launchpad", () => {
    let token;
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    const tokens = 100000000;
    let timestamp;
    beforeEach(async () => {
      token = await _testInitToken(this.addr1, "Django", "DJN", tokens);
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;
      datas.tokenAddress = token.target;
      datas.saleStart = timestamp + 3000;
      await apiPost
        .connect(this.addr1)
        .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

      let launchpads = await contract.indexerOf(2);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      await token
        .connect(this.addr1)
        .approve(_launchpad, await token.totalSupply());

      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();
      await apiPost
        .connect(this.addr1)
        .lockTokens(launchpadID, await token.totalSupply());

      let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }

      await apiPost
        .connect(this.addr2)
        .buyTokens(launchpadID, { value: datas.maxInvest });
      await network.provider.send("evm_mine");

      block = await provider.getBlock("latest");
      timestamp = block.timestamp;

      secondsToIncrease = parseInt(datas.saleStart + datas.lockedTime);
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }
      await network.provider.send("evm_mine");
    });
    describe("WORKS", () => {
      it("Should  have good status", async () => {
        expect(await launchpad.status()).to.be.equal(3);
      });

      it("Should withdraw tokens", async () => {
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr2.address)
        );

        expect(datasInvest.lockedTokens > 0).to.be.equal(true);
        await apiPost.connect(this.addr2).withdrawTokens(launchpadID);
        datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr2.address)
        );
        expect(datasInvest.lockedTokens).to.be.equal(0);
      });
      it("Should transfer tokens", async () => {
        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr2.address)
        );

        expect(await token.balanceOf(this.addr2.address)).to.be.equal(0);
        await apiPost.connect(this.addr2).withdrawTokens(launchpadID);

        expect(await token.balanceOf(this.addr2.address)).to.be.equal(
          datasInvest.lockedTokens
        );
        expect(await token.balanceOf(launchpad.target)).to.be.equal(0);
      });
    });

    describe("NOT WORKS", () => {
      it("Should not work with wrong bindings", async () => {
        await expect(
          contracts.launchpads.investors
            .connect(this.addr2)
            .withdrawTokens(2, launchpadID)
        ).to.be.revertedWith("Only contracts can call this function");
      });

      it("Should not work if block.timestamp < release period", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;
        datas.tokenAddress = token.target;
        datas.lockedTime = 3000000n;
        datas.saleStart = timestamp + 3000;
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();
        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.totalSupply());

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        await network.provider.send("evm_mine");

        await expect(
          apiPost.connect(this.addr2).withdrawTokens(launchpadID)
        ).to.be.revertedWith("Wait release period");
      });

      it("Should not work if status !== closed", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;
        datas.tokenAddress = token.target;
        datas.lockedTime = 3000000n;
        datas.saleStart = timestamp + 3000;
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();
        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.totalSupply());

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: datas.minInvest });
        await network.provider.send("evm_mine");
        block = await provider.getBlock("latest");
        timestamp = block.timestamp;
        secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }
        await expect(
          apiPost.connect(this.addr2).withdrawTokens(launchpadID)
        ).to.be.revertedWith("Wrong status expected");
      });

      it("Should not work twice", async () => {
        await apiPost.connect(this.addr2).withdrawTokens(launchpadID);
        await expect(
          apiPost.connect(this.addr2).withdrawTokens(launchpadID)
        ).to.be.revertedWith("No funds found");
      });

      it("Should not work for unknow ID", async () => {
        await expect(
          apiPost.connect(this.addr2).withdrawTokens(3)
        ).to.be.revertedWith("Error ID");
      });

      it("Should not work if no funds", async () => {
        await expect(
          apiPost.connect(this.addr1).withdrawTokens(launchpadID)
        ).to.be.revertedWith("No funds found");
      });
    });
  });

  describe("Set Tier ID: Launchpad", () => {
    let token;
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    const tokens = 100000000;
    let timestamp;
    beforeEach(async () => {
      token = await _testInitToken(this.owner, "Django", "DJN", tokens);
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
      datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;
      datas.tokenAddress = token.target;
      datas.saleStart = timestamp + 3000;
      await apiPost.createLaunchpad(
        datas,
        [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
        "pubURI",
        {
          value: `${price}`,
        }
      );

      let launchpads = await contract.indexerOf(1);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      await token.approve(_launchpad, await token.totalSupply());

      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();
      await apiPost.lockTokens(launchpadID, await token.totalSupply());

      let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }

      await apiPost
        .connect(this.addr2)
        .buyTokens(launchpadID, { value: datas.minInvest });
    });
    describe("WORKS", () => {
      it("Should  have good status", async () => {
        expect(await launchpad.status()).to.be.equal(1);
      });

      it("Should  have current tier ID == 0", async () => {
        expect(await apiGet.currentTierIDOf(launchpadID)).to.be.equal(0);
      });

      it("Should  update status if tierID == datas.nbOfTiers", async () => {
        await apiPost.setTierID(launchpadID);
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.minInvest });
        await apiPost.setTierID(launchpadID);
        await apiPost.buyTokens(launchpadID, { value: datas.minInvest });
        await apiPost.setTierID(launchpadID);

        expect(await launchpad.status()).to.be.equal(3);
      });

      it("Should  set tier ID", async () => {
        let currentTierID = await apiGet.currentTierIDOf(launchpadID);
        await apiPost.setTierID(launchpadID);
        let _currentTierID = await apiGet.currentTierIDOf(launchpadID);
        expect(currentTierID).to.not.be.equal(_currentTierID);
        expect(currentTierID + 1n).to.be.equal(_currentTierID);
      });

      it("Should  change status if saleEnd", async () => {
        let token = await _testInitToken(this.addr1, "Django", "DJN", tokens);

        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };

        datas.tokenAddress = token.target;
        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;
        price = await balancesHub.launchpadPrice();
        await apiPost
          .connect(this.addr1)
          .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
            value: `${price}`,
          });

        let _launchpad = await apiGet.addressOfLaunchpad(2);
        await token
          .connect(this.addr1)
          .approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = 2;

        await apiPost
          .connect(this.addr1)
          .lockTokens(launchpadID, await token.balanceOf(this.addr1.address));

        const secondsToIncrease = datas.saleEnd;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }
        await apiPost.connect(this.addr1).setTierID(launchpadID);
        await expect(
          apiPost.connect(this.addr1).setTierID(launchpadID)
        ).to.be.revertedWith("Wrong status expected");
        expect(await launchpad.status()).to.be.equal(3);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT work with wrong proxy bindings", async () => {
        await expect(launchpad.setTierID()).to.be.revertedWith(
          "Must call function with proxy bindings"
        );
      });

      it("Should  NOT work twice without invest", async () => {
        await apiPost.setTierID(launchpadID);
        await expect(apiPost.setTierID(launchpadID)).to.be.revertedWith(
          "Must have minimum cap to set tierID"
        );
      });
      it("Should  NOT work if tierID == datas.nbOfTiers", async () => {
        await apiPost.setTierID(launchpadID);
        await apiPost
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.minInvest });
        await apiPost.setTierID(launchpadID);
        await apiPost.buyTokens(launchpadID, { value: datas.minInvest });
        await apiPost.setTierID(launchpadID);

        await expect(apiPost.setTierID(launchpadID)).to.be.revertedWith(
          "Wrong status expected"
        );
      });

      it("Should  NOT works if tierID == nbOfTiers == 1", async () => {
        let token = await _testInitToken(this.owner, "Django", "DJN", tokens);

        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;
        datas.tokenAddress = token.target;
        datas.saleStart = timestamp + 3000;
        await apiPost.createLaunchpad(
          datas,
          [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
          "pubURI",
          {
            value: `${price}`,
          }
        );

        let launchpads = await contract.indexerOf(1);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token.approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();
        await apiPost.lockTokens(launchpadID, await token.totalSupply());

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: datas.minInvest });

        await expect(apiPost.setTierID(launchpadID)).to.be.revertedWith(
          "Must have minimum cap to set tierID"
        );
      });
      it("Should  NOT works if minTierCap > amountRaised", async () => {
        let token = await _testInitToken(this.owner, "Django", "DJN", tokens);

        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;
        datas.tokenAddress = token.target;
        datas.saleStart = timestamp + 3000;
        await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
          value: `${price}`,
        });

        let launchpads = await contract.indexerOf(1);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token.approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();
        await apiPost.lockTokens(launchpadID, await token.totalSupply());

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: datas.minInvest });

        await apiPost.setTierID(launchpadID);
        await expect(apiPost.setTierID(launchpadID)).to.be.revertedWith(
          "Wrong status expected"
        );
        expect(await apiGet.currentTierIDOf(launchpadID)).to.be.equal(0);
      });

      it("Should  NOT set tier ID if not owner", async () => {
        await expect(
          apiPost.connect(this.addr1).setTierID(launchpadID)
        ).to.be.revertedWith("Not the owner");
      });
    });
  });

  describe("Create Mission with Launchpad balance", () => {
    let token;
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    const tokens = 100000000;
    let timestamp;
    beforeEach(async () => {
      token = await _testInitToken(this.owner, "Django", "DJN", tokens);
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;
      datas.tokenAddress = token.target;
      datas.saleStart = timestamp + 3000;
      await apiPost.createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
        value: `${price}`,
      });

      let launchpads = await contract.indexerOf(1);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      await token.approve(_launchpad, await token.totalSupply());

      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();
      await apiPost.lockTokens(launchpadID, await token.totalSupply());

      let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }

      await apiPost
        .connect(this.addr2)
        .buyTokens(launchpadID, { value: datas.maxInvest });
      await network.provider.send("evm_mine");

      block = await provider.getBlock("latest");
      timestamp = block.timestamp;

      secondsToIncrease = parseInt(
        datas.saleStart + datas.lockedTime - timestamp
      );
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }
      await network.provider.send("evm_mine");
    });
    describe("WORKS", () => {
      it("Should  have good status", async () => {
        expect(await launchpad.status()).to.be.equal(3);
      });

      it("Should have true balance", async () => {
        let balance = await balancesHub.launchpadBalance(launchpadID);
        expect(balance).to.be.equal(datas.maxInvest);
        expect(balance > (await balancesHub.missionPrice())).to.equal(true);
      });

      it("Should have true owner", async () => {
        expect(this.owner.address === (await launchpad.owner())).to.equal(true);
      });

      it("createMissionLaunchpad should update datas mission", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let datas = await apiGet.datasOfMission(missions[0]);
        expect(datas.launchpad).to.be.equal(launchpadID);
      });

      it("Should create mission with launchpad balance", async () => {
        let balance = await balancesHub.launchpadBalance(launchpadID);
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");

        let _balance = await balancesHub.launchpadBalance(launchpadID);
        expect(balance).to.equal(_balance + (await balancesHub.missionPrice()));

        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        expect(missions.length === 1).to.equal(true);

        expect(missions[0] > 0).to.equal(true);
      });

      it("Should create feature with launchpad balance", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];
        let wadge = ethers.parseEther("0.4");

        let balance = await balancesHub.launchpadBalance(launchpadID);

        await apiPost.createFeatureLaunchpad(
          wadge,
          missionID,
          30,
          true,
          "tokenURi",
          12
        );
        let _balance = await balancesHub.launchpadBalance(launchpadID);

        expect(balance).to.be.equal(_balance + wadge);
      });

      it("Should create feature with full balance", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];

        let balance = await balancesHub.launchpadBalance(launchpadID);

        await apiPost.createFeatureLaunchpad(
          balance,
          missionID,
          30,
          true,
          "tokenURi",
          12
        );
        let _balance = await balancesHub.launchpadBalance(launchpadID);

        expect(_balance).to.be.equal(0);
      });
    });

    describe("NOT WORKS", () => {
      it("Should not create mission if not the owner", async () => {
        await expect(
          apiPost
            .connect(this.addr1)
            .createMissionLaunchpad(launchpadID, "tokenURI")
        ).to.be.revertedWith("APIPost: Error create mission");
      });

      it("Should not create feature if not the owner", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];

        let balance = await balancesHub.launchpadBalance(launchpadID);

        await expect(
          apiPost
            .connect(this.addr1)
            .createFeatureLaunchpad(
              balance,
              missionID,
              30,
              true,
              "tokenURi",
              12
            )
        ).to.be.revertedWith("Not the owner");
      });

      it("Should not create feature if mission wasn't linked to launchpad", async () => {
        await apiPost.createMission("tokenURI", {
          value: await balancesHub.missionPrice(),
        });

        let missionID = 1;

        await expect(
          apiPost.createFeatureLaunchpad(
            800,
            missionID,
            30,
            true,
            "tokenURi",
            12
          )
        ).to.be.revertedWith("LaunchpadHub: Error ID");
      });

      it("Should not create feature if launchpad balance < wadge", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];

        let balance = await balancesHub.launchpadBalance(launchpadID);

        await expect(
          apiPost.createFeatureLaunchpad(
            balance + 1n,
            missionID,
            30,
            true,
            "tokenURi",
            12
          )
        ).to.be.revertedWith("APIPost: Error create feature");
      });

      it("Should not create mission if launchpad balance <= missionPrice", async () => {
        let token = await _testInitToken(this.owner, "Django", "DJN", tokens);

        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);
        let tierDatas = { ...TIER_DATAS_EXEMPLE };
        tierDatas.minTierCap = (await balancesHub.missionPrice()) - 10n;
        tierDatas.maxTierCap = (await balancesHub.missionPrice()) - 1n;
        datas.minInvest = 200;

        datas.maxInvest = tierDatas.maxTierCap;

        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;
        datas.tokenAddress = token.target;
        datas.saleStart = timestamp + 3000;
        await apiPost.createLaunchpad(datas, [tierDatas], "pubURI", {
          value: `${price}`,
        });

        let launchpads = await contract.indexerOf(1);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        await token.approve(_launchpad, await token.totalSupply());

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();
        await apiPost.lockTokens(launchpadID, await token.totalSupply());

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPost
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        await network.provider.send("evm_mine");

        block = await provider.getBlock("latest");
        timestamp = block.timestamp;

        secondsToIncrease = parseInt(datas.saleStart + datas.lockedTime);
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }
        await network.provider.send("evm_mine");

        await expect(
          apiPost.createMissionLaunchpad(launchpadID, "tokenURI")
        ).to.be.revertedWith("APIPost: Error create mission");
      });
    });
  });
});
