const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testParseHex,
  ZERO_ADDRESS,
  FEATURE_DATAS_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  WORKER_PROPOSAL_DATAS_EXEMPLE,
  PUB_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
} = require("./test_utils");

const {
  createURIFeature,
  createURIWorkerProposal,
  createURIMission,
  createURIPub,
} = require("../utils/pinata");

const MissionsHub_NAME = "MissionsHub";

const getContractAt = async (_contract, _address) => {
  const contract = await ethers.getContractAt(_contract, _address);
  return contract;
};

const codeSize = async (address) => {
  let contractCode = await ethers.provider.getCode(address);
  let codeSizeInBytes = contractCode.length / 2;
  if (codeSizeInBytes > 20000) {
    console.log(
      `Attention ! Taille du code du contrat : ${codeSizeInBytes} octets`
    );
  } else {
    console.log(`Taille du code du contrat : ${codeSizeInBytes} octets`);
  }
  return codeSizeInBytes;
};

const getProxy = async (accessControlAddr) => {
  const accessControl = await getContractAt("AccessControl", accessControlAddr);
  return accessControl;
};

const _testInitAll = async () => {
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
  let addressSystem = await _testInitaddressSystem();
  let cvs = await _testInitCVsContracts(addressSystem.target);
  let escrows = await _testInitEscrowsContracts(addressSystem.target);
  let works = await _testInitWorksContracts(addressSystem.target);
  let pubs = await _testInitPubsContracts(addressSystem.target);
  let launchpads = await _testInitLaunchpadsContracts(addressSystem.target);
  let systems = await _testInitSystemsContracts(addressSystem.target);
  let accessControl = systems.accessControl;

  let challengesHub = await ethers.deployContract("ChallengesHub", [
    addressSystem.target,
  ]);
  let challengersHub = await ethers.deployContract("ChallengersHub", [
    addressSystem.target,
  ]);
  let token = await ethers.deployContract("Token", [addressSystem.target]);
  systems.addressSystem = addressSystem;

  expect(await accessControl.workflow()).to.equal(1);

  // let contractCode = await ethers.provider.getCode(apiPost.target);
  // let codeSizeInBytes = contractCode.length / 2;
  // console.log(
  //   `Dispute Hub Taille du code du contrat : ${codeSizeInBytes} octets`
  // );
  // contractCode = await ethers.provider.getCode(DisputesDatasHub.target);
  // codeSizeInBytes = contractCode.length / 2;
  // console.log(
  //   `Escrow Datas Hub Taille du code du contrat : ${codeSizeInBytes} octets`
  // );
  // contractCode = await ethers.provider.getCode(collectWorkInteraction.target);
  // codeSizeInBytes = contractCode.length / 2;
  // console.log(
  //   `Collect Work interaction Taille du code du contrat : ${codeSizeInBytes} octets`
  // );
  // contractCode = await ethers.provider.getCode(factory.target);
  // codeSizeInBytes = contractCode.length / 2;
  // console.log(`Factory Taille du code du contrat : ${codeSizeInBytes} octets`);

  return {
    systems,
    cvs,
    launchpads,
    escrows,
    works,
    pubs,
    challenges: { challengersHub, challengesHub },
    token,
  };
};

let _testInitEscrowsContracts = async (addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  const datas = await ethers.deployContract("DisputesDatasHub", [
    addressSystem,
  ]);
  await datas.waitForDeployment();
  expect(await _iAS.disputesDatasHub()).to.be.equal(datas.target);

  const disputesHub = await ethers.deployContract("DisputesHub", [
    addressSystem,
  ]);
  await disputesHub.waitForDeployment();
  expect(await _iAS.disputesHub()).to.be.equal(disputesHub.target);

  const arbitratorsHub = await ethers.deployContract("ArbitratorsHub", [
    addressSystem,
  ]);
  await arbitratorsHub.waitForDeployment();
  expect(await _iAS.arbitratorsHub()).to.be.equal(arbitratorsHub.target);

  return {
    datas,
    disputesHub,
    arbitratorsHub,
  };
};

let _testInitCVsContracts = async (addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  const hub = await ethers.deployContract("CVsHub", [addressSystem]);
  await hub.waitForDeployment();
  expect(await _iAS.cvsHub()).to.be.equal(hub.target);

  return {
    hub,
  };
};

let _testInitaddressSystem = async () => {
  console.log("oui");
  const addressSystem = await ethers.deployContract("AddressSystem");
  await addressSystem.waitForDeployment();
  console.log("oui");
  return addressSystem;
};

let _testInitSystemsContracts = async (addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  const balancesHub = await ethers.deployContract("BalancesHub", [
    addressSystem,
  ]);
  await balancesHub.waitForDeployment();
  expect(await _iAS.balancesHub()).to.be.equal(balancesHub.target);

  const accessControl = await ethers.deployContract("AccessControl", [
    addressSystem,
  ]);
  await accessControl.waitForDeployment();
  expect(await _iAS.accessControl()).to.be.equal(accessControl.target);

  const factory = await ethers.deployContract("Factory", [addressSystem]);
  await factory.waitForDeployment();
  expect(await _iAS.factory()).to.be.equal(factory.target);

  const apiGet = await ethers.deployContract("APIGet", [addressSystem]);
  await apiGet.waitForDeployment();
  expect(await _iAS.apiGet()).to.be.equal(apiGet.target);
  const apiPost = await ethers.deployContract("APIPost", [addressSystem]);
  await apiPost.waitForDeployment();
  expect(await _iAS.apiPost()).to.be.equal(apiPost.target);
  const apiPostPayable = await ethers.deployContract("APIPostPayable", [
    addressSystem,
  ]);
  await apiPost.waitForDeployment();
  return {
    apiGet,
    balancesHub,
    accessControl,
    factory,
    apiPost,
    apiPostPayable,
  };
};

const _testInitArbitrator = async (contracts, courtID, account) => {
  let arbitratorsHub = contracts.escrows.arbitratorsHub;

  let apiPost = contracts.systems.apiPost;
  apiPostPayable = contracts.systems.apiPostPayable;
  let apiGet = contracts.systems.apiGet;

  let courtLength = await apiGet.lengthOfCourt(courtID);
  let cvArbitrator = await apiGet.cvOf(account.address);
  let newFeature = await _testInitFeature(
    contracts,
    { courtID: courtID },
    account
  );

  await apiPost.validFeature(newFeature);
  let _courtLength = await apiGet.lengthOfCourt(courtID);

  expect(parseInt(courtLength) + 1).to.be.equal(_courtLength);

  let data = await apiGet.datasOfFeature(newFeature);
  expect(data.status).to.be.equal(2);
  return await arbitratorsHub.arbitrationOfCV(cvArbitrator, courtID);
};

// *:::::::::::::: -- ::::::::::::::*//
// *:::::::::::::: CV ::::::::::::::*//
// *:::::::::::::: -- ::::::::::::::*//

const cvOf = async (_cv) => {
  const cv = await ethers.getContractAt("CV", _cv);
  return cv;
};

const _testInitCV = async (_accessControl, account, amount) => {
  const accessControl = await getProxy(_accessControl);
  const newCV = await accessControl.connect(account).createCV("tokenURI");
  const _cv = await accessControl
    .connect(account)
    .cvOfByAddress(account.address);
  const cv = await cvOf(_cv);

  return cv;
};

// *:::::::::::::: --- ::::::::::::::*//
// *:::::::::::::: PUB ::::::::::::::*//
// *:::::::::::::: --- ::::::::::::::*//

const _testInitPubsContracts = async (addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);

  const hub = await ethers.deployContract("PubsHub", [addressSystem]);
  await hub.waitForDeployment();
  expect(await _iAS.pubsHub()).to.equal(hub.target);

  const datas = await ethers.deployContract("PubsDatasHub", [addressSystem]);
  await datas.waitForDeployment();
  expect(await _iAS.pubsDatasHub()).to.equal(datas.target);

  return { hub, datas };
};

const _testInitPub = async (accessControlAdress, account, uriData) => {
  if (!uriData) {
    uriData = PUB_DATAS_URI_EXEMPLE;
  }
  const accessControl = await getContractAt(
    "AccessControl",
    accessControlAdress
  );

  const _cv = await accessControl.cvOfByAddress(account.address);

  const hub = await getContractAt("hub", await accessControl.iPH());
  const id = parseInt(await hub.tokensLength()) + 1;
  uriData.id = id;
  const json = await createURIPub(uriData);
  const tokenURI = json.IpfsHash;
  const beforeLength = parseInt(await hub.balanceOf(_cv));

  const tx = await accessControl.connect(account).createPub(tokenURI);

  await tx.wait();
  expect(await accessControl.cvOfByAddress(tx.from)).to.be.equal(_cv);
  const afterLength = parseInt(await hub.balanceOf(_cv));

  expect(beforeLength).to.equal(afterLength - 1);

  const _tokenURI = await hub.tokenURI(parseInt(id));
  expect(_tokenURI).to.be.equal(tokenURI);

  const owner = await hub.ownerOf(id);
  expect(owner).to.be.equal(_cv);
  return id;
};

// *:::::::::::::: ------- ::::::::::::::*//
// *:::::::::::::: MISSION ::::::::::::::*//
// *:::::::::::::: ------- ::::::::::::::*//

const _testInitWorksContracts = async (addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);

  const missionsHub = await ethers.deployContract("MissionsHub", [
    addressSystem,
  ]);
  await missionsHub.waitForDeployment();
  expect(await _iAS.missionsHub()).to.be.equal(missionsHub.target);

  const featuresHub = await ethers.deployContract("FeaturesHub", [
    addressSystem,
  ]);
  await featuresHub.waitForDeployment();
  expect(await _iAS.featuresHub()).to.be.equal(featuresHub.target);

  const collectWorkInteraction = await ethers.deployContract(
    "CollectWorkInteraction",
    [addressSystem]
  );
  await collectWorkInteraction.waitForDeployment();
  expect(await _iAS.collectWorkInteraction()).to.be.equal(
    collectWorkInteraction.target
  );

  return {
    missionsHub,
    featuresHub,
    collectWorkInteraction,
  };
};

/**
 * @notice La fonction vient mint un token erc721
 * @notice Payable function -- msg.value == balancesHub.missionPrice()
 * @dev La mission est créé par la fonction apiPostPayable.createMission(_tokenURI)
 */
const _testInitMission = async (contracts, tokenURI, account) => {
  let missionsHub = contracts.works.missionsHub;
  let apiPost = contracts.systems.apiPost;
  apiPostPayable = contracts.systems.apiPostPayable;
  let apiGet = contracts.systems.apiGet;
  let balancesHub = contracts.systems.balancesHub;

  const missionPrice = await balancesHub.missionPrice();
  if (account) {
    await apiPost.connect(account).createMission(tokenURI || "missionURI", {
      value: missionPrice.toString(),
    });
  } else {
    await apiPostPayable.createMission(tokenURI || "missionURI", {
      value: missionPrice.toString(),
    });
  }
  return await missionsHub.tokensLength();
};

// *:::::::::::::: ------- ::::::::::::::* //
// *:::::::::::::: FEATURE ::::::::::::::* //
// *:::::::::::::: ------- ::::::::::::::* //

const _testInitFeature = async (contracts, datas, workerAccount, account) => {
  let featuresHub = contracts.works.featuresHub;
  let apiPost = contracts.systems.apiPost;
  apiPostPayable = contracts.systems.apiPostPayable;
  let apiGet = contracts.systems.apiGet;
  let missionID = await _testInitMission(contracts, "missionURI");
  const cvWorker = await apiGet.cvOf(workerAccount.address);
  let newFeature;
  if (account) {
    await apiPost
      .connect(account)
      .createFeature(
        missionID,
        datas.estimatedDays || 1000,
        datas.isInviteOnly || true,
        datas.tokenURI || "tokenURI",
        datas.courtID || 3,
        {
          value: `${datas.wadge || 10000000}`,
        }
      );
    newFeature = await featuresHub.tokensLength();
    await apiPost.connect(account).inviteWorker(cvWorker, newFeature);
  } else {
    await apiPostPayable.createFeature(
      missionID,
      datas.estimatedDays || 1000,
      datas.isInviteOnly || true,
      datas.tokenURI || "tokenURI",
      datas.courtID || 3,
      {
        value: `${datas.wadge || 10000000}`,
      }
    );
    newFeature = await featuresHub.tokensLength();
    await apiPost.inviteWorker(cvWorker, newFeature);
  }
  await apiPost.connect(workerAccount).acceptJob(newFeature);
  return newFeature;
};

// *:::::::::::::: --------------- ::::::::::::::* //
// *:::::::::::::: WORKER PROPOSAL ::::::::::::::* //
// *:::::::::::::: --------------- ::::::::::::::* //

// *:::::::::::::: --------- ::::::::::::::* //
// *:::::::::::::: LAUNCHPAD ::::::::::::::* //
// *:::::::::::::: --------- ::::::::::::::* //

const _testInitLaunchpadsContracts = async (addressSystem, address) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);

  const hub = await ethers.deployContract("LaunchpadHub", [addressSystem]);
  await hub.waitForDeployment();
  expect(await _iAS.launchpadsHub()).to.be.equal(hub.target);

  const datas = await ethers.deployContract("LaunchpadsDatasHub", [
    addressSystem,
  ]);
  await datas.waitForDeployment();
  expect(await _iAS.launchpadsDatasHub()).to.be.equal(datas.target);

  const investors = await ethers.deployContract("LaunchpadsInvestorsHub", [
    addressSystem,
  ]);
  await investors.waitForDeployment();
  expect(await _iAS.launchpadsInvestorsHub()).to.be.equal(investors.target);

  expect(await datas.owner()).to.be.equal(await investors.owner());
  expect(await investors.owner()).to.be.equal(await hub.owner());
  expect(await hub.owner()).to.be.equal(await datas.owner());
  if (address) {
    expect(await datas.owner()).to.be.equal(address);
    expect(await investors.owner()).to.be.equal(address);
    expect(await hub.owner()).to.be.equal(address);
  }
  return { investors, datas, hub };
};

const _testInitLaunchpad = async (
  contracts,
  account,
  _token,
  amount,
  datas,
  tierDatas
) => {
  let AddressSystem = contracts.addressSystem;
  let accessControl;
  let token;

  if (!datas) {
    datas = LAUNCHPAD_DATAS_EXEMPLE;
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getTime() + 20 * 24 * 60 * 60 * 1000
    );
    const startDate = new Date(
      currentDate.getTime() + 10 * 24 * 60 * 60 * 1000
    );
    datas.saleEnd = futureDate.getTime();
    datas.saleStart = startDate.getTime();

    datas.pubURI = "pubURI";
    token = await _testInitToken(account, "Django", "DJN", 10000000);

    datas.tokenAddress = token.target;
  }
  return;
  if (!tierDatas) {
    tierDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];
  }
  if (_token) {
    token = _token;
    datas.tokenAddress = _token.target;
  }

  const launchpadHub = await getContractAt(
    "LaunchpadHub",
    await accessControl.launchpadHub()
  );

  const beforeLength = parseInt(await launchpadHub.tokensLength());
  if (!amount) {
    amount = parseInt(await accessControl.launchpadPrice());
  }

  const tx = await accessControl
    .connect(account)
    .createLaunchpad(datas, tierDatas, { value: `${amount}` });
  tx.wait();
  expect(tx.from).to.be.equal(account.address);
  const id = parseInt(await launchpadHub.tokensLength());
  expect(beforeLength).to.be.equal(id - 1);

  const launchpadAddr = await launchpadHub.getLaunchpad(id);
  const launchpad = await getContractAt("Launchpad", launchpadAddr);
  expect(await launchpad.owner()).to.be.equal(account.address);

  let lDatas = await launchpad.dataOfs();

  expect(lDatas.tokenAddress).to.be.equal(datas.tokenAddress);
  expect(lDatas.pubURI).to.be.equal(datas.pubURI);
  let maxTierCap = 0;
  let minTierCap = 0;
  let _tDatas = [];
  for (let index = 0; index < tierDatas.length; index++) {
    const element = tierDatas[index];
    let tierData = await launchpad.tierOfs(index);
    _tDatas.push(tierData);
    expect(parseInt(tierData.maxTierCap)).to.be.equal(element.maxTierCap);
    expect(parseInt(tierData.minTierCap)).to.be.equal(element.minTierCap);
    maxTierCap += parseInt(tierData.maxTierCap);
    minTierCap += parseInt(tierData.minTierCap);
  }

  expect(lDatas.minCap).to.be.equal(minTierCap);
  expect(lDatas.maxCap).to.be.equal(maxTierCap);
  expect(lDatas.minInvest).to.be.equal(datas.minInvest);
  expect(lDatas.maxInvest).to.be.equal(datas.maxInvest);
  expect(lDatas.saleStart).to.be.equal(datas.saleStart);
  expect(lDatas.saleEnd).to.be.equal(datas.saleEnd);
  expect(lDatas.lockedTime).to.be.equal(datas.lockedTime);
  expect(lDatas.totalUser).to.be.equal(0);
  expect(lDatas.numberOfTier).to.be.equal(tierDatas.length);
  await expect(launchpad.tierOfs(tierDatas.length)).to.be.revertedWith(
    "ID tier out of range"
  );

  return launchpad;
};

// *:::::::::::::: ----- ::::::::::::::* //
// *:::::::::::::: TOKEN ::::::::::::::* //
// *:::::::::::::: ----- ::::::::::::::* //

const _testInitToken = async (account, _name, _symbol, _totalSupply) => {
  const token = await ethers.deployContract("ERC20Token", [
    _name,
    _symbol,
    _totalSupply,
  ]);

  expect(await token.name()).to.equal(_name);
  expect(await token.totalSupply()).to.equal(
    BigInt(_totalSupply) * BigInt(10 ** 18)
  );

  expect(await token.symbol()).to.equal(_symbol);

  if (account.address !== token.runner.address) {
    await token.transfer(account.address, await token.totalSupply());
  }

  expect(await token.balanceOf(account.address)).to.equal(
    await token.totalSupply()
  );

  return token;
};

module.exports = {
  getContractAt,
  codeSize,
  _testInitAll,
  _testInitaddressSystem,
  _testInitSystemsContracts,
  _testInitCVsContracts,
  _testInitPubsContracts,
  _testInitLaunchpadsContracts,
  _testInitWorksContracts,
  _testInitEscrowsContracts,
  _testInitArbitrator,
  _testInitCV,
  _testInitPub,
  _testInitMission,
  _testInitFeature,
  _testInitToken,
  _testInitLaunchpad,
};
