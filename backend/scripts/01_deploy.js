const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const abi_addr_s = require("../artifacts/contracts/system/AddressSystem.sol/AddressSystem.json");
const abi_api_g = require("../artifacts/contracts/system/APIGet.sol/APIGet.json");
const abi_cvh = require("../artifacts/contracts/cv/CVsHub.sol/CVsHub.json");
const abi_api_p = require("../artifacts/contracts/system/APIPost.sol/APIPost.json");
const abi_api_p_p = require("../artifacts/contracts/system/APIPostPayable.sol/APIPostPayable.json");
const abi_bh = require("../artifacts/contracts/system/BalancesHub.sol/BalancesHub.json");
const abi_l = require("../artifacts/contracts/launchpads/Launchpad.sol/Launchpad.json");
const abi_erc20 = require("../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json");

const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const { _testInitAll } = require("../helpers/test_init");

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
  // const core = await deployFactory();
  // console.log(core);
  // const periphery = await deployRouter();
  // console.log(periphery);
  const contracts = await _testInitAll();

  let token = contracts.token;

  const accessControl = contracts.systems.accessControl;

  const cvsHub = contracts.cvs.hub;

  const missionsHub = contracts.works.missionsHub;

  const featuresHub = contracts.works.featuresHub;

  const pubsHub = contracts.pubs.hub;

  const launchpadContracts = contracts.launchpads;
  const { datas, investors, hub } = launchpadContracts;

  const addressSystem = contracts.systems.addressSystem;

  const disputesDatasHub = contracts.escrows.datas;

  const balancesHub = contracts.systems.balancesHub;

  const apiPost = contracts.systems.apiPost;

  const apiPostPayable = contracts.systems.apiPostPayable;

  const apiGet = contracts.systems.apiGet;

  const factory = contracts.systems.factory;

  const disputesHub = contracts.escrows.disputesHub;

  const arbitratorsHub = contracts.escrows.arbitratorsHub;

  const collectWorkInteraction = contracts.works.collectWorkInteraction;

  const pubsDatasHub = contracts.pubs.datas;

  const jsonContent = {
    token: token.target,

    accessControl: accessControl.target,
    cvsHub: cvsHub.target,
    missionsHub: missionsHub.target,
    featuresHub: featuresHub.target,
    pubsHub: pubsHub.target,
    launchpadsDatasHub: datas.target,
    launchpadsInvestorsHubs: investors.target,
    launchpadHub: hub.target,
    addressSystem: addressSystem.target,
    disputesDatasHub: disputesDatasHub.target,
    balancesHub: balancesHub.target,
    apiPost: apiPost.target,
    apiPostPayable: apiPostPayable.target,
    apiGet: apiGet.target,
    factory: factory.target,
    disputesHub: disputesHub.target,
    arbitratorsHub: arbitratorsHub.target,
    collectWorkInteraction: collectWorkInteraction.target,
    pubsDatasHub: pubsDatasHub.target,
  };

  const abis = {
    addressSystem: abi_addr_s.abi,
    apiGet: abi_api_g.abi,
    apiPost: abi_api_p.abi,
    apiPostPayable: abi_api_p_p.abi,
    cvsHub: abi_cvh.abi,
    balancesHub: abi_bh.abi,
    launchpad: abi_l.abi,
    apiPostPayable: abi_api_p_p.abi,
    erc20: abi_erc20.abi,
  };
  console.log("ADDRESS content", jsonContent);
  let filePath = path.join(__dirname, "../../frontend/address.json");
  fs.writeFile(
    filePath,
    JSON.stringify(jsonContent, null, 2),
    "utf8",
    function (err) {
      if (err) {
        console.log(
          "Une erreur s'est produite lors de l'écriture du fichier JSON.",
          err
        );
      } else {
        console.log(
          "Fichier address.json créé avec succès dans le dossier frontend."
        );
      }
    }
  );
  filePath = path.join(__dirname, "../../frontend/abis.json"); // TESTNET :  "../../frontend/abistestnet.json";
  fs.writeFile(filePath, JSON.stringify(abis, null, 2), "utf8", function (err) {
    if (err) {
      console.log(
        "Une erreur s'est produite lors de l'écriture du fichier JSON.",
        err
      );
    } else {
      console.log(
        "Fichier abis.json créé avec succès dans le dossier frontend."
      );
    }
  });
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return contracts;
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

module.exports = { main };
