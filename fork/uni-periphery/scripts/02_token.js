const { ethers } = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const ADDRESSES = require("../../uni-core/addresses.json");

const { token } = require("../../../backend/addresses.json");

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
  const router = await ethers.getContractAt(
    "UniswapV2Router02",
    ADDRESSES.router
  );
  // Adresses des contrats (remplacez-les par vos adresses de contrats)

  const wethToken = await ethers.getContractAt("WETH9", ADDRESSES.weth);
  let balance = await wethToken.balanceOf(this.owner.address);
  if (balance == 0) {
    await wethToken.deposit({
      value: ethers.parseEther("100"),
    });
  }
  balance = await wethToken.balanceOf(this.owner.address);

  if (
    (await router.factory()) !== ADDRESSES.factory &&
    ADDRESSES.weth !== (await router.WETH())
  ) {
    throw new Error("UNIPERIPHERY: Error missmatch address");
  }

  // Créez une instance de vos tokens et du router
  const myToken = await ethers.getContractAt("ERC20", token);
  let tokenBalance = await myToken.balanceOf(this.owner.address);

  const amountETHDesired = ethers.parseEther("5"); // 5 ETH
  if (amountTokenDesired > tokenBalance) {
    throw new Error("Not enough token balance");
  }
  // Approver le Router pour dépenser nos tokens
  let tx = await myToken.approve(ADDRESSES.router, amountTokenDesired);
  await tx.wait();

  if (
    amountTokenDesired <
    (await myToken.allowance(this.owner.address, ADDRESSES.router))
  ) {
    throw new Error("Invalid allowance");
  }
  // Date d'expiration pour la transaction d'ajout de liquidité
  // Exemple pour une paire MyToken/WETH
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // Deadline dans 20 minutes
  const amountTokenDesired = ethers.utils.parseUnits("100.0", 18); // Exemple de montant
  const amountTokenMin = ethers.utils.parseUnits("90.0", 18); // Minimum de Token A
  const amountETHMin = ethers.utils.parseUnits("1.0", 18); // Minimum de ETH

  tx = await uniswapV2Router02.addLiquidityETH(
    myTokenAddress,
    amountTokenDesired,
    amountTokenMin,
    amountETHMin,
    yourAddress, // Adresse recevant les LP tokens
    deadline,
    { value: ethers.parseEther } // Montant d'ETH à ajouter
  );

  const receipt = await tx.wait();

  console.log(
    `La liquidité a été ajoutée. Transaction Hash: ${receipt.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
