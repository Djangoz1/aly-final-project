const { getContractAt } = require("../helpers/test_init");
const {
  FEATURE_DATAS_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
} = require("../helpers/test_utils");
const {
  createURICV,
  createURIMission,
  createURIFeature,
  createURIPub,
} = require("./pinata");

let _createCV = async (name, account, addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrG = await _iAS.apiGet();
  let _addrP = await _iAS.apiPost();

  let apiGet = await getContractAt("APIGet", _addrG);
  let apiPost = await getContractAt("APIPost", _addrP);

  let id = parseInt(await apiGet.lengthOfCVs()) + 1;
  let result = await createURICV({
    id,
    name,
  });

  await apiPost.connect(account).createCV(result.IpfsHash);

  let _id = await apiGet.cvOf(account.address);
  if (id != _id) {
    result = await createURICV({
      id: _id,
      name,
    });
    console.log("Error ID -----", _id);
  }
  return _id;
};

let _createMission = async ({
  title,
  description,
  account,
  social,
  reference,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrMH = await _iAS.missionsHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );

  let id = parseInt(await apiGet.tokensLengthOf(_addrMH)) + 1;

  let result = await createURIMission({
    id,
    title,
    description,
    attributes: social || reference ? [{ social, reference }] : null,
    social,
  });

  await apiPost.connect(account).createMission(result.IpfsHash, {
    value: `${await balancesHub.missionPrice()}`,
  });

  if (account.address != (await apiGet.ownerOfToken(id, _addrMH))) {
    throw new Error("Error Missions: URI ID");
  }
  return id;
};

let _createFeature = async ({
  missionID,
  estimatedDays,
  isInviteOnly,
  specification,
  title,
  description,
  account,
  accounts,
  wadge,
  domain,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrFH = await _iAS.featuresHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );
  let _missionID =
    missionID || (await _createMission({ account, addressSystem }));

  let featureID = parseInt(await apiGet.tokensLengthOf(_addrFH)) + 1;
  let moock = FEATURE_DATAS_EXEMPLE;
  let result = await createURIFeature({
    id: featureID,
    title,
    description,
    attributes: { domain },
  });

  await apiPost
    .connect(account)
    .createFeature(
      _missionID,
      estimatedDays || moock?.estimatedDays,
      isInviteOnly || moock?.isInviteOnly,
      result.IpfsHash,
      specification || moock?.specification,
      {
        value: `${wadge || (await balancesHub.missionPrice())}`,
      }
    );

  if (account.address != (await apiGet.ownerOfToken(featureID, _addrFH))) {
    throw new Error("Error Feature: URI ID");
  }

  if (accounts?.length > 0) {
    const _account = accounts[0];
    let cvID = await apiGet.cvOf(_account.address);
    await apiPost.connect(account).inviteWorker(cvID, featureID);
    await apiPost.connect(_account).acceptJob(featureID);

    console.log(cvID, " is worker");
  }

  return { id: featureID, missionID: _missionID };
};

let _createPub = async ({
  missionID,
  answerID,
  title,
  description,
  account,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrPH = await _iAS.pubsHub();
  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());

  let id = parseInt(await apiGet.tokensLengthOf(_addrPH)) + 1;
  let result = await createURIPub({
    id,
    title,
    description,
  });

  if (missionID && missionID > 0) {
    await apiPost.connect(account).createPubMission(missionID, result.IpfsHash);
  } else if (answerID && answerID > 0) {
    await apiPost.connect(account).createPubAnswer(answerID, result.IpfsHash);
  } else {
    await apiPost.connect(account).createPub(result.IpfsHash);
  }

  if (account.address != (await apiGet.ownerOfToken(id, _addrPH))) {
    throw new Error("Error Pub: URI ID");
  }
  return id;
};

module.exports = { _createCV, _createMission, _createFeature, _createPub };
