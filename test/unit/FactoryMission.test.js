// const { ethers } = require("hardhat");
// const { expect, assert } = require("chai");
// const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

// const CONTRACT_NAME = "FactoryMission";

// describe(`Contract ${CONTRACT_NAME} `, () => {
//   let factoryMission;
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
//     let contract = await ethers.getContractFactory(CONTRACT_NAME);
//     factoryMission = await contract.deploy();
//   });

//   // ********************************** //
//   // *:::::::: INITIALISATION ::::::::* //
//   // ------------------------------------
//   describe("Initialization", () => {
//     it("Should  get price to 0.1 ether", async () => {
//       let price = await factoryMission.getPrice();
//       expect(price.toString()).to.equal("100000000000000000");
//     });

//     it("Should  get balance to 0", async () => {
//       let balance = await factoryMission.getBalance();
//       expect(balance.toString()).to.equal("0");
//     });

//     it("Should  get number of mission to 0", async () => {
//       let number = await factoryMission.getMissionsLength();
//       expect(number.toString()).to.equal("0");
//     });

//     it("Should  can create a mission", async () => {
//       const amount = ethers.utils.parseEther("0.2");
//       let transaction = await factoryMission.createMission(amount);
//       transaction.wait();
//       let number = await factoryMission.getMissionsLength();
//       expect(number.toString()).to.equal("1");
//     });

//     it("Should  get a mission", async () => {
//       const amount = ethers.utils.parseEther("0.2");
//       let transaction = await factoryMission.createMission(amount);
//       transaction.wait();
//       console.log(transaction);
//       await factoryMission.getMission(transaction.value);
//     });
//   });
//   // -

//   // --------------------------------
//   // * --- Set number ---
//   // --------------------------------
//   // describe("Set number", () => {
//   //   let target = 777;
//   //   it(`Should set number to ${target}`, async () => {
//   //     let transaction = await mission.setNumber(target);
//   //     transaction.wait();
//   //     let numberAfter = await mission.getNumber();
//   //     expect(numberAfter.toString()).to.equal(target.toString());
//   //   });
//   // });
//   // -
// });
