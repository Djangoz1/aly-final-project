const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const ADDRESSES = require("../addresses.json");
const { token } = require("../../../backend/addresses.json");
const { weth, router } = require("../../uni-periphery/addresses.json");

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

  //   const _token = await ethers.getContractAt("ERC20", token);
  const factory = await ethers.getContractAt(
    "UniswapV2Factory",
    ADDRESSES.factory
  );
  let pairAddress = await factory.getPair(token, weth);

  console.log(pairAddress);
  const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);
  // console.log("reserves", await pair.getReserves());

  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    const tx = await factory.createPair(token, weth);
    await tx.wait();
    pairAddress = await factory.getPair(token, weth);
  }

  const jsonContent = {
    pair: pairAddress,
    factory: factory.target,
    weth: weth,
    router: router,
    token: token,
  };
  console.log(jsonContent);
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return jsonContent;
  console.log(pairAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
