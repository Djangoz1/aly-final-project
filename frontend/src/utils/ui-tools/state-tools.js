// import { _getterFactoryCV } from "./web3-tools";

import { fetchCV, fetchStatsOfCV } from "utils/cvs";
import { fetchPubsOfCV } from "utils/pubs";
import { fetchMission, fetchMissionsOfCV, fetchWorksOfCV } from "utils/works";
import { fetchJSONByCID } from "./pinata-tools";
import { _apiGet } from "./web3-tools";
import { ADDRESSES } from "constants/web3";
import { findBadges } from "utils/works/tools";
import { ethers } from "ethers";

export const stateCV = async (cvID) => {
  if (cvID?.cvID) {
    return cvID;
  } else if (cvID && cvID > 0) {
    return {
      cvID: cvID,

      metadatas: await fetchCV(cvID),
      datas: await fetchStatsOfCV(cvID),
    };
  }
};

export const stateDetailsCV = async (cvID) => {
  let _missions = await _apiGet("indexerOfToken", [
    cvID,
    ADDRESSES["missionsHub"],
  ]);
  let missions = [];
  for (let index = 0; index < _missions?.length; index++) {
    let missionID = _missions[index];
    let mission = await stateMission(missionID);
    missions.push(mission);
  }

  return {
    missions: missions,
  };
};

export const stateMission = async (missionID) => {
  if (missionID?.missionID) {
    return missionID;
  } else if (missionID && missionID > 0) {
    let datas = await fetchMission(missionID);
    let courts = [];
    let badges = await findBadges({ features: datas?.features, courts });

    let result = {
      missionID,
      datas,
      metadatas: await fetchJSONByCID(datas?.uri),
      badges,
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
    datas.owner = await _apiGet("cvOf", [owner]);
    datas.wadge = await ethers.utils.formatEther(datas?.wadge);
    let uri = await _apiGet("tokenURIOf", [
      featureID,
      ADDRESSES["featuresHub"],
    ]);
    let metadatas = await fetchJSONByCID(uri);
    let details = await _apiGet("datasOfWork", [featureID]);

    return { featureID, datas, metadatas, details };
  }
};
