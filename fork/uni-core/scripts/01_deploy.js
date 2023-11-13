const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

// import ADDRS from "../../core/tasks/helpers/utils";
async function main() {
  // ! FORK UNI en local
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

  const uniFactory = await ethers.deployContract("UniswapV2Factory", [
    this.addr5.address,
  ]);

  console.log("Uniswap factory deployed to", uniFactory.target);

  const jsonContent = {
    factory: uniFactory.target,
  };
  console.log(jsonContent);
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return jsonContent;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
