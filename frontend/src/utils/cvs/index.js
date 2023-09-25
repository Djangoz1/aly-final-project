import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchStatOfMission } from "utils/works";

export let fetchCV = async (cvID) => {
  if (cvID && cvID > 0) {
    let length = await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]);
    if (cvID > length) {
      throw new Error("Error fetchCV: Invalid tokenID");
    }
    let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);

    let json = await fetchJSONByCID(uri);
    json.cvID = cvID;

    return json;
  }
};

export let fetchStatsOfCV = async (cvID) => {
  if (cvID && cvID > 0) {
    let missions = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["missionsHub"]])
    );
    let features = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["featuresHub"]])
    );

    let pubs = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["pubsHub"]])
    );
    let launchpads = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["launchpadHub"]])
    );

    let _jobs = await _apiGet("jobsOfCV", [cvID]);

    let followers = parseInt(await _apiGet("lengthOfFollower", [cvID]));
    let follows = parseInt(await _apiGet("lengthOfFollowed", [cvID]));

    let _missions = features > 0 ? await _apiGet("missionsOfCV", [cvID]) : null;
    let amount = 0;
    for (let index = 0; index < _missions?.length; index++) {
      const _id = _missions[index];
      if (_id && _id > 0) {
        let stats = await fetchStatOfMission(_id);
        amount += stats?.amount;
      }
    }

    let stats = {
      missions,
      features,
      proposals: _jobs.length,
      pubs,
      launchpads,
      followers,
      follows,
      amount,
    };

    return stats;
  }
};
