// import { ADDR_FACTORY_CV } from "constants/address";
const { main: deployMain } = require("./01_deploy");

const hre = require("hardhat");
const { _testInitFeature } = require("../helpers/test_init");
const CONTRACT_NAME = "FactoryMission";

async function main() {
  const mainDeploy = await deployMain();

  const ADDR_FACTORY_CV = mainDeploy.factoryCV;
  const ADDR_FACTORY_MISSION = mainDeploy.factoryMission;
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
  const addresses = [
    this.owner,
    this.addr1,
    this.addr2,
    this.addr3,
    this.addr4,
    this.addr5,
    this.addr6,
    this.addr7,
  ];
  let factoryCV = await ethers.getContractAt("FactoryCV", ADDR_FACTORY_CV);

  for (let index = 0; index < addresses.length; index++) {
    const user = addresses[index];
    const tx = await factoryCV.connect(user).createCV(user.address);

    await tx.wait();
    const cvAddr = await factoryCV.getCV(user.address);
    const cv = await ethers.getContractAt("CV", cvAddr);

    if (index === 0) {
      await cv.connect(user).setName("Ownie");
      await cv.buyMission(ADDR_FACTORY_MISSION, 200);
      const addrMission = await cv.getMission(0);
      const mission = await ethers.getContractAt("Mission", addrMission);
      await _testInitFeature({
        mission,
        values: {
          wadge: 700,
          description:
            "__/title:Jeu de plateforme__/dev:unity__/domain:gaming__/desc:Refais moi le jeu de Peter Molineux",
        },
      });

      await _testInitFeature({
        mission,
        values: {
          wadge: 500,
          description:
            "__/title:NFT__/dev:solidity__/domain:web3__/desc:Créer un Pass NFT qui sera nécessaire pour les joueur pour jouer au jeu de plateforme",
          isInvite: false,
        },
      });
      await _testInitFeature({
        mission,
        values: {
          wadge: 900,
          description:
            "__/title:Rewards System__/dev:solidity__/domain:web3__/desc:Créer un Reward System pour récompenser les joueurs qui ont gagné le jeu de plateforme",
          isInvite: false,
        },
      });
      console.log("Feature create on ", mission.target);
    } else {
      await cv.connect(user).setName(`Testor${index}`);
    }
    console.log("CV create on ", cv.target);
    console.log(await cv.getLensHub());
    // const lensHub = await ethers.getContractAt("LensHub", cv.lensHubAddr());
    console.log(lensHub);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { main };
