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

const getProxy = async (accessControlAddr) => {
  const accessControl = await getContractAt("AccessControl", accessControlAddr);
  return accessControl;
};

const _testInitAll = async () => {
  let addressHub = await _testInitAddressHub();
  let accessControl = await _testInitAccessControl(addressHub.target);
  let factory = await _testInitFactory(addressHub.target);

  expect(await accessControl.workflow()).to.equal(0);

  let cvHub = await _testInitCVHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let escrowDatasHub = await _testInitEscrowDatasHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let missionsHub = await _testInitMissionsHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let pubsHub = await _testInitPubHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let featuresHub = await _testInitFeaturesHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let workerProposalHub = await _testInitWorkerProposalHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let launchpadContracts = await _testInitLaunchpadContracts(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let disputesHub = await _testInitDisputesHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let arbitratorsHub = await _testInitArbitratorsHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);

  let balancesHub = await _testInitBalancesHub(addressHub.target);
  expect(await accessControl.workflow()).to.equal(0);
  let collectWorkInteraction = await _testInitCollectWorkInteraction(
    addressHub.target
  );

  let collectFollowCV = await _testInitCollectFollowCV(addressHub.target);

  let collecterLike = await ethers.getContractAt(
    "CollectLikePub",
    await pubsHub.getCollectLikePub()
  );

  let collecterPubs = await _testInitCollectPubs(addressHub.target);
  let apiPost = await _testInitApiPost(addressHub.target);

  expect(await accessControl.workflow()).to.equal(1);
  // let contractCode = await ethers.provider.getCode(apiPost.target);
  // let codeSizeInBytes = contractCode.length / 2;
  // console.log(
  //   `Dispute Hub Taille du code du contrat : ${codeSizeInBytes} octets`
  // );
  // contractCode = await ethers.provider.getCode(escrowDatasHub.target);
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
    addressHub,
    accessControl,
    escrowDatasHub,
    balancesHub,
    missionsHub,
    cvHub,
    apiPost,
    factory,
    pubsHub,
    featuresHub,
    disputesHub,
    arbitratorsHub,
    workerProposalHub,
    collectFollowCV,
    launchpadContracts,
    collectWorkInteraction,
    collecterLike,
    collecterPubs,
  };
};

const _testInitAddressHub = async () => {
  const accessControl = await ethers.deployContract("AddressHub");
  await accessControl.waitForDeployment();
  return accessControl;
};
const _testInitEscrowDatasHub = async (addressHub) => {
  const escrowDatasHub = await ethers.deployContract("EscrowDatasHub", [
    addressHub,
  ]);
  await escrowDatasHub.waitForDeployment();
  return escrowDatasHub;
};
const _testInitCollectWorkInteraction = async (addressHub) => {
  const collectWorkInteraction = await ethers.deployContract(
    "CollectWorkInteraction",
    [addressHub]
  );
  await collectWorkInteraction.waitForDeployment();
  return collectWorkInteraction;
};

const _testInitBalancesHub = async (addressHub) => {
  const balancesHub = await ethers.deployContract("BalancesHub", [addressHub]);
  await balancesHub.waitForDeployment();
  return balancesHub;
};

const _testInitCollectFollowCV = async (addressHub) => {
  const collectFollowCV = await ethers.deployContract("CollectFollowCv", [
    addressHub,
  ]);
  await collectFollowCV.waitForDeployment();
  return collectFollowCV;
};

const _testInitAccessControl = async (addressHub) => {
  const accessControl = await ethers.deployContract("AccessControl", [
    addressHub,
  ]);
  await accessControl.waitForDeployment();
  return accessControl;
};

const _testInitCollectPubs = async (addressHub) => {
  const collectPubs = await ethers.deployContract("CollectPubs", [addressHub]);
  await collectPubs.waitForDeployment();
  return collectPubs;
};
const _testInitFactory = async (addressHub) => {
  const factory = await ethers.deployContract("Factory", [addressHub]);
  await factory.waitForDeployment();
  return factory;
};
const _testInitApiPost = async (addressHub) => {
  const apiPost = await ethers.deployContract("APIPost", [addressHub]);
  await apiPost.waitForDeployment();
  return apiPost;
};

const _testInitDisputesHub = async (addressHub) => {
  const disputesHub = await ethers.deployContract("DisputesHub", [addressHub]);
  await disputesHub.waitForDeployment();

  return disputesHub;
};
const _testInitArbitratorsHub = async (addressHub) => {
  const arbitratorsHub = await ethers.deployContract("ArbitratorsHub", [
    addressHub,
  ]);
  await arbitratorsHub.waitForDeployment();
  return arbitratorsHub;
};

const _testInitArbitrator = async (contracts, courtID, account) => {
  const {
    arbitratorsHub,
    featuresHub,
    apiPost,

    cvHub,
  } = contracts;
  let courtLength = await arbitratorsHub.getCourtLength(courtID);
  let cvArbitrator = await cvHub.getCV(account.address);
  let newFeature = await _testInitFeature(
    contracts,
    { courtID: courtID },
    account
  );
  await apiPost.validFeature(newFeature);
  let _courtLength = await arbitratorsHub.getCourtLength(courtID);

  expect(parseInt(courtLength) + 1).to.be.equal(_courtLength);

  let value = 0.3 + 0.1;
  let price = ethers.parseEther(`${value}`);

  await apiPost.connect(account).investOnCourt(3, { value: `${price}` });
  let data = await featuresHub.getData(newFeature);
  expect(data.status).to.be.equal(2);
  return await arbitratorsHub.getArbitrationOfCV(cvArbitrator, courtID);
};

// *:::::::::::::: -- ::::::::::::::*//
// *:::::::::::::: CV ::::::::::::::*//
// *:::::::::::::: -- ::::::::::::::*//

const getCV = async (_cv) => {
  const cv = await ethers.getContractAt("CV", _cv);
  return cv;
};

const _testInitCVHub = async (accessControl) => {
  const factoryCV = await ethers.deployContract("CVHub", [accessControl]);

  await factoryCV.waitForDeployment();

  return factoryCV;
};

const _testInitCV = async (_accessControl, account, amount) => {
  const accessControl = await getProxy(_accessControl);
  const newCV = await accessControl.connect(account).createCV("tokenURI");
  const _cv = await accessControl
    .connect(account)
    .getCVByAddress(account.address);
  const cv = await getCV(_cv);

  return cv;
};

// *:::::::::::::: --- ::::::::::::::*//
// *:::::::::::::: PUB ::::::::::::::*//
// *:::::::::::::: --- ::::::::::::::*//

const _testInitPubHub = async (addressHub) => {
  const pubHub = await ethers.deployContract("PubsHub", [addressHub]);
  await pubHub.waitForDeployment();
  return pubHub;
};

const _testInitPub = async (accessControlAdress, account, uriData) => {
  if (!uriData) {
    uriData = PUB_DATAS_URI_EXEMPLE;
  }
  const accessControl = await getContractAt(
    "AccessControl",
    accessControlAdress
  );

  const _cv = await accessControl.getCVByAddress(account.address);

  const pubsHub = await getContractAt("PubsHub", await accessControl.iPH());
  const id = parseInt(await pubsHub.getTokensLength()) + 1;
  uriData.id = id;
  const json = await createURIPub(uriData);
  const tokenURI = json.IpfsHash;
  const beforeLength = parseInt(await pubsHub.balanceOf(_cv));

  const tx = await accessControl.connect(account).createPub(tokenURI);

  await tx.wait();
  expect(await accessControl.getCVByAddress(tx.from)).to.be.equal(_cv);
  const afterLength = parseInt(await pubsHub.balanceOf(_cv));

  expect(beforeLength).to.equal(afterLength - 1);

  const _tokenURI = await pubsHub.tokenURI(parseInt(id));
  expect(_tokenURI).to.be.equal(tokenURI);

  const owner = await pubsHub.ownerOf(id);
  expect(owner).to.be.equal(_cv);
  return id;
};

// *:::::::::::::: ------- ::::::::::::::*//
// *:::::::::::::: MISSION ::::::::::::::*//
// *:::::::::::::: ------- ::::::::::::::*//

/**
 * @notice La fonction vient mint un token erc721
 * @notice Payable function -- msg.value == balancesHub.missionPrice()
 * @dev La mission est créé par la fonction apiPost.createMission(_tokenURI)
 */
const _testInitMission = async (contracts, tokenURI, account) => {
  const { missionsHub, apiPost, balancesHub } = contracts;

  const missionPrice = await balancesHub.missionPrice();
  if (account) {
    await apiPost.connect(account).createMission(tokenURI || "missionURI", {
      value: missionPrice.toString(),
    });
  } else {
    await apiPost.createMission(tokenURI || "missionURI", {
      value: missionPrice.toString(),
    });
  }
  return await missionsHub.getTokensLength();
};

const _testInitMissionsHub = async (_addressHub) => {
  const missionsHub = await ethers.deployContract("MissionsHub", [_addressHub]);
  return missionsHub;
};

// *:::::::::::::: ------- ::::::::::::::* //
// *:::::::::::::: FEATURE ::::::::::::::* //
// *:::::::::::::: ------- ::::::::::::::* //

const _testInitFeaturesHub = async (addressHub) => {
  const featuresHub = await ethers.deployContract("FeaturesHub", [addressHub]);
  return featuresHub;
};

const _testInitFeature = async (contracts, datas, workerAccount, account) => {
  const { arbitratorsHub, featuresHub, missionsHub, accessControl, cvHub } =
    contracts;

  let apiPost = contracts.apiPost;

  let missionID = await _testInitMission(contracts, "missionURI");
  const cvWorker = await cvHub.getCV(workerAccount.address);
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
    newFeature = await featuresHub.getTokensLength();
    await apiPost.connect(account).inviteWorker(cvWorker, newFeature);
  } else {
    await apiPost.createFeature(
      missionID,
      datas.estimatedDays || 1000,
      datas.isInviteOnly || true,
      datas.tokenURI || "tokenURI",
      datas.courtID || 3,
      {
        value: `${datas.wadge || 10000000}`,
      }
    );
    newFeature = await featuresHub.getTokensLength();
    await apiPost.inviteWorker(cvWorker, newFeature);
  }
  await apiPost.connect(workerAccount).acceptJob(newFeature);
  return newFeature;
};

// *:::::::::::::: --------------- ::::::::::::::* //
// *:::::::::::::: WORKER PROPOSAL ::::::::::::::* //
// *:::::::::::::: --------------- ::::::::::::::* //

const _testInitWorkerProposalHub = async (addressHub) => {
  const workerProposalHub = await ethers.deployContract("WorkProposalHub", [
    addressHub,
  ]);
  await workerProposalHub.waitForDeployment();
  return workerProposalHub;
};

const _testInitWorkerProposal = async (
  _accessControl,
  account,
  _featureID,
  _datas
) => {
  datas = WORKER_PROPOSAL_DATAS_EXEMPLE;

  if (_datas) {
    datas = _datas;
  }
  const accessControl = await getProxy(_accessControl);
  const _cv = await accessControl.getCVByAddress(account.address);
  const workProposalHub = await getContractAt(
    "WorkProposalHub",
    await accessControl.iWPH()
  );
  const targetID = parseInt(await workProposalHub.getTokensLength()) + 1;
  datas.id = targetID;

  const json = await createURIWorkerProposal(datas);
  const tokenURI = json.IpfsHash;

  const beforeLength = parseInt(await workProposalHub.balanceOf(_cv));

  const tx = await accessControl
    .connect(account)
    .createWorkerProposal(tokenURI, _featureID);
  await tx.wait();

  const afterLength = parseInt(await workProposalHub.balanceOf(_cv));
  expect(beforeLength).to.equal(afterLength - 1);

  const id = parseInt(await workProposalHub.getTokensLength());

  const _tokenURI = await workProposalHub.tokenURI(parseInt(id));
  expect(_tokenURI).to.not.be.equal("");

  const owner = await workProposalHub.ownerOf(id);
  expect(owner).to.be.equal(_cv);

  return id;
};

// *:::::::::::::: --------- ::::::::::::::* //
// *:::::::::::::: LAUNCHPAD ::::::::::::::* //
// *:::::::::::::: --------- ::::::::::::::* //

const _testInitLaunchpadContracts = async (addressHub, address) => {
  const cohort = await ethers.deployContract("LaunchpadCohort", [addressHub]);
  await cohort.waitForDeployment();

  const hub = await ethers.deployContract("LaunchpadHub", [cohort.target]);
  await hub.waitForDeployment();

  const datas = await ethers.deployContract("CollectLaunchpadDatas", [
    cohort.target,
  ]);
  await datas.waitForDeployment();

  const investors = await ethers.deployContract("CollectLaunchpadInvestor", [
    cohort.target,
  ]);
  await investors.waitForDeployment();

  expect(await datas.owner()).to.be.equal(await investors.owner());
  expect(await investors.owner()).to.be.equal(await hub.owner());
  expect(await hub.owner()).to.be.equal(await cohort.owner());
  expect(await cohort.owner()).to.be.equal(await datas.owner());
  if (address) {
    expect(await datas.owner()).to.be.equal(address);
    expect(await investors.owner()).to.be.equal(address);
    expect(await hub.owner()).to.be.equal(address);
    expect(await cohort.owner()).to.be.equal(address);
  }
  return { investors, datas, cohort, hub };
};

const _testInitLaunchpad = async (
  contracts,
  account,
  _token,
  amount,
  datas,
  tierDatas
) => {
  let AddressHub = contracts.addressHub;
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

  const beforeLength = parseInt(await launchpadHub.getTokensLength());
  if (!amount) {
    amount = parseInt(await accessControl.launchpadPrice());
  }

  const tx = await accessControl
    .connect(account)
    .createLaunchpad(datas, tierDatas, { value: `${amount}` });
  tx.wait();
  expect(tx.from).to.be.equal(account.address);
  const id = parseInt(await launchpadHub.getTokensLength());
  expect(beforeLength).to.be.equal(id - 1);

  const launchpadAddr = await launchpadHub.getLaunchpad(id);
  const launchpad = await getContractAt("Launchpad", launchpadAddr);
  expect(await launchpad.owner()).to.be.equal(account.address);

  let lDatas = await launchpad.getDatas();

  expect(lDatas.tokenAddress).to.be.equal(datas.tokenAddress);
  expect(lDatas.pubURI).to.be.equal(datas.pubURI);
  let maxTierCap = 0;
  let minTierCap = 0;
  let _tDatas = [];
  for (let index = 0; index < tierDatas.length; index++) {
    const element = tierDatas[index];
    let tierData = await launchpad.getTierDatas(index);
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
  await expect(launchpad.getTierDatas(tierDatas.length)).to.be.revertedWith(
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

  // expect(token.runner.address).to.equal(account.address);
  expect(await token.name()).to.equal(_name);
  expect(await token.totalSupply()).to.equal(_totalSupply);
  expect(await token.symbol()).to.equal(_symbol);
  expect(await token.balanceOf(account.address)).to.equal(_totalSupply);
  return token;
};

module.exports = {
  getContractAt,
  _testInitAll,

  _testInitApiPost,
  _testInitArbitrator,
  _testInitAddressHub,
  _testInitAccessControl,
  _testInitFeaturesHub,
  _testInitWorkerProposalHub,
  _testInitDisputesHub,
  _testInitWorkerProposal,
  _testInitArbitratorsHub,
  _testInitCVHub,
  _testInitCV,
  _testInitPub,
  _testInitPubHub,
  _testInitMissionsHub,
  _testInitMission,
  _testInitFactory,
  _testInitFeature,
  _testInitToken,
  _testInitLaunchpad,
  _testInitCollectPubs,
  _testInitCollectFollowCV,
  _testInitLaunchpadContracts,
  _testInitCollectWorkInteraction,
  _testInitEscrowDatasHub,
};
