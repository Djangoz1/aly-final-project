const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const ADDRESSES = require("../addresses.json");
const { getContractAt } = require("../helpers/test_init");
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
  const token = await getContractAt("Token", ADDRESSES.token);
  console.log(ADDRESSES.uniswapRouter);
  console.log(ADDRESSES.weth);
  let factory = "0x313F922BE1649cEc058EC0f076664500c78bdc0b"; // factory
  let weth = "0xc0Bb1650A8eA5dDF81998f17B5319afD656f4c11";
  let _factory = await getContractAt("IUniswapV2Factory", factory);
  const pair = await _factory.getPair(token, weth);
  let _pair = await getContractAt("IUniswapV2Pair", pair);
  console.log(await _pair.balanceOf(this.owner.address));
  console.log(await _pair.getReserves());
  let router = "0x5322471a7E37Ac2B8902cFcba84d266b37D811A0";
  let _router = await getContractAt("IUniswapV2Router02", router);
  let _weth = await getContractAt("IWETH", weth);
  const amountTokenA = ethers.parseUnits("1", 18); // 1 TokenA
  const amountTokenB = ethers.parseUnits("5", 18); // 1 TokenA
  await token.approve(router, amountTokenA);
  await _weth.approve(router, amountTokenB);
  let allowance = await token.allowance(this.owner.address, router);
  let balance = await token.balanceOf(this.owner.address);
  if (allowance < amountTokenA || balance < amountTokenA) {
    throw new Error("Error allowance my token");
  }
  balance = await _weth.balanceOf(this.owner.address);
  allowance = await _weth.allowance(this.owner.address, _router.target);
  if (allowance < amountTokenB || balance < amountTokenB) {
    throw new Error("Error allowance weth token");
  }
  if (
    router != _router.target ||
    (await _router.WETH()) != _weth.target ||
    (await _router.factory()) != _factory.target
  ) {
    throw new Error(`Missmatch address:{
      weth {
        to: ${await _router.WETH()},
        ref: ${_weth.target} 
      },
      router: {
        to:${ADDRESSES.router},
        ref: ${_router.target}
      },
      factory: {
        to:${await _router.factory()},
        ref: ${_factory.target}
      }
  }
    `);
  }

  let datas = [
    token.target,
    amountTokenA,
    0,
    0, // Slippage minimum pour TokenA
    // amountTokenB,
    // 0, // Slippage minimum pour TokenB
    this.owner.address, // Adresse recevant les LP tokens
    Math.floor(Date.now() / 1000) + 60 * 10, // Deadline de 10 minutes
  ];
  console.log(datas);
  console.log(_router.target);
  await _router.addLiquidityETH(...datas, {
    value: "20000000000",
  });
  console.log(await _pair.getReserves());

  return;
  // console.log(await router.WETH());

  return;
  // await token.initPool(
  //   "0x5322471a7E37Ac2B8902cFcba84d266b37D811A0", // router
  //   factory,
  //   weth
  // );
  // console.log(await pair.getReserves());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
