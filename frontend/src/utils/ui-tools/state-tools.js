// import { _getterFactoryCV } from "./web3-tools";

import { fetchCV, fetchStatsOfCV } from "utils/cvs";
import { fetchPubsOfCV } from "utils/pubs";
import { fetchMission, fetchMissionsOfCV, fetchWorksOfCV } from "utils/works";
import { fetchJSONByCID } from "./pinata-tools";
import { _apiGet, _apiGetAt } from "./web3-tools";
import { ADDRESSES } from "constants/web3";
import { findBadges, stateDetailsMission } from "utils/works/tools";
import { ethers } from "ethers";
import { _api } from "@iconify/react";
import { STATUS } from "constants/status";

export const stateCV = async (cvID) => {
  if (cvID?.cvID) {
    return cvID;
  } else if (cvID && cvID > 0) {
    return {
      cvID: cvID,
      metadatas: await fetchCV(cvID),
      datas: await fetchStatsOfCV(cvID),
      details: null,
    };
  }
};

export const stateDetailsCV = async (cvID) => {
  let _jobs = await _apiGet("jobsOfCV", [cvID]);

  let badges = [];

  let _wadge = 0;

  let features = [];
  let arbitrators = [];
  let disputes = [];
  let _arbitrators = [];

  for (let index = 0; index < _jobs?.length; index++) {
    const featureID = _jobs[index];
    let feature = await stateFeature(featureID);
    !badges.includes(feature?.datas?.specification) &&
      badges.push(feature?.datas?.specification);
    _wadge += parseFloat(feature?.datas?.wadge);

    if (feature?.datas?.status === 2) {
      let arbitration = await _apiGet("arbitrationOfCV", [
        cvID,
        feature?.datas?.specification,
      ]);
      if (!_arbitrators.includes(arbitration)) {
        _arbitrators.push({
          arbitratorID: arbitration,
          courtID: feature?.datas?.specification,
        });
      }
    }
    if (feature?.datas?.dispute) {
      disputes.push(featureID);
    }

    features.push({
      featureID: feature?.featureID,
      title: feature?.metadatas?.title,
      dispute: feature?.datas?.dispute,
      domain: feature?.metadatas?.attributes?.[0]?.domain,
      specification: feature?.datas?.specification,
      status: feature?.datas?.status,
      specification: feature?.datas?.specification,
      wadge: feature?.datas?.wadge,
    });
  }

  for (let index = 0; index < _arbitrators?.length; index++) {
    let arbitrator = {
      arbitratorID: _arbitrators[index]?.arbitratorID,
      courtID: _arbitrators[index]?.courtID,
      disputes: [],
    };

    let disputes = await _apiGet("indexerOfToken", [
      _arbitrators[index]?.arbitratorID,
      ADDRESSES["disputesDatasHub"],
    ]);

    for (let index1 = 0; index1 < disputes?.length; index1++) {
      arbitrator.disputes.push({
        disputeID: disputes[index1],
        allowance: await _apiGet("allowanceOfArbitrator", [
          disputes[index1],
          arbitrator.arbitratorID,
        ]),
      });
    }
    arbitrators.push(arbitrator);

    // let arbitrator = await _apiGet("datasOfArbitrator", [_arbitrators[index]?.arbitratorID]);
    // let disputes = await _apiGet("indexerOfToken", [
    //   _arbitrators[index]?.arbitratorID,
    //   ADDRESSES["disputesDatasHub"],
    // ]);
    // let _disputes = [];
    // for (let index = 0; index < disputes.length; index++) {
    //   const disputeID = disputes[index];

    //   let dispute = await _apiGet("datasOfDispute", [disputeID]);
    //   let uriFeature = await _apiGet("tokenURIOf", [
    //     dispute?.featureID,
    //     ADDRESSES["featuresHub"],
    //   ]);
    //   let metadatas = await fetchJSONByCID(uriFeature);
    //   dispute.title = await metadatas?.title;
    //   dispute.allowance = await _apiGet("allowanceOfArbitrator", [
    //     dispute?.id,
    //     _arbitrators[index]?.arbitratorID,
    //   ]);
    //   _disputes.push(dispute);
    // }

    // arbitrators.arr.push({
    //   court: arbitrator?.courtID,
    //   arbitratorID: _arbitrators[index]?.arbitratorID,
    //   disputes: _disputes,
    // });

    // arbitrators.totalBalance += parseInt(arbitrator?.balance);
    // arbitrators.totalArbitration += parseInt(arbitrator?.nbArbitrations);
  }

  let wadge = _jobs?.length > 0 ? _wadge / _jobs.length : 0;

  return {
    missions: null,
    badges,
    wadge,
    invites: null,
    launchpads: null,
    arbitrators,

    features,
    disputes,
  };
};

export const stateDispute = async (disputeID) => {
  let dispute = {
    ...(await _apiGet("datasOfDispute", [disputeID])),
    rules: null,
    timers: null,
    arbitrators: null,
    counters: null,
  };
  let uriFeature = await _apiGet("tokenURIOf", [
    dispute?.featureID,
    ADDRESSES["featuresHub"],
  ]);

  dispute.rules = await _apiGet("rulesOfDispute", [disputeID]);
  dispute.timers = await _apiGet("timersOfDispute", [disputeID]);
  dispute.arbitrators = await _apiGet("arbitratorsOfDispute", [disputeID]);
  dispute.counters = await _apiGet("countersOfDispute", [disputeID]);

  let metadatas = await fetchJSONByCID(dispute?.tokenURI);
  let _metadatas = await fetchJSONByCID(uriFeature);
  metadatas.title = _metadatas?.title;
  return { datas: dispute, disputeID, metadatas };
};

export const stateMission = async (missionID) => {
  if (missionID?.missionID) {
    return missionID;
  } else if (missionID && missionID > 0) {
    let datas = await fetchMission(missionID);

    let details = await stateDetailsMission({ features: datas?.features });

    let result = {
      missionID,
      datas,
      metadatas: await fetchJSONByCID(datas?.uri),
      details: details,
    };
    return result;
  }
};

export const statePub = async (pubID, walletClient) => {
  if (pubID?.pubID) {
    return pubID;
  } else if (pubID && pubID > 0) {
    let _owner = await _apiGet("ownerOfToken", [pubID, ADDRESSES["pubsHub"]]);

    let uri = await _apiGet("tokenURIOf", [pubID, ADDRESSES["pubsHub"]]);
    let metadata = await fetchJSONByCID(uri);

    let datas = await _apiGet("datasOfPub", [pubID]);
    if (datas?.answers > 0) {
      datas.answers = await _apiGet("answersOfPub", [pubID]);
    } else {
      datas.answers = [];
    }
    let payable = {
      datas: null,
      metadatas: null,
    };
    if (datas?.isPayable) {
      payable.datas = await _apiGet("datasOfPayablePub", [pubID], walletClient);
      if (payable?.datas?.tokenURI !== "") {
        payable.metadatas = await fetchJSONByCID(payable?.datas?.tokenURI);
      }
    } else {
      payable = undefined;
    }
    return {
      pubID,
      datas: datas,
      payable: payable,
      metadata,
      owner: await _apiGet("cvOf", [_owner]),
    };
  }
};

export let stateFeature = async (featureID) => {
  if (featureID?.featureID) return featureID;
  else if (featureID && featureID > 0) {
    let datas = await _apiGet("datasOfFeature", [featureID]);
    let owner = await _apiGet("ownerOfToken", [
      featureID,
      ADDRESSES["featuresHub"],
    ]);

    datas.owner = await _apiGet("cvOf", [owner]);
    datas.wadge = await ethers.utils.formatEther(datas?.wadge);
    let uri = await _apiGet("tokenURIOf", [
      featureID,
      ADDRESSES["featuresHub"],
    ]);
    let metadatas = await fetchJSONByCID(uri);

    let details = await _apiGet("datasOfWork", [featureID]);
    if (details?.workerContest || details?.ownerContest) {
      datas.dispute = await _apiGet("disputeOfFeature", [featureID]);
    } else {
      datas.dispute = null;
    }
    details.dispute = null;
    if (datas?.dispute) {
      let disputeDatas = await _apiGet("datasOfDispute", [datas?.dispute]);
      disputeDatas.rules = await _apiGet("rulesOfDispute", [datas?.dispute]);
      disputeDatas.timers = await _apiGet("timersOfDispute", [datas?.dispute]);
      disputeDatas.counters = await _apiGet("countersOfDispute", [
        datas?.dispute,
      ]);
      disputeDatas.arbitrators = await _apiGet("arbitratorsOfDispute", [
        datas?.dispute,
      ]);
      details.dispute = {
        metadatas: await fetchJSONByCID(disputeDatas?.tokenURI),
        datas: disputeDatas,
      };
    }
    if (details?.workerDemand?.length > 0) {
      details.demands = [];
      for (let index = 0; index < details?.workerDemand.length; index++) {
        details.demands.push(await stateCV(await details?.workerDemand[index]));
      }
    }

    return { featureID, datas, metadatas, details };
  }
};

export const stateLaunchpad = async (launchpadID) => {
  if (launchpadID > 0) {
    const datas = await _apiGet("datasOfLaunchpad", [launchpadID]);
    let metadatas = await fetchJSONByCID(datas.tokenURI);
    let tokenURI = await _apiGet("tokenURIOf", [
      launchpadID,
      ADDRESSES["launchpadsDatasHub"],
    ]);
    // Faire un checker
    datas.currentTier = parseInt(
      await _apiGet("currentTierIDOf", [launchpadID])
    );
    console.log(datas.currentTier);

    datas.tokenName = await _apiGetAt({
      func: "name",
      targetContract: "erc20",
      address: datas?.tokenAddress,
    });
    datas.tokenSymbol = await _apiGetAt({
      func: "symbol",
      targetContract: "erc20",
      address: datas?.tokenAddress,
    });

    let _metadatas = await fetchJSONByCID(tokenURI);
    metadatas.attributes[0].bio = _metadatas?.description;
    metadatas.attributes[0].banniere = _metadatas?.attributes?.[0]?.banniere;
    metadatas.attributes[0].facebook = _metadatas?.attributes?.[0]?.facebook;
    metadatas.attributes[0].linkedin = _metadatas?.attributes?.[0]?.linkedin;
    metadatas.attributes[0].twitter = _metadatas?.attributes?.[0]?.twitter;
    metadatas.attributes[0].github = _metadatas?.attributes?.[0]?.github;
    metadatas.image = _metadatas?.image;

    datas.tiersDatas = [];
    let tokenPrice = 0;

    datas.address = await _apiGet("addressOfLaunchpad", [launchpadID]);
    datas.status = await _apiGet("statusOfLaunchpad", [launchpadID]);
    let _owner = await _apiGet("ownerOfToken", [
      launchpadID,
      ADDRESSES["launchpadHub"],
    ]);

    datas.allowance = parseInt(
      (await _apiGetAt({
        func: "allowance",
        targetContract: "erc20",
        args: [_owner, datas.address],
        address: datas?.tokenAddress,
      })) /
        10n ** 18n
    );

    datas.balanceOwner = parseInt(
      (await _apiGetAt({
        func: "balanceOf",
        targetContract: "erc20",
        args: [_owner],
        address: datas?.tokenAddress,
      })) /
        10n ** 18n
    );

    let cvOwner = await _apiGet("cvOf", [_owner]);
    let owner = await fetchCV(cvOwner);

    let amountRaised = 0;
    for (let i = 0; i < datas?.numberOfTier; i++) {
      let tierDatas = await _apiGet("tierOfLaunchpad", [launchpadID, i]);
      datas.tiersDatas.push(tierDatas);
      tokenPrice += parseFloat(tierDatas.tokenPrice);
      amountRaised += parseInt(tierDatas.amountRaised);
    }
    datas.amountRaised = ethers.utils.formatEther(`${amountRaised}`);
    datas.tokenPrice = ethers.utils.formatEther(
      `${tokenPrice / datas?.numberOfTier}`
    );
    return { launchpadID, datas, metadatas, owner };
  }
};

export const stateTools = async ({ id, url, pointer, target, state, arr }) => {
  return {
    id,
    url,
    pointer,
    target,
    state: null,
    arr: null,
  };
};

export const findObjectByID = async ({ id, target, targetID, arr }) => {
  let result = arr?.filter((el) =>
    targetID ? el?.[target]?.[targetID] == id : el?.[target] == id
  );
  return result;
};
