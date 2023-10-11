const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const { _testInitToken } = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryCV";

// import ADDRS from "../../core/tasks/helpers/utils";
async function main() {
  [
    this.owner,
    this.addr1,
    this.addr2,
    this.addr3,
    this.addr4,
    this.addr5,
    this.addr6,
    this.addr7,
  ] = await ethers.getSigners();
  const token = await _testInitToken(
    this.owner,
    "Django",
    "DJN",
    30000000000000000000n
  );
  console.log("Token ERC20 create on", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
