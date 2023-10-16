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
  let _missions = await _apiGet("indexerOfToken", [
    cvID,
    ADDRESSES["missionsHub"],
  ]);

  let _jobs = await _apiGet("jobsOfCV", [cvID]);
  let missions = [];
  let badges = [];

  let _wadge = 0;
  for (let index = 0; index < _missions?.length; index++) {
    let missionID = _missions[index];
    let mission = await stateMission(missionID);

    missions.push(mission);
  }

  let features = [];
  let arbitrators = {
    nbArbitrations: null,
    court: [],
    totalBalance: 0,
    totalArbitration: 0,
  };
  let disputes = [];
  let _arbitrators = [];

  for (let index = 0; index < _jobs?.length; index++) {
    const featureID = _jobs[index];
    let feature = await stateFeature(featureID);
    _wadge += parseFloat(feature?.datas?.wadge);

    !badges.includes(feature?.datas?.specification) &&
      badges.push(feature?.datas?.specification);

    if (feature?.datas?.status === 2) {
      _arbitrators.push(
        await _apiGet("arbitrationOfCV", [cvID, feature?.datas?.specification])
      );
    }
    if (feature?.datas?.dispute) {
      disputes.push(featureID);
    }
    features.push({
      featureID: feature?.featureID,
      title: feature?.metadatas?.title,
      domain: feature?.metadatas?.attributes?.[0]?.domain,
      specification: feature?.datas?.specification,
      status: feature?.datas?.status,
      specification: feature?.datas?.specification,
      wadge: feature?.datas?.wadge,
    });
  }

  arbitrators.nbArbitrations = _arbitrators.length;
  for (let index = 0; index < _arbitrators.length; index++) {
    let arbitrator = await _apiGet("datasOfArbitrator", [_arbitrators[index]]);
    arbitrators.totalBalance += parseInt(arbitrator?.balance);
    arbitrators.totalArbitration += parseInt(arbitrator?.nbArbitrations);
    arbitrators.arr.push(arbitrator);
  }

  let wadge = _jobs?.length > 0 ? _wadge / _jobs.length : 0;

  return {
    missions,
    badges,
    wadge,
    invites: null,
    launchpads: null,
    arbitrators,
    features,
    disputes,
  };
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

export const statePub = async (pubID) => {
  if (pubID?.pubID) {
    return pubID;
  } else if (pubID && pubID > 0) {
    let _owner = await _apiGet("ownerOfToken", [pubID, ADDRESSES["pubsHub"]]);

    let uri = await _apiGet("tokenURIOf", [pubID, ADDRESSES["pubsHub"]]);
    let metadata = await fetchJSONByCID(uri);
    return {
      pubID,
      datas: await _apiGet("datasOfPub", [pubID]),
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

    if (datas.status === 3) {
      datas.dispute = await _apiGet("disputeOfFeature", [featureID]);
    }
    datas.owner = await _apiGet("cvOf", [owner]);
    datas.wadge = await ethers.utils.formatEther(datas?.wadge);
    let uri = await _apiGet("tokenURIOf", [
      featureID,
      ADDRESSES["featuresHub"],
    ]);
    let metadatas = await fetchJSONByCID(uri);

    let details = await _apiGet("datasOfWork", [featureID]);
    details.dispute = null;
    if (datas?.dispute) {
      let disputeDatas = await _apiGet("datasOfDispute", [datas?.dispute]);
      disputeDatas.rules = await _apiGet("rulesOfDispute", [datas?.dispute]);
      disputeDatas.timers = await _apiGet("timersOfDispute", [datas?.dispute]);
      disputeDatas.counters = await _apiGet("countersOfDispute", [
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
      await _apiGetAt({
        func: "allowance",
        targetContract: "erc20",
        args: [_owner, datas.address],
        address: datas?.tokenAddress,
      })
    );

    datas.balanceOwner = parseInt(
      await _apiGetAt({
        func: "balanceOf",
        targetContract: "erc20",
        args: [_owner],
        address: datas?.tokenAddress,
      })
    );

    let cvOwner = await _apiGet("cvOf", [_owner]);
    let owner = await fetchCV(cvOwner);

    datas.amountRaised = 0;
    for (let i = 0; i < datas?.numberOfTier; i++) {
      let tierDatas = await _apiGet("tierOfLaunchpad", [launchpadID, i]);
      datas.tiersDatas.push(tierDatas);
      tokenPrice += parseFloat(tierDatas.tokenPrice);
      datas.amountRaised += parseInt(tierDatas.amountRaised);
    }
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
