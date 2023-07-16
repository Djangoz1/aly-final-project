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

const _testInitAccessControl = async () => {
  const accessControl = await ethers.deployContract("AccessControl");
  await accessControl.waitForDeployment();
  return accessControl;
};

// *:::::::::::::: -- ::::::::::::::*//
// *:::::::::::::: CV ::::::::::::::*//
// *:::::::::::::: -- ::::::::::::::*//

const getCV = async (_cv) => {
  const cv = await ethers.getContractAt("CV", _cv);
  return cv;
};

const _testInitFactoryCV = async (accessControl) => {
  const factoryCV = await ethers.deployContract("FactoryCV", [accessControl]);

  await factoryCV.waitForDeployment();

  return factoryCV;
};

const _testInitCV = async (_accessControl, account, amount) => {
  const accessControl = await getProxy(_accessControl);
  const newCV = await accessControl.connect(account).buyCV({
    value: ethers.parseEther(`${amount}`),
  });
  const _cv = await accessControl
    .connect(account)
    .getCVByAddress(account.address);
  const cv = await getCV(_cv);

  return cv;
};

// *:::::::::::::: --- ::::::::::::::*//
// *:::::::::::::: PUB ::::::::::::::*//
// *:::::::::::::: --- ::::::::::::::*//

const _testInitPubHub = async (accessControl) => {
  const pubHub = await ethers.deployContract("PubsHub", [accessControl]);
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

const _testInitMission = async (_accessControl, account, _amount, uriData) => {
  if (!uriData) {
    uriData = FEATURE_DATAS_URI_EXEMPLE;
  }
  const accessControl = await getProxy(_accessControl);
  const missionsHub = await getContractAt(
    "MissionsHub",
    await accessControl.iMH()
  );

  const _cv = await accessControl.getCVByAddress(account.address);

  const id = parseInt(await missionsHub.getTokensLength()) + 1;
  uriData.id = id;

  const json = await createURIMission(uriData);
  const tokenURI = json.IpfsHash;
  const amount = ethers.parseEther(`${_amount}`);

  const beforeLength = parseInt(await missionsHub.balanceOf(_cv));

  const tx = await accessControl
    .connect(account)
    .buyMission(tokenURI, { value: amount });
  tx.wait();
  expect(await accessControl.getCVByAddress(tx.from)).to.be.equal(_cv);

  const afterLength = parseInt(await missionsHub.balanceOf(_cv));
  expect(beforeLength).to.equal(afterLength - 1);

  const _tokenURI = await missionsHub.tokenURI(parseInt(id));
  expect(_tokenURI).to.be.equal(tokenURI);

  const owner = await missionsHub.ownerOf(id);
  expect(owner).to.be.equal(_cv);
  return id;
};

const _testInitMissionsHub = async (_accessControl) => {
  const missionsHub = await ethers.deployContract("MissionsHub", [
    _accessControl,
  ]);
  return missionsHub;
};

// *:::::::::::::: ------- ::::::::::::::* //
// *:::::::::::::: FEATURE ::::::::::::::* //
// *:::::::::::::: ------- ::::::::::::::* //

const _testInitFeaturesHub = async (accessControlAdress) => {
  const featuresHub = await ethers.deployContract("FeaturesHub", [
    accessControlAdress,
  ]);
  return featuresHub;
};

const _testInitFeature = async (
  _accessControl,
  account,
  _missionId,
  uriData,
  datas
) => {
  if (!datas) {
    datas = FEATURE_DATAS_EXEMPLE;
  }
  if (!uriData) {
    uriData = FEATURE_DATAS_URI_EXEMPLE;
  }

  const accessControl = await getProxy(_accessControl);
  const _cv = await accessControl.getCVByAddress(account.address);
  const amount = ethers.parseEther(`${datas.wadge}`);
  const featuresHub = await getContractAt(
    "FeaturesHub",
    await accessControl.iFH()
  );

  const id = parseInt(await featuresHub.getTokensLength()) + 1;
  uriData.id = id;
  datas.wadge = amount;
  const json = await createURIFeature(uriData);
  const tokenURI = json.IpfsHash;
  expect(tokenURI).to.not.be.equal("");

  datas.tokenURI = tokenURI;
  datas.missionID = _missionId;
  const beforeLength = parseInt(await featuresHub.balanceOf(_cv));

  const tx = await accessControl.connect(account).postFeature(datas, {
    value: amount,
  });

  expect(await accessControl.getCVByAddress(tx.from)).to.be.equal(_cv);

  await tx.wait();
  const afterLength = parseInt(await featuresHub.balanceOf(_cv));
  expect(beforeLength).to.equal(afterLength - 1);

  const _tokenURI = await featuresHub.tokenURI(parseInt(id));
  expect(_tokenURI).to.not.be.equal("");

  const owner = await featuresHub.ownerOf(id);
  expect(owner).to.be.equal(_cv);

  return id;
};

// *:::::::::::::: --------------- ::::::::::::::* //
// *:::::::::::::: WORKER PROPOSAL ::::::::::::::* //
// *:::::::::::::: --------------- ::::::::::::::* //

const _testInitWorkerProposalHub = async (accessControl) => {
  const workerProposalHub = await ethers.deployContract("WorkProposalHub", [
    accessControl,
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

const _testInitLaunchpadHub = async (accessControl) => {
  const launchpadHub = await ethers.deployContract("LaunchpadHub", [
    accessControl,
  ]);
  await launchpadHub.waitForDeployment();
  return launchpadHub;
};

const _testInitLaunchpad = async (_accessControl, account, amount, datas) => {
  if (!datas) {
    datas = LAUNCHPAD_DATAS_EXEMPLE;
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getTime() + 10 * 24 * 60 * 60 * 1000
    );
    datas.saleEnd = futureDate.getTime();
  }

  const accessControl = await getProxy(_accessControl);
  const launchpadHub = await getContractAt(
    "LaunchpadHub",
    await accessControl.iLH()
  );

  const beforeLength = parseInt(await launchpadHub.getTokensLength());
  if (!amount) {
    amount = parseInt(await accessControl.launchpadPrice());
  }

  const tx = await accessControl
    .connect(account)
    .createLaunchpad(datas, { value: `${amount}` });

  expect(tx.from).to.be.equal(account.address);
  const id = parseInt(await launchpadHub.getTokensLength());
  expect(beforeLength).to.be.equal(id - 1);
  const launchpadAddr = await launchpadHub.getLaunchpad(id);
  const launchpad = await getContractAt("Launchpad", launchpadAddr);
  
  
  expect(await launchpad.owner()).to.be.equal(account.address);

  const _tierDataMaxCap =  [200000000, 100000000, 300000000 ];
  const _tierDataMinCap = [15000000, 10000000, 20000000 ];
  
  await launchpad.connect(account).updateTiers(3, _tierDataMaxCap, _tierDataMinCap )
  const launchpadDatas = await launchpad.getDatas();
  expect(await launchpadDatas.numberOfTier).to.be.equal(3);
  let tierData = await launchpad.getTierData(0)

  expect(parseInt(tierData.minTierCap)).to.be.equal(_tierDataMinCap[0])
  expect(parseInt(tierData.maxTierCap)).to.be.equal(_tierDataMaxCap[0])
  tierData = await launchpad.getTierData(1)
  expect(parseInt(tierData.minTierCap)).to.be.equal(_tierDataMinCap[1])
  expect(parseInt(tierData.maxTierCap)).to.be.equal(_tierDataMaxCap[1])
  tierData = await launchpad.getTierData(2)
  expect(parseInt(tierData.minTierCap)).to.be.equal(_tierDataMinCap[2])
  expect(parseInt(tierData.maxTierCap)).to.be.equal(_tierDataMaxCap[2])


  await expect(launchpad.getTierData(3)).to.be.revertedWith("ID tier out of range");
  
};

module.exports = {
  _testInitAccessControl,
  _testInitFeaturesHub,
  _testInitWorkerProposalHub,
  _testInitWorkerProposal,
  _testInitFactoryCV,
  _testInitCV,
  _testInitPub,
  _testInitPubHub,
  _testInitMissionsHub,
  _testInitMission,
  _testInitFeature,
  _testInitLaunchpad,
  _testInitLaunchpadHub,
};
