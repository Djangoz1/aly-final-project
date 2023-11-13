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
  const axios = require("axios");

  const data = {
    mission:
      "I want to create a freelance dApp that uses solidity smart contracts to link a freelancer to a company. The dApp also includes a launchpad part as well as an escrow protocol. The launchpad protocol will allow users to finance the project and in return receive ERC20 tokens from the dApp. The escrow protocol will allow freelancers who have already worked on our dApp to examine a dispute and will receive ERC20 tokens in return for their expertise",
  };

  axios
    .post(
      "https://syncflow-api.onrender.com/extract_all_details?include_raw=false",
      data,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
