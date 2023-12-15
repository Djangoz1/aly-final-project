// const { ethers } = require("hardhat");
// const { expect, assert } = require("chai");
// const core_addresses = require("../../../fork/uni-core/addresses.json");
// const periphery_addresses = require("../../../fork/uni-periphery/addresses.json");
// const { _testInitAll, getContractAt } = require("../../helpers/test_init");
// const { transactionCost, ZERO_ADDRESS } = require("../../helpers/test_utils");

// const CONTRACT_NAME = "Token";

// describe(`Contract ${CONTRACT_NAME} `, () => {
//   let addressSystem;
//   let token;
//   let factory;
//   let weth;
//   let router;

//   let apiPost;
//   let apiPostPayable;
//   let apiGet;

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
//     factory = await getContractAt("IUniswapV2Factory", core_addresses.factory);
//     weth = await getContractAt("IWETH", periphery_addresses.weth);
//     router = await getContractAt(
//       "IUniswapV2Router02",
//       periphery_addresses.router
//     );
//     let contracts = await _testInitAll();
//     addressSystem = contracts.systems.addressSystem;

//     apiPost = contracts.systems.apiPost;
//     apiPostPayable = contracts.systems.apiPostPayable;
//     apiGet = contracts.systems.apiGet;

//     token = contracts.token;
//     // uni = contracts.fork.uni;
//     // return;
//     await apiPost.createCV("_tokenURI");
//   });

//   describe("Init : Token", () => {
//     it("should have a good address factory", async () => {
//       expect(factory.target).to.be.equal(core_addresses.factory);
//       expect(factory.target).to.be.equal(await router.factory());
//     });
//     it("should have a good address router", async () => {
//       expect(router.target).to.be.equal(periphery_addresses.router);
//     });
//     it("should have a good address weth", async () => {
//       expect(weth.target).to.be.equal(periphery_addresses.weth);
//     });

//     it("should create pair", async () => {
//       console.log(weth.target);
//       console.log(token.target);
//       let tx = await factory.createPair(token.target, weth.target);
//       tx.wait();
//       expect(await token.getPair(factory.target, weth.target)).to.not.be.equal(
//         ZERO_ADDRESS
//       );
//     });

//     describe("NOT WORKS", () => {});
//   });
// });
