// // 2040
// const { ethers, network } = require("hardhat");
// const { expect, assert } = require("chai");

// const {
//   _testInitLaunchpad,

//   _testInitToken,
//   _testInitAll,
//   getContractAt,
// } = require("../../helpers/test_init");
// const {
//   PUB_DATAS_EXEMPLE,
//   FEATURE_DATAS_EXEMPLE,
//   LAUNCHPAD_DATAS_EXEMPLE,
//   TIER_DATAS_EXEMPLE,
//   ZERO_ADDRESS,
//   waitSeconds,
// } = require("../../helpers/test_utils");
// const { _createFeature } = require("../../utils/web3-tools");

// const CONTRACT_NAME = "LaunchpadHub";

// describe.only(`Contract ${CONTRACT_NAME} `, () => {
//   let apiPost;
//   let apiGet;
//   let addressSystem;

//   let balancesHub;
//   let contract;
//   let contracts;
//   beforeEach(async () => {
//     [
//       this.owner,
//       this.addr1,
//       this.addr2,
//       this.addr3,
//       this.addr4,
//       this.addr5,
//       this.addr6,
//       this.addr7,
//     ] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
//     contracts = await _testInitAll();
//     apiPost = contracts.systems.apiPost;
//     apiGet = contracts.systems.apiGet;
//     addressSystem = contracts.systems.addressSystem;
//     balancesHub = contracts.systems.balancesHub;
//     // return;

//     await apiPost.createCV("_tokenURI");
//     await apiPost.connect(this.addr1).createCV("_tokenURI");
//     await apiPost.connect(this.addr2).createCV("_tokenURI");

//     contract = contracts.launchpads.hub;
//   });

//   describe.only("Scenario", () => {
//     let token;
//     let datas;
//     let price;
//     const tokens = 100000000;

//     let launchpad;
//     let launchpadID;
//     let timestamp;
//     let block;
//     beforeEach(async () => {
//       token = await _testInitToken(this.addr1, "Django", "DJN", tokens);
//       datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//       const provider = ethers.provider;
//       block = await provider.getBlock("latest");
//       timestamp = block.timestamp;
//       datas.saleEnd = timestamp + 100000;
//       datas.tokenAddress = token.target;
//       datas.saleStart = timestamp + 3000;
//       datas.saleStart = new Date().getTime() + 10000;

//       datas.saleEnd = new Date().getTime() + 100000;
//       datas.tokenAddress = token.target;
//       price = await balancesHub.launchpadPrice();
//     });

//     describe("With 3 tiers", async () => {
//       let tierDatas;

//       beforeEach(async () => {
//         tierDatas = [
//           TIER_DATAS_EXEMPLE,
//           TIER_DATAS_EXEMPLE,
//           TIER_DATAS_EXEMPLE,
//         ];
//         await apiPost
//           .connect(this.addr1)
//           .createLaunchpad(datas, tierDatas, "tokenURI", {
//             value: `${price}`,
//           });

//         let launchpads = await contract.indexerOf(
//           await apiGet.cvOf(this.addr1.address)
//         );

//         let _launchpad = await apiGet.addressOfLaunchpad(launchpads[0]);

//         launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//         launchpadID = await launchpad.id();
//       });
//       it("Should  return true max cap", async () => {
//         let _datas = await apiGet.datasOfLaunchpad(1);
//         let _maxCap = 0n;
//         for (let index = 0; index < tierDatas.length; index++) {
//           const element = tierDatas[index];
//           _maxCap += element.maxTierCap;
//         }
//         expect(_datas.maxCap).to.be.equal(_maxCap);
//       });

//       it("Should  return true min cap", async () => {
//         let _datas = await apiGet.datasOfLaunchpad(1);
//         let _minCap = 0n;
//         for (let index = 0; index < tierDatas.length; index++) {
//           const element = tierDatas[index];
//           _minCap += element.minTierCap;
//         }
//         expect(_datas.minCap).to.be.equal(_minCap);
//       });
//     });

//     describe("With original value ", async () => {
//       let launchpadAddr;
//       beforeEach(async () => {
//         await apiPost
//           .connect(this.addr1)
//           .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "tokenURI", {
//             value: `${price}`,
//           });
//         let launchpads = await contract.indexerOf(
//           await apiGet.cvOf(this.addr1.address)
//         );

//         launchpadAddr = await apiGet.addressOfLaunchpad(launchpads[0]);

//         launchpad = await ethers.getContractAt("Launchpad", launchpadAddr);
//         launchpadID = await launchpad.id();
//       });

//       describe("Create mission", async () => {
//         describe("WORKS", () => {
//           it("Should mint launchpad ", async () => {
//             expect(await apiGet.tokensLengthOf(contract.target)).to.be.equal(1);
//           });

//           it("Should return true token address", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.tokenAddress).to.be.equal(token.target);
//           });

//           it("Should return 0 total user", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.totalUser).to.be.equal(0);
//           });

//           it("Should return true pub URI", async () => {
//             let _length = await apiGet.tokensLengthOf(contract.target);
//             let uri = await apiGet.tokenURIOf(
//               _length,
//               await addressSystem.launchpadsDatasHub()
//             );

//             expect(uri).to.be.equal("pubURI1");
//           });

//           it("Should return true number of tier", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.numberOfTier).to.be.equal(1);
//           });

//           it("Should return true locked time", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.lockedTime).to.be.equal(datas.lockedTime);
//           });

//           it("Should return true min invest", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.minInvest).to.be.equal(datas.minInvest);
//           });

//           it("Should return true max invest", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.maxInvest).to.be.equal(datas.maxInvest);
//           });

//           it("Should return true sale start", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.saleStart).to.be.equal(datas.saleStart);
//           });

//           it("Should return true sale end", async () => {
//             let _datas = await apiGet.datasOfLaunchpad(1);
//             expect(_datas.saleEnd).to.be.equal(datas.saleEnd);
//           });

//           it("Should return true id", async () => {
//             let length = await apiGet.tokensLengthOf(contract.target);
//             expect(length).to.be.equal(1);
//           });
//         });

//         describe("NOT WORKS", () => {
//           it("Should  NOT mint launchpad with wrong bindings", async () => {
//             await expect(
//               contract.mint(1, LAUNCHPAD_DATAS_EXEMPLE, [TIER_DATAS_EXEMPLE])
//             ).to.be.revertedWith("Must call function with proxy bindings");
//           });

//           it("Should  NOT mint launchpad without cv", async () => {
//             await expect(
//               apiPost
//                 .connect(this.addr4)
//                 .createLaunchpad(
//                   LAUNCHPAD_DATAS_EXEMPLE,
//                   [TIER_DATAS_EXEMPLE],
//                   "pubURI",
//                   {
//                     value: `${price}`,
//                   }
//                 )
//             ).to.be.revertedWith("CV not found");
//           });

//           it("Should  NOT mint launchpad if value < launchpadPrice", async () => {
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(
//                   LAUNCHPAD_DATAS_EXEMPLE,
//                   [TIER_DATAS_EXEMPLE],
//                   "pubURI",
//                   {
//                     value: `2000`,
//                   }
//                 )
//             ).to.be.revertedWith("Launchpad price : Invalid value");
//           });

//           it("Should  NOT mint launchpad without pubURI", async () => {
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("Launchpad price : Invalid value");
//           });

//           it("Should  NOT mint launchpad with wrong sale start", async () => {
//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = 300;
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("Invalid sale start");
//           });

//           it("Should  NOT mint launchpad with wrong sale end", async () => {
//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = new Date().getTime();
//             datas.saleEnd = 0;
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("Invalid sale end");

//             datas.saleEnd = datas.saleStart - 1000;

//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("Missmatch sale time");
//           });

//           it("Should  NOT mint launchpad with 0 tokenAddress", async () => {
//             let _datas = { ...datas };

//             _datas.tokenAddress = ZERO_ADDRESS;

//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(_datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("Invalid address");
//           });

//           it("Should  NOT mint without balance of tokenAddress", async () => {
//             await expect(
//               apiPost
//                 .connect(this.addr2)
//                 .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                   value: `${price}`,
//                 })
//             ).to.be.revertedWith("0 tokens balance");
//           });

//           it("Should  NOT mint without tierDatas", async () => {
//             await expect(
//               apiPost.connect(this.addr1).createLaunchpad(datas, [], "pubURI", {
//                 value: `${price}`,
//               })
//             ).to.be.revertedWith("Must have at least one tier");
//           });

//           it("Should  NOT mint with 6 tierDatas", async () => {
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .createLaunchpad(
//                   datas,
//                   [
//                     TIER_DATAS_EXEMPLE,
//                     TIER_DATAS_EXEMPLE,
//                     TIER_DATAS_EXEMPLE,
//                     TIER_DATAS_EXEMPLE,
//                     TIER_DATAS_EXEMPLE,
//                     TIER_DATAS_EXEMPLE,
//                   ],
//                   "pubURI",
//                   {
//                     value: `${price}`,
//                   }
//                 )
//             ).to.be.revertedWith("Too many tiers datas");
//           });
//         });
//       });

//       let tokens;
//       beforeEach(async () => {
//         tokens = await tokens.totalSupply();
//         await token.connect(this.addr1).approve(launchpadAddr, tokens);
//         expect(
//           await token.allowance(this.addr1.address, launchpad.target)
//         ).to.be.equal(tokens);
//       });
//       console.log("-------------------- APPROVE --------------------");

//       describe("Lock tokens", async () => {
//         describe("WORKS", () => {
//           beforeEach(async () => {});
//           it("Should  have good allowance", async () => {
//             //? Check on beforeEach
//           });

//           it("Should  receive royalties", async () => {
//             let balance = await token.balanceOf(contract.owner());
//             await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);
//             let _balance = await token.balanceOf(contract.owner());
//             expect(_balance > balance).to.equal(true);
//           });

//           it("Should  substract royalties", async () => {
//             await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);

//             const royalties = tokens / 100;
//             const afterRoyalties = tokens - royalties;
//             expect(
//               await token.allowance(this.addr1.address, launchpad.target)
//             ).to.be.equal(afterRoyalties);
//           });
//         });

//         describe("NOT WORKS", () => {
//           it("Should  NOT works with wrong bindings", async () => {
//             await expect(launchpad.lockTokens(1, tokens)).to.be.revertedWith(
//               "Must call function with proxy bindings"
//             );
//           });

//           it("Should  NOT lock with 0 token", async () => {
//             await expect(apiPost.lockTokens(launchpadID, 0)).to.be.revertedWith(
//               "Invalid tokens quantity"
//             );
//           });

//           it("Should  NOT work twice", async () => {
//             await apiPost.connect(this.addr1).lockTokens(launchpadID, tokens);
//             await expect(
//               apiPost.connect(this.addr1).lockTokens(launchpadID, tokens)
//             ).to.be.revertedWith("Wrong status expected");
//           });

//           it("Should  NOT lock token if you not the owner", async () => {
//             await expect(
//               apiPost.connect(this.addr2).lockTokens(launchpadID, tokens)
//             ).to.be.revertedWith("Ownable: caller is not the owner");
//           });

//           it("Should  NOT lock token if no enough funds", async () => {
//             await expect(
//               apiPost.connect(this.addr1).lockTokens(launchpadID, tokens + 100n)
//             ).to.be.revertedWith("No enough funds");
//           });
//         });
//       });

//       let tokenPrice;
//       let currentTier;
//       let datas;

//       beforeEach(async () => {
//         await apiPost.lockTokens(launchpadID, tokens);
//         currentTier = await apiGet.currentTierIDOf(launchpadID);
//         let currentDatas = await apiGet.tierOfLaunchpad(
//           launchpadID,
//           currentTier
//         );
//         tokenPrice = currentDatas.tokenPrice;
//         await apiGet.datasOfLaunchpad(launchpadID);
//       });
//       console.log("-------------------- LOCK TOKENS --------------------");

//       describe("Buy Token: Launchpad", () => {
//         describe("WORKS", () => {
//           beforeEach(async () => {
//             const provider = ethers.provider;
//             const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//             }

//             block = await provider.getBlock("latest");
//             timestamp = block.timestamp;
//           });
//           it("Should  have good status", async () => {
//             expect(await launchpad.status()).to.be.equal(1);
//           });

//           it("Should  buy tokens ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.investedAmount).to.equal(tokenPrice * 30n);
//             expect(datasInvest.tier.length).to.equal(1);
//             expect(datasInvest.tier[0]).to.equal(currentTier);
//             expect(datasInvest.lockedTokens).to.equal(
//               BigInt(30) * BigInt(10 ** 18)
//             );
//           });

//           it("Should  update launchpad balance ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             expect(await token.balanceOf(launchpad.target)).to.be.equal(
//               BigInt(30 * 10 ** 18)
//             );
//           });

//           it("Should  return 0 balance for investor ", async () => {
//             await apiPost
//               .connect(this.addr2)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             expect(await token.balanceOf(this.addr2.address)).to.be.equal(0);
//           });

//           it("Should  return launchpad balance after multiple buy ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             expect(await token.balanceOf(launchpad.target)).to.be.equal(
//               BigInt(60 * 10 ** 18)
//             );
//           });

//           it("Should  update lockedTokens investor", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.lockedTokens).to.equal(
//               BigInt(30) * BigInt(10 ** 18)
//             );
//           });

//           it("Should  return lockedTokens investor after multiple buy", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.lockedTokens).to.equal(
//               BigInt(60) * BigInt(10 ** 18)
//             );
//           });

//           it("Should  update investedAmount  ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.investedAmount).to.equal(tokenPrice * 30n);
//           });

//           it("Should  update change tier datas invest  ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.tier.length).to.equal(1);
//             expect(datasInvest.tier[0]).to.equal(currentTier);
//           });

//           it("Should  return tier datas invest after multiple buy  ", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });

//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             expect(datasInvest.tier.length).to.equal(1);
//             expect(datasInvest.tier[0]).to.equal(currentTier);
//           });

//           it("Should  update change amountRaised", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             let currentDatas = await apiGet.tierOfLaunchpad(
//               launchpadID,
//               currentTier
//             );

//             expect(currentDatas.amountRaised).to.equal(tokenPrice * 30n);
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             currentDatas = await apiGet.tierOfLaunchpad(
//               launchpadID,
//               currentTier
//             );

//             expect(currentDatas.amountRaised).to.equal(price * 30n * 2n);
//           });

//           it("Should  update tier users", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             let currentDatas = await apiGet.tierOfLaunchpad(
//               launchpadID,
//               currentTier
//             );
//             let datas = await apiGet.datasOfLaunchpad(launchpadID);
//             expect(datas.totalUser).to.equal(1);
//             expect(currentDatas.users).to.equal(1);
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             currentDatas = await apiGet.tierOfLaunchpad(
//               launchpadID,
//               currentTier
//             );
//             expect(currentDatas.users).to.equal(1);
//             await apiPost
//               .connect(this.addr2)
//               .buyTokens(launchpadID, { value: tokenPrice * 30n });
//             expect(currentDatas.users).to.equal(2);
//             datas = await apiGet.datasOfLaunchpad(launchpadID);
//             expect(datas.totalUser).to.equal(2);
//           });

//           it("Should  update for min invest value", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: datas.minInvest });
//             datas = await apiGet.datasOfLaunchpad(launchpadID);
//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );

//             expect(datasInvest.lockedTokens).to.equal(
//               (datas.minInvest * BigInt(10 ** 18)) / price
//             );
//             expect(datas.totalUser).to.equal(1);
//           });

//           it("Should  update for max invest value", async () => {
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: datas.maxInvest });
//             datas = await apiGet.datasOfLaunchpad(launchpadID);
//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );
//             let currentTier = await apiGet.currentTierIDOf(launchpadID);
//             let currentDatas = await apiGet.tierOfLaunchpad(
//               launchpadID,
//               currentTier
//             );

//             expect(datasInvest.lockedTokens).to.equal(
//               (datas.maxInvest * BigInt(10 ** 18)) / price
//             );
//             expect(datas.totalUser).to.equal(1);
//             expect(currentDatas.amountRaised).to.equal(datas.maxInvest);
//           });

//           it("Should  change tier ID if amountRaised > maxTierCap", async () => {

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 90;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest =
//               TIER_DATAS_EXEMPLE.maxTierCap + TIER_DATAS_EXEMPLE.maxTierCap;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(
//                 datas,
//                 [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
//                 "pubURI",
//                 {
//                   value: `${price}`,
//                 }
//               );

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const secondsToIncrease = datas.saleStart - timestamp;

//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }

//             await apiPost.connect(this.addr1).buyTokens(launchpadID, {
//               value: TIER_DATAS_EXEMPLE.maxTierCap,
//             });

//             await apiPost.connect(this.addr1).buyTokens(launchpadID, {
//               value: TIER_DATAS_EXEMPLE.maxTierCap,
//             });

//             let datasInvest = await apiGet.datasOfInvestor(
//               launchpadID,
//               await apiGet.cvOf(this.addr1)
//             );

//             expect(datasInvest.investedAmount).to.equal(datas.maxInvest);
//             expect(datasInvest.tier.length).to.equal(2);
//           });

//           it("Should  change status if amountRaised == maxCap", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 90;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let _launchpad = await apiGet.addressOfLaunchpad(2);
//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = 2;

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const secondsToIncrease = datas.saleStart - timestamp;

//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }

//             await expect(
//               apiPost.connect(this.addr1).buyTokens(launchpadID, {
//                 value: TIER_DATAS_EXEMPLE.maxTierCap,
//               })
//             ).to.be.revertedWith("Sale ended");

//             expect(await launchpad.status()).to.be.equal(3);
//           });
//         });

//         describe("NOT WORKS", () => {
//           it("Should  NOT works with wrong bindings", async () => {
//             await expect(
//               launchpad.connect(this.addr1).buyTokens(2, 500)
//             ).to.be.revertedWith("Must call function with proxy bindings");
//           });

//           it("Should  NOT works if status not started", async () => {
//             let _datas = datas;
//             _datas.saleEnd = timestamp + 50000;
//             _datas.saleStart = timestamp + 30000;
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(_datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               }); // revert invalid sale start

//             await expect(
//               apiPost.connect(this.addr1).buyTokens(2, { value: 3000 })
//             ).to.be.revertedWith("Wrong status expected");
//           });

//           it("Should  NOT works  before saleStart", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = new Date().getTime() + 1000;

//             datas.saleEnd = new Date().getTime() + 1100;
//             datas.tokenAddress = token.target;

//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .buyTokens(launchpadID, { value: datas.maxInvest })
//             ).to.be.revertedWith("Sale not started");
//           });

//           it("Should  NOT works  after saleEnd", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = new Date().getTime() + 1000;

//             datas.saleEnd = new Date().getTime() + 1100;
//             datas.tokenAddress = token.target;

//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const currentTimestamp = Math.floor(Date.now() / 1000); // Convertit le timestamp en secondes
//             const secondsToIncrease = datas.saleEnd - currentTimestamp;
//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }

//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .buyTokens(launchpadID, { value: datas.maxInvest })
//             ).to.be.revertedWith("Sale already ended");
//           });

//           it("Should  NOT works if balance owner < invest ", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 100;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             await token
//               .connect(this.addr1)
//               .transfer(this.owner.address, await token.balanceOf(this.addr1));
//             const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .buyTokens(launchpadID, { value: datas.maxInvest })
//             ).to.be.revertedWith("Mismatch balance of owner and allowance !");
//           });

//           it("Should  NOT works if amountRaised > maxCap", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 100;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest = TIER_DATAS_EXEMPLE.maxTierCap;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const secondsToIncrease = parseInt(datas.saleStart) - timestamp;
//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }
//             await apiPost
//               .connect(this.addr1)
//               .buyTokens(launchpadID, { value: datas.maxInvest });
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .buyTokens(launchpadID, { value: datas.maxInvest })
//             ).to.be.revertedWith("Wrong status expected");
//           });

//           it("Should  NOT works if 0 value", async () => {
//             await expect(
//               apiPost.connect(this.addr1).buyTokens(launchpadID, { value: 0 })
//             ).to.be.revertedWith("Value must be more than 0");
//           });

//           it("Should  NOT works if value < minInvest", async () => {
//             let datas = await apiGet.datasOfLaunchpad(launchpadID);
//             await expect(
//               apiPost
//                 .connect(this.addr1)
//                 .buyTokens(launchpadID, { value: datas.minInvest - 1n })
//             ).to.be.revertedWith("Value not in range invest");
//           });

//           it("Should  NOT works if value > maxTierCap", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 90;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest =
//               TIER_DATAS_EXEMPLE.maxTierCap + TIER_DATAS_EXEMPLE.maxTierCap;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(
//                 datas,
//                 [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE],
//                 "pubURI",
//                 {
//                   value: `${price}`,
//                 }
//               );

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const secondsToIncrease = datas.saleStart - timestamp;

//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }

//             await expect(
//               apiPost.connect(this.addr1).buyTokens(launchpadID, {
//                 value: datas.maxInvest,
//               })
//             ).to.be.revertedWith("Value out of range for this tier");
//           });

//           it("Should  NOT works if value > maxInvest", async () => {
//             let token = await _testInitToken(
//               this.addr1,
//               "Django",
//               "DJN",
//               tokens
//             );

//             let datas = { ...LAUNCHPAD_DATAS_EXEMPLE };
//             datas.saleStart = timestamp + 90;

//             datas.saleEnd = timestamp + 100000000;

//             datas.tokenAddress = token.target;
//             datas.minInvest = TIER_DATAS_EXEMPLE.minTierCap;
//             datas.maxInvest = TIER_DATAS_EXEMPLE.minTierCap + 1n;
//             price = await balancesHub.launchpadPrice();
//             await apiPost
//               .connect(this.addr1)
//               .createLaunchpad(datas, [TIER_DATAS_EXEMPLE], "pubURI", {
//                 value: `${price}`,
//               });

//             let launchpads = await contract.indexerOf(2);

//             let _launchpad = await apiGet.addressOfLaunchpad(launchpads[1]);

//             await token
//               .connect(this.addr1)
//               .approve(_launchpad, await token.totalSupply());

//             let launchpad = await ethers.getContractAt("Launchpad", _launchpad);
//             let launchpadID = await launchpad.id();

//             await apiPost
//               .connect(this.addr1)
//               .lockTokens(
//                 launchpadID,
//                 await token.balanceOf(this.addr1.address)
//               );

//             const secondsToIncrease = datas.saleStart - timestamp;

//             if (secondsToIncrease > 0) {
//               await network.provider.send("evm_increaseTime", [
//                 secondsToIncrease,
//               ]);
//               await network.provider.send("evm_mine");
//             }

//             await expect(
//               apiPost.connect(this.addr1).buyTokens(launchpadID, {
//                 value: datas.maxInvest + 1n,
//               })
//             ).to.be.revertedWith("Value not in range invest");
//           });

//           it("Should  NOT works for an unknown launchpad", async () => {
//             await expect(
//               apiPost.connect(this.addr1).buyTokens(10, { value: 100 })
//             ).to.be.revertedWith("ID out of range");
//           });

//           it("Should  NOT works if buyer havn't cv", async () => {
//             await expect(
//               apiPost.connect(this.addr7).buyTokens(launchpadID, { value: 100 })
//             ).to.be.revertedWith("CV not found");
//           });
//         });
//       });
//     });
//   });
// });
