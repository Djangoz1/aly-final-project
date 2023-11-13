const { ethers, artifacts } = require("hardhat");
// const UniswapV2Factory = artifacts.require(
//   "@uniswap/v2-core/UniswapV2Factory.sol"
// );
// const UniswapV2Router02 = artifacts.require(
//   "@uniswap/v2-periphery/UniswapV2Router02.sol"
// );

// Adresse WETH pour le réseau que vous utilisez (exemple pour le réseau Hardhat local)
const WETH_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

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
  const weth = await ethers.deployContract("WETH9");
  console.log("WETH9 deployed", weth.target);
  const uni = await ethers.deployContract("UniswapV2Factory", [
    this.owner.address,
  ]);

  console.log("Factory deployed", uni.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
