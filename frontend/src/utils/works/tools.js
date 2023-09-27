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
