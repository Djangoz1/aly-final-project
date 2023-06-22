const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const CONTRACT_NAME = process.env.CONTRACT_NAME || "Mission";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let mission;
  beforeEach(async () => {
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
    let contract = await ethers.getContractFactory(CONTRACT_NAME);
    mission = await contract.deploy(0);
  });

  // --------------------------------
  //* --- Initialisation ---
  // --------------------------------
  describe("Initialization", () => {
    it("Should  have mission status to pending");
    it("Should  have a wage locked", async () => {});
    it("Should  have a features", async () => {});
    it("Should  have a features", async () => {});
  });
  // -

  // --------------------------------
  // * --- Set number ---
  // --------------------------------
  // describe("Set number", () => {
  //   let target = 777;
  //   it(`Should set number to ${target}`, async () => {
  //     let transaction = await mission.setNumber(target);
  //     transaction.wait();
  //     let numberAfter = await mission.getNumber();
  //     expect(numberAfter.toString()).to.equal(target.toString());
  //   });
  // });
  // -
});
