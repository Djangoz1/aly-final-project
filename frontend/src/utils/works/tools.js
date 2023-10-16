import { ENUMS } from "constants/enums";
import { stateFeature } from "utils/ui-tools/state-tools";

export let findBadges = async ({ features }) => {
  let _courts = [];

  for (let index = 0; index < features?.length; index++) {
    let id = features[index];
    const feature = await stateFeature(id);
    if (!_courts.includes(feature?.datas?.specification)) {
      _courts.push(feature?.datas?.specification);
    }
  }

  let _badges = [];
  for (let index = 0; index < _courts?.length; index++) {
    let courtID = _courts[index];
    let data = {
      id: courtID,
      court: ENUMS.courts[courtID].court,
      badge: ENUMS.courts[courtID].badge,
    };

    _badges.push(data);
  }
  return _badges;
};

export let stateDetailsMission = async ({ features }) => {
  let _courts = [];
  let _features = [];
  for (let index = 0; index < features?.length; index++) {
    let id = features[index];
    const feature = await stateFeature(id);
    if (!_courts.includes(feature?.datas?.specification)) {
      _courts.push(feature?.datas?.specification);
    }

    _features.push({
      title: feature?.metadatas?.title,
      id: feature?.featureID,
      domain: feature?.metadatas?.attributes?.[0]?.domain,
      specification: feature?.datas?.specification,
    });
  }

  let _badges = [];
  for (let index = 0; index < _courts?.length; index++) {
    let courtID = _courts[index];
    _badges.push(courtID);
  }
  return { badges: _badges, features: _features };
};
