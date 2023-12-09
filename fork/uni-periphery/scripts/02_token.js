const { ethers } = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const ADDRESSES = require("../../uni-core/addresses.json");
const addresses = require("../addresses.json");

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
  // const router = await ethers.getContractAt(
  //   "UniswapV2Router02",
  //   ADDRESSES.router
  // );

  const wethToken = await ethers.getContractAt("WETH9", addresses.weth);
  const amountTokenB = ethers.parseUnits("1", 18); // 0.5 TokenB, ajustez selon les besoins

  await wethToken.transfer(token, amountTokenB);

  return;
  // const myToken = await ethers.getContractAt("ERC20", token);
  // // Montant de liquidité à ajouter (par exemple, 1 TokenA et l'équivalent en TokenB)
  // const amountTokenA = ethers.parseUnits("1.0", 18); // 1 TokenA
  // // Approbation pour le router d'utiliser nos tokens
  // await myToken.approve(router.target, amountTokenA);
  // await wethToken.approve(router.target, amountTokenB);
  // let allowance = await myToken.allowance(this.owner.address, router.target);
  // let balance = await myToken.balanceOf(this.owner.address);
  // if (allowance < amountTokenA || balance < amountTokenA) {
  //   throw new Error("Error allowance my token");
  // }
  // balance = await wethToken.balanceOf(this.owner.address);
  // allowance = await wethToken.allowance(this.owner.address, router.target);
  // if (allowance < amountTokenB || balance < amountTokenB) {
  //   throw new Error("Error allowance weth token");
  // }
  // if (
  //   ADDRESSES.router != router.target ||
  //   (await router.WETH()) != wethToken.target ||
  //   (await router.factory()) != ADDRESSES.factory
  // ) {
  //   throw new Error("Missmatch address");
  // }

  // console.log(await router.factory());
  // console.log(await router.test(4));
  // return;
  // let datas = [
  //   myToken.target,
  //   wethToken.target,
  //   amountTokenA,
  //   amountTokenB,
  //   0, // Slippage minimum pour TokenA
  //   0, // Slippage minimum pour TokenB
  //   this.owner.address, // Adresse recevant les LP tokens
  //   Math.floor(Date.now() / 1000) + 60 * 10, // Deadline de 10 minutes
  // ];
  // console.log(datas);
  // console.log(router.target);
  // // console.log(await router.WETH());

  // return;
  // await router.addLiquidity(...datas);

  // console.log(`Liquidité ajoutée à la paire: ${pairAddress}`);
  // return;
  // const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // Deadline dans 20 minutes
  // const amountTokenDesired = ethers.parseUnits("100.0", 18); // Exemple de montant
  // const amountTokenMin = ethers.parseUnits("90.0", 18); // Minimum de Token A
  // const amountETHMin = ethers.parseUnits("1.0", 18); // Minimum de ETH
  // // Adresses des contrats (remplacez-les par vos adresses de contrats)

  // // let balance = await wethToken.balanceOf(this.owner.address);
  // if (balance == 0) {
  //   await wethToken.deposit({
  //     value: ethers.parseEther("100"),
  //   });
  // }
  // balance = await wethToken.balanceOf(this.owner.address);

  // if (
  //   (await router.factory()) !== ADDRESSES.factory &&
  //   ADDRESSES.weth !== (await router.WETH())
  // ) {
  //   throw new Error("UNIPERIPHERY: Error missmatch address");
  // }

  // // Créez une instance de vos tokens et du router
  // let tokenBalance = await myToken.balanceOf(this.owner.address);

  // const amountETHDesired = ethers.parseEther("5"); // 5 ETH
  // if (amountTokenDesired > tokenBalance) {
  //   throw new Error("Not enough token balance");
  // }
  // // Approver le Router pour dépenser nos tokens
  // let tx = await myToken.approve(ADDRESSES.router, amountTokenDesired);
  // await tx.wait();

  // if (
  //   amountTokenDesired <
  //   (await myToken.allowance(this.owner.address, ADDRESSES.router))
  // ) {
  //   throw new Error("Invalid allowance");
  // }
  // // Date d'expiration pour la transaction d'ajout de liquidité
  // // Exemple pour une paire MyToken/WETH

  // tx = await router.addLiquidityETH(
  //   token,
  //   amountTokenDesired,
  //   amountTokenMin,
  //   amountETHMin,
  //   this.owner.address, // Adresse recevant les LP tokens
  //   deadline,
  //   { value: ethers.parseEther("5") } // Montant d'ETH à ajouter
  // );

  // const receipt = await tx.wait();

  // console.log(
  //   `La liquidité a été ajoutée. Transaction Hash: ${receipt.transactionHash}`
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
