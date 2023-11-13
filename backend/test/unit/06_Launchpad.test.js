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

describe(`Contract ${CONTRACT_NAME} `, () => {
  let apiPost;
  let apiPostPayable;
  let apiGet;
  let addressSystem;
  let token;
  let balancesHub;
  let contract;
  let contracts;
  let tokenPrice;
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
    apiPostPayable = contracts.systems.apiPostPayable;
    apiGet = contracts.systems.apiGet;
    addressSystem = contracts.systems.addressSystem;
    balancesHub = contracts.systems.balancesHub;
    // return;
    token = contracts.token;
    tokenPrice = await token.price();

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
          "LaunchpadHub: Error ID"
        );
      });

      it("Should  NOT mint launchpad without proxyBindings", async () => {
        await expect(
          contract.mint(1, LAUNCHPAD_DATAS_EXEMPLE)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });
    });
  });

  describe("Create : Launchpad", () => {
    let datas;
    let price;

    beforeEach(async () => {
      datas = LAUNCHPAD_DATAS_EXEMPLE;
      datas.saleStart = new Date().getTime() + 10000;
      datas.saleEnd = new Date().getTime() + 100000;
      price = await balancesHub.launchpadPrice();
    });

    describe("WORKS", () => {
      it("Should mint launchpad ", async () => {
        await apiPostPayable.createLaunchpad(datas, "tokenURI", {
          value: `${price}`,
        });
        expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
      });

      it("Should return 0 total user", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.totalUser).to.be.equal(0);
      });

      it("Should return true pub URI", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI1",
          {
            value: `${price}`,
          }
        );
        let _length = await apiGet.tokensLengthOf(contract.target);
        let uri = await apiGet.tokenURIOf(
          _length,
          await addressSystem.launchpadsDatasHub()
        );

        expect(uri).to.be.equal("pubURI1");
      });

      it("Should return true min invest", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.minInvest).to.be.equal(datas.minInvest);
      });

      it("Should return true max invest", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.maxInvest).to.be.equal(datas.maxInvest);
      });

      it("Should return true sale start", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.saleStart).to.be.equal(datas.saleStart);
      });

      it("Should return true sale end", async () => {
        await apiPostPayable.createLaunchpad(
          datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );
        let _datas = await apiGet.datasOfLaunchpad(1);
        expect(_datas.saleEnd).to.be.equal(datas.saleEnd);
      });

      it("Should return true id", async () => {
        let _datas = { ...datas };
        _datas.id = 185;
        await apiPostPayable.createLaunchpad(
          _datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );

        let length = await apiGet.tokensLengthOf(contract.target);
        expect(length).to.be.equal(1);
      });

      it("Should return true amountRaised", async () => {
        let _datas = { ...datas };
        _datas.amountRaised = 100000;
        await apiPostPayable.createLaunchpad(
          _datas,

          "pubURI",
          {
            value: `${price}`,
          }
        );

        let id = await apiGet.tokensLengthOf(contract.target);
        let datas_ = await apiGet.datasOfLaunchpad(id);

        expect(datas_.amountRaised).to.be.equal(0);
      });

      it("Should  return true max cap", async () => {
        await apiPostPayable.createLaunchpad(datas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);

        expect(_datas.maxCap).to.be.equal(datas.maxCap);
      });

      it("Should  return true min cap", async () => {
        await apiPostPayable.createLaunchpad(datas, "pubURI", {
          value: `${price}`,
        });
        let _datas = await apiGet.datasOfLaunchpad(1);

        expect(_datas.minCap).to.be.equal(datas.minCap);
      });
    });

    describe("NOT WORKS", () => {
      it("Should  NOT mint launchpad with wrong bindings", async () => {
        await expect(
          contract.mint(1, LAUNCHPAD_DATAS_EXEMPLE)
        ).to.be.revertedWith("Must call function with proxy bindings");
      });

      it("Should  NOT mint launchpad without cv", async () => {
        let price = await balancesHub.launchpadPrice();
        await expect(
          apiPostPayable.connect(this.addr4).createLaunchpad(
            LAUNCHPAD_DATAS_EXEMPLE,

            "pubURI",
            {
              value: `${price}`,
            }
          )
        ).to.be.revertedWith("CV not found");
      });

      it("Should  NOT mint launchpad with wrong value", async () => {
        await expect(
          apiPostPayable.createLaunchpad(
            LAUNCHPAD_DATAS_EXEMPLE,

            "pubURI",
            {
              value: `2000`,
            }
          )
        ).to.be.revertedWith("APIPostPayable: value must be equal to price");
      });

      it("Should  NOT mint launchpad without pubURI", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };

        await expect(
          apiPostPayable.createLaunchpad(datas, {
            value: `${price}`,
          })
        ).to.be.revertedWith("Must have tokenURI");
      });

      it("Only on prod: Should  NOT mint launchpad with wrong sale start", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = 0;

        await expect(
          apiPostPayable.createLaunchpad(
            datas,

            "pubURI",
            {
              value: `${price}`,
            }
          )
        ).to.be.revertedWith("Invalid sale start");
      });

      it("Should  NOT mint launchpad with wrong sale end", async () => {
        let price = await balancesHub.launchpadPrice();
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime();
        datas.saleEnd = 0;
        await expect(
          apiPostPayable.createLaunchpad(
            datas,

            "pubURI",
            {
              value: `${price}`,
            }
          )
        ).to.be.revertedWith("Invalid sale end");

        datas.saleEnd = datas.saleStart - 1000;

        await expect(
          apiPostPayable.createLaunchpad(
            datas,

            "pubURI",
            {
              value: `${price}`,
            }
          )
        ).to.be.revertedWith("Missmatch sale time");
      });
    });
  });

  describe("Buy Token: Launchpad", () => {
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    let timestamp;
    beforeEach(async () => {
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;
      datas.saleStart = timestamp + 3000;
      await apiPostPayable
        .connect(this.addr1)
        .createLaunchpad(datas, "pubURI", {
          value: `${price}`,
        });

      let launchpads = await contract.indexerOf(2);

      let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

      launchpad = await ethers.getContractAt("Launchpad", _launchpad);
      launchpadID = await launchpad.id();

      const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }
      await network.provider.send("evm_mine");

      block = await provider.getBlock("latest");
      timestamp = block.timestamp;
    });
    describe("WORKS", () => {
      it("Should  have good status", async () => {
        expect(await launchpad.status()).to.be.equal(1);
      });

      it("Should  buy tokens ", async () => {
        let price = await token.price();
        expect(await token.staked(this.addr1.address)).to.be.equal(0);
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );

        expect(datasInvest.investedAmount).to.equal(price * 30n);
        // ? Discount 10%
        expect((await token.staked(this.addr1.address)) / 10n ** 18n).to.equal(
          ((datasInvest.investedAmount / (price - price / 10n)) * 10n ** 18n) /
            10n ** 18n
        );
      });

      it("Should  update launchpad balance ", async () => {
        let price = await token.price();
        expect(await token.balanceOf(launchpad.target)).to.be.equal(0);
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          30n * 10n ** 18n
        );
      });

      it("Should  return 0 balance for investor ", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(this.addr2.address)).to.be.equal(0);
      });

      it("Should  return launchpad balance after multiple buy ", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          BigInt(60 * 10 ** 18)
        );
      });

      it("Should  return lockedTokens investor after multiple buy", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        expect((await token.staked(this.addr1.address)) / 10n ** 18n).to.equal(
          BigInt(66) // ? Discount of 10%
        );
      });

      it("Should  update investedAmount  ", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });

        let datasInvest = await apiGet.datasOfInvestor(
          launchpadID,
          await apiGet.cvOf(this.addr1)
        );
        expect(datasInvest.investedAmount).to.equal(price * 30n);
      });

      it("Should  update change amountRaised", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.amountRaised).to.equal(price * 30n);
      });

      it("Should  return  amountRaised after multiple buy", async () => {
        let price = await token.price();

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.amountRaised).to.equal(price * 30n * 2n);
      });

      it("Should  return true users after different buyer", async () => {
        let price = await token.price();
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);
        expect(datas.totalUser).to.equal(2);
      });

      it("Should  update total users", async () => {
        let price = await token.price();
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
      });

      it("Should  update for min invest value", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.minInvest });
        datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
        expect(datas.amountRaised).to.equal(datas.minInvest);
      });

      it("Should  update for max invest value", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
        expect(datas.amountRaised).to.equal(datas.maxInvest);
      });

      it("Should  return true total users after multiple buy", async () => {
        let price = await token.price();
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(1);
      });

      it("Should  return true total users after different buyer", async () => {
        let price = await token.price();
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: price * 30n });
        await apiPostPayable
          .connect(this.addr2)
          .buyTokens(launchpadID, { value: price * 30n });
        let datas = await apiGet.datasOfLaunchpad(launchpadID);

        expect(datas.totalUser).to.equal(2);
      });

      it("Should  change status if amountRaised == maxCap", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.minInvest = datas.minCap;
        datas.maxInvest = datas.maxCap;
        price = await balancesHub.launchpadPrice();
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpadID = await apiGet.tokensLengthOf(
          await addressSystem.launchpadsHub()
        );
        let _launchpad = await apiGet.addressOfLaunchpad(launchpadID);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await apiPostPayable.connect(this.addr1).buyTokens(launchpadID, {
          value: datas.maxCap,
        });
        // await apiPostPayable.connect(this.addr1).buyTokens(launchpadID, {
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
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(_datas, "pubURI", {
            value: `${price}`,
          }); // revert invalid sale start

        await expect(
          apiPostPayable.connect(this.addr1).buyTokens(2, { value: 3000 })
        ).to.be.revertedWith("Sale not started");
      });

      it("Should  NOT works  before saleStart", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime() + 1000;

        datas.saleEnd = new Date().getTime() + 1100;

        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        await expect(
          apiPostPayable
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Sale not started");
      });

      it("Should  NOT works  after saleEnd", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = new Date().getTime() + 1000;

        datas.saleEnd = new Date().getTime() + 1100;

        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        const currentTimestamp = Math.floor(Date.now() / 1000); // Convertit le timestamp en secondes
        const secondsToIncrease = datas.saleEnd - currentTimestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPostPayable
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Sale ended");
      });

      it("Should  NOT works if amountRaised > maxCap", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 100;

        datas.saleEnd = timestamp + 100000000;

        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
        price = await balancesHub.launchpadPrice();
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }
        await apiPostPayable
          .connect(this.addr1)
          .buyTokens(launchpadID, { value: datas.maxInvest });
        await expect(
          apiPostPayable
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.maxInvest })
        ).to.be.revertedWith("Wrong status expected");
      });

      it("Should  NOT works if 0 value", async () => {
        await expect(
          apiPostPayable
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: 0 })
        ).to.be.revertedWith("Value must be more than 0");
      });

      it("Should  NOT works if value < minInvest", async () => {
        let datas = await apiGet.datasOfLaunchpad(launchpadID);
        await expect(
          apiPostPayable
            .connect(this.addr1)
            .buyTokens(launchpadID, { value: datas.minInvest - 1n })
        ).to.be.revertedWith("Value not in range invest");
      });

      it("Should  NOT works if value > maxTierCap", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.minInvest = datas.minCap;
        datas.maxInvest = datas.maxCap;
        price = await balancesHub.launchpadPrice();
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPostPayable.connect(this.addr1).buyTokens(launchpadID, {
            value: datas.maxInvest + 1n,
          })
        ).to.be.revertedWith("Value out of range");
      });

      it("Should  NOT works if value > maxInvest", async () => {
        let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
        datas.saleStart = timestamp + 90;

        datas.saleEnd = timestamp + 100000000;

        datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
        datas.maxInvest = TIER_DATAS_EXEMPLE.minTierCap + 1n;
        price = await balancesHub.launchpadPrice();
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);

        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        const secondsToIncrease = datas.saleStart - timestamp;

        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
          await network.provider.send("evm_mine");
        }

        await expect(
          apiPostPayable.connect(this.addr1).buyTokens(launchpadID, {
            value: datas.maxInvest + 1n,
          })
        ).to.be.revertedWith("Value not in range invest");
      });

      it("Should  NOT works for an unknown launchpad", async () => {
        await expect(
          apiPostPayable.connect(this.addr1).buyTokens(10, { value: 100 })
        ).to.be.revertedWith("LaunchpadHub: Error ID");
      });

      it("Should  NOT works if buyer havn't cv", async () => {
        await expect(
          apiPostPayable
            .connect(this.addr7)
            .buyTokens(launchpadID, { value: 100 })
        ).to.be.revertedWith("CV not found");
      });
    });
  });

  describe("Create Mission with Launchpad balance", () => {
    let datas;
    let price;
    let launchpadID;
    let launchpad;
    let launchpadAddr;
    let timestamp;
    beforeEach(async () => {
      price = await balancesHub.launchpadPrice();
      datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

      datas.maxInvest = datas.maxCap;

      const provider = ethers.provider;
      let block = await provider.getBlock("latest");
      timestamp = block.timestamp;
      datas.saleEnd = timestamp + 100000;

      datas.saleStart = timestamp + 3000;
      await apiPostPayable.createLaunchpad(datas, "pubURI", {
        value: `${price}`,
      });

      let launchpads = await contract.indexerOf(1);

      launchpadAddr = await apiGet.addressOfLaunchpad(launchpads[0]);

      launchpad = await ethers.getContractAt("Launchpad", launchpadAddr);
      launchpadID = await launchpad.id();

      let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
      if (secondsToIncrease > 0) {
        await network.provider.send("evm_increaseTime", [secondsToIncrease]);
      }

      await apiPostPayable
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
        let balance = await token.balanceOf(launchpadAddr);
        expect(
          balance > (await balancesHub.missionPrice()) * tokenPrice
        ).to.equal(true);
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
        let balance = await token.balanceOf(launchpadAddr);
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let _balance = await token.balanceOf(launchpadAddr);

        expect(balance).to.equal(
          _balance + (await balancesHub.missionPrice()) * tokenPrice
        );

        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        expect(missions.length === 1).to.equal(true);

        expect(missions[0] > 0).to.equal(true);
      });

      it("Should create feature with launchpad balance", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];
        let wadge = ethers.parseEther("0.4");

        let balance = await token.balanceOf(launchpadAddr);

        await apiPost.createFeatureLaunchpad(
          wadge,
          missionID,
          30,
          true,
          "tokenURi",
          12
        );
        let _balance = await token.balanceOf(launchpadAddr);

        expect(balance).to.be.equal(_balance + wadge);
      });

      it("Should create feature with full balance", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];

        let balance = await token.balanceOf(launchpadAddr);

        await apiPost.createFeatureLaunchpad(
          balance,
          missionID,
          30,
          true,
          "tokenURi",
          12
        );
        let _balance = await token.balanceOf(launchpadAddr);

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

        await expect(
          apiPost
            .connect(this.addr1)
            .createFeatureLaunchpad(10, missionID, 30, true, "tokenURi", 12)
        ).to.be.revertedWith("Not the owner");
      });

      it("Should not create feature if mission wasn't linked to launchpad", async () => {
        await apiPostPayable.createMission("tokenURI", {
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
        ).to.be.revertedWith("APIPost: Error create feature");
      });

      it("Should not create feature if launchpad balance < wadge", async () => {
        await apiPost.createMissionLaunchpad(launchpadID, "tokenURI");
        let missions = await apiGet.missionsOfLaunchpad(launchpadID);
        let missionID = missions[0];

        let balance = await token.balanceOf(launchpadAddr);

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
        let datas = Object.assign({}, LAUNCHPAD_DATAS_EXEMPLE);

        datas.minCap = 5;
        datas.maxCap = 1000;
        datas.minInvest = 2;
        datas.maxInvest = datas.maxCap;

        const provider = ethers.provider;
        let block = await provider.getBlock("latest");
        let timestamp = block.timestamp;
        datas.saleEnd = timestamp + 100000;

        datas.saleStart = timestamp + 3000;
        await apiPostPayable
          .connect(this.addr1)
          .createLaunchpad(datas, "pubURI", {
            value: `${price}`,
          });

        let launchpads = await contract.indexerOf(2);
        let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

        let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
        let launchpadID = await launchpad.id();

        let secondsToIncrease = parseInt(datas.saleStart) - timestamp;
        if (secondsToIncrease > 0) {
          await network.provider.send("evm_increaseTime", [secondsToIncrease]);
        }

        await apiPostPayable
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
          apiPost
            .connect(this.addr1)
            .createMissionLaunchpad(launchpadID, "tokenURI")
        ).to.be.revertedWith("APIPost: Error create mission");
      });
    });
  });
});
