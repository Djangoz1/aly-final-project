// import { ADDR_FACTORY_CV } from "constants/address";

const { _testInitFeature } = require("../helpers/test_init");
const {
  ADDR_FACTORY_CV,
  ADDR_FACTORY_MISSION,
} = require("../src/constants/address");
const hre = require("hardhat");
const CONTRACT_NAME = "FactoryMission";

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
  let factoryCV = await ethers.getContractAt("FactoryCV", ADDR_FACTORY_CV);
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
          workerAddr: this.addr1.address,
          wadge: 700,
          description: "js: First Mission",
          isInvite: true,
        },
      });

      await _testInitFeature({
        mission,
        values: {
          wadge: 500,
          description: "open: Fais toi plais'",
          isInvite: false,
        },
      });
      await _testInitFeature({
        mission,
        values: {
          wadge: 900,
          description: "solidity: Contract",
          isInvite: false,
        },
      });
      console.log("Feature create on ", mission.address);
    } else {
      await cv.connect(user).setName(`Testor${index}`);
    }
    console.log("CV create on ", cv.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});