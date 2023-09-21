import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet, _apiGetAt } from "utils/ui-tools/web3-tools";

export let fetchMissionsOfCV = async (cvID, stop) => {
  if (cvID && cvID > 0) {
    let _missions = await _apiGet("missionsOfCV", [cvID]);
    let result = [];
    let stopper = stop || _missions.length;

    for (let index = 0; index < stopper; index++) {
      let _id = parseInt(_missions[index]);
      let datas = await fetchMission(_id);

      result.push(datas);
    }
    return result;
  }
};

export let fetchMission = async (missionID) => {
  if (missionID && missionID > 0) {
    let datas = await _apiGet("datasOfMission", [missionID]);

    let stat = await fetchStatOfMission(missionID);
    datas.amount = stat.amount;
    datas.workers = stat.worker;
    datas.id = parseInt(datas?.id);
    datas.uri = await _apiGet("tokenURIOf", [
      missionID,
      ADDRESSES["missionsHub"],
    ]);
    let owner = await _apiGet("ownerOfToken", [
      missionID,
      ADDRESSES["missionsHub"],
    ]);
    datas.owner = await _apiGet("cvOf", [owner]);
    datas.pubs = await _apiGet("pubsOfMission", [missionID]);

    return datas;
  }
};

export let fetchStatOfMission = async (missionID) => {
  let datas = await _apiGet("datasOfMission", [missionID]);
  let amount = 0;
  let worker = 0;
  for (let index = 0; index < datas?.features?.length; index++) {
    const _id = datas?.features?.[index];
    if (_id && _id > 0) {
      let datas = await _apiGet("datasOfFeature", [_id]);
      let datasWork = await _apiGet("datasOfWork", [_id]);
      if (datasWork?.signedWorker > 0) {
        worker += 1;
      }
      let num = await ethers.utils.formatEther(datas?.wadge);

      amount += parseFloat(num);
    }
  }

  return { amount, worker };
};

export let fetchWorksOfCV = async (cvID) => {
  if (cvID && cvID > 0) {
    let _missions = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["missionsHub"]])
    );
    let _features = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["featuresHub"]])
    );
    let _proposals = parseInt(
      await _apiGet("balanceOfToken", [cvID, ADDRESSES["workProposalHub"]])
    );
    let length = {
      missions: _missions,
      features: _features,
      proposals: _proposals,
    };
    return length;
  }
};
