import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchStatOfMission } from "utils/works";

export let fetchCV = async (cvID) => {
  if (cvID && cvID > 0) {
    let length = await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]);
    if (cvID > length || !cvID) {
      throw new Error("Error fetchCV: Invalid tokenID");
    }
    let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);

    let json = await fetchJSONByCID({ id: uri, table: "accounts" });

    return json;
  }
};

export let fetchStatsOfCV = async (cvID) => {
  if (cvID && cvID > 0) {
    let missions = await _apiGet("indexerOfToken", [
      cvID,
      ADDRESSES["missionsHub"],
    ]);

    let features = await _apiGet("indexerOfToken", [
      cvID,
      ADDRESSES["featuresHub"],
    ]);

    // let pubs = await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]);

    let launchpads = await _apiGet("indexerOfToken", [
      cvID,
      ADDRESSES["launchpadHub"],
    ]);

    let _jobs = await _apiGet("jobsOfCV", [cvID]);

    let invitations = await _apiGet("invitesOfCV", [cvID]);

    let amount = 0;

    let notifications = 0;
    for (let index = 0; index < features.length; index++) {
      const featureID = features[index];
      let datas = await _apiGet("datasOfWork", [featureID]);
      notifications += datas.workerDemand.length;
    }
    // ! To dooooo

    let stats = {
      missions,
      features,
      proposals: _jobs,
      // pubs,
      arbitrators: await _apiGet("indexerOfToken", [
        cvID,
        ADDRESSES["arbitratorsHub"],
      ]),
      invitations,
      notifications,
      launchpads,
      acceptToken: await _apiGet("isAcceptToken", [cvID]),
      amount,
    };

    return stats;
  }
};
