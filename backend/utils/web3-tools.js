const { getContractAt, _testInitToken } = require("../helpers/test_init");
const {
  FEATURE_DATAS_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
} = require("../helpers/test_utils");
const {
  createURICV,
  createURIMission,
  createURIFeature,
  createURIPub,
  createURILaunchpad,
  createURI,
} = require("./pinata");

let _createCV = async (name, account, addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrG = await _iAS.apiGet();
  let _addrP = await _iAS.apiPost();
  let _addrCVH = await _iAS.cvsHub();

  let apiGet = await getContractAt("APIGet", _addrG);
  let apiPost = await getContractAt("APIPost", _addrP);

  let tokenURI = await createURICV({
    name,
  });

  await apiPost.connect(account).createCV(tokenURI);

  let _id = await apiGet.cvOf(account.address);
  await createURI({
    table: "cvs",
    metadatas: { cvID: parseInt(_id), userID: tokenURI },
  });
  return _id;
};

let _createMission = async ({
  launchpad,
  title,
  description,
  accounts,
  account,
  social,
  reference,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrMH = await _iAS.missionsHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let apiPostPayable = await getContractAt(
    "APIPostPayable",
    await _iAS.apiPostPayable()
  );
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );

  let id = parseInt(await apiGet.tokensLengthOf(_addrMH)) + 1;
  let launchpadID;
  if (launchpad) {
    launchpadID = await _createLaunchpad({ account, addressSystem });

    let datas = await apiGet.datasOfLaunchpad(launchpadID);

    let amount = 0n;
    for (let index = 0; index < accounts.length; index++) {
      if (
        datas.minCap > amount ||
        (datas.minCap == 0 && datas.maxCap > amountRaised)
      ) {
        await apiPostPayable
          .connect(accounts[index])
          .buyTokens(launchpadID, { value: datas.minInvest });
        amount += datas.maxInvest;
      }
    }
    await apiPost.connect(account).setTierID(launchpadID);
  }

  let cvID = await apiGet.cvOf(account.address);
  let userID = await apiGet.tokenURIOf(cvID, await _iAS.cvsHub());

  let uri = await createURIMission({
    title,
    userID: userID,
    description,
  });

  await apiPostPayable.connect(account).createMission(uri, {
    value: `${await balancesHub.missionPrice()}`,
  });

  if (account.address != (await apiGet.ownerOfToken(id, _addrMH))) {
    throw new Error("Error Missions: URI ID");
  }
  return { missionID: id, launchpadID };
};

let _createFeature = async ({
  missionID,
  estimatedDays,
  launchpad,
  isInviteOnly,
  specification,
  title,
  description,
  account,
  accounts,
  finish,
  wadge,
  domain,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrFH = await _iAS.featuresHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let apiPostPayable = await getContractAt(
    "APIPostPayable",
    await _iAS.apiPostPayable()
  );
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );
  let _missionID = missionID;
  let launchpadID;
  if (!missionID) {
    let mission = await _createMission({
      accounts,
      account,
      addressSystem,
      launchpad,
    });
    launchpadID = mission.launchpadID;
    _missionID = mission.missionID;
  }

  let featureID = parseInt(await apiGet.tokensLengthOf(_addrFH)) + 1;
  let moock = FEATURE_DATAS_EXEMPLE;
  let cvID = await apiGet.cvOf(account.address);
  let idMission = await apiGet.tokenURIOf(_missionID, await _iAS.missionsHub());
  let uri = await createURIFeature({
    missionID: idMission,
    title,
    description,
    attributes: [{ domain }],
  });

  if (launchpadID) {
    await apiPost
      .connect(account)
      .createFeatureLaunchpad(
        wadge,
        _missionID,
        estimatedDays || moock?.estimatedDays,
        isInviteOnly === false || isInviteOnly === true
          ? isInviteOnly
          : moock?.isInviteOnly,
        uri,
        specification || moock?.specification
      );
  } else {
    await apiPostPayable
      .connect(account)
      .createFeature(
        _missionID,
        estimatedDays || moock?.estimatedDays,
        isInviteOnly === false || isInviteOnly === true
          ? isInviteOnly
          : moock?.isInviteOnly,
        uri,
        specification || moock?.specification,
        {
          value: `${wadge || (await balancesHub.missionPrice())}`,
        }
      );
  }

  if (account.address != (await apiGet.ownerOfToken(featureID, _addrFH))) {
    throw new Error("Error Feature: URI ID");
  }

  if (accounts?.length > 0) {
    const _account = accounts[0];
    let cvID = await apiGet.cvOf(_account.address);
    await apiPost.connect(account).inviteWorker(cvID, featureID);
    await apiPost.connect(_account).acceptJob(featureID);

    console.log(cvID, " is worker");
    if (finish) {
      await apiPost.connect(account).validFeature(featureID);
    }
  }

  return { id: featureID, launchpadID, missionID: _missionID };
};

let _createLaunchpad = async ({
  account,
  addressSystem,
  launchpadDatas,
  tiersDatas,
}) => {
  let tokens = 3000000n;

  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );
  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let apiPostPayable = await getContractAt(
    "APIPostPayable",
    await _iAS.apiPostPayable()
  );

  let cvID = await apiGet.cvOf(account.address);
  let userID = await apiGet.tokenURIOf(cvID, _iAS.cvsHub());

  let _addrLH = await _iAS.launchpadsHub();
  let moock = LAUNCHPAD_DATAS_EXEMPLE;

  let id = parseInt(await apiGet.tokensLengthOf(_addrLH)) + 1;

  let { launchpadURI, tokenURI } = await createURILaunchpad({ userID });

  const currentTimestampSeconds = Math.floor(Date.now() / 1000);

  // Ajoutez 10 secondes
  const saleStart = currentTimestampSeconds + 100000;
  let _launchpadDatas = {
    id,

    maxCap: launchpadDatas?.maxCap || moock.maxCap,
    minCap: launchpadDatas?.minCap || moock.minCap,
    minInvest:
      launchpadDatas?.minInvest || launchpadDatas?.minCap || moock.minCap,
    maxInvest:
      launchpadDatas?.maxInvest || launchpadDatas?.maxCap || moock.maxCap,

    saleStart: launchpadDatas?.saleStart || saleStart,
    saleEnd: launchpadDatas?.saleEnd || moock.saleEnd,
    amountRaised: 0,
    totalUser: launchpadDatas?.totalUser || moock.totalUser,
  };
  await apiPostPayable
    .connect(account)
    .createLaunchpad(_launchpadDatas, tokenURI, {
      value: await balancesHub.launchpadPrice(),
    });

  let launchpadAddr = await apiGet.addressOfLaunchpad(id);

  if (account.address != (await apiGet.ownerOfToken(id, _addrLH))) {
    throw new Error("Error Launchpad: URI ID");
  }
  return id;
};

let _createPub = async ({
  missionID,
  answerID,
  title,
  description,
  account,
  img,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrPH = await _iAS.pubsHub();
  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());

  let cvID = await apiGet.cvOf(account.address);
  let userID = await apiGet.tokenURIOf(cvID, _iAS.cvsHub());

  let id = parseInt(await apiGet.tokensLengthOf(_addrPH)) + 1;
  let uri = await createURIPub({
    userID,
    title,
    img,
    description,
    missionID,
    answerID,
    owner: account.address,
  });

  if (missionID && missionID > 0) {
    await apiPost.connect(account).createPubMission(missionID, uri);
  } else if (answerID && answerID > 0) {
    await apiPost.connect(account).createPubAnswer(answerID, uri);
  } else {
    await apiPost.connect(account).createPub(uri);
  }

  if (account.address != (await apiGet.ownerOfToken(id, _addrPH))) {
    throw new Error("Error Pub: URI ID");
  }
  return id;
};

module.exports = {
  _createCV,
  _createMission,
  _createFeature,
  _createPub,
  _createLaunchpad,
};
