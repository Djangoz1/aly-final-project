import { icfyLOCK, icfyUNLOCK } from "icones";
import React, { useEffect, useState } from "react";
import { themes } from "styles/style";
import {
  stateDetailsCV,
  stateFeature,
  stateMission,
} from "utils/ui-tools/state-tools";
import { fetchMissionsOfCV } from "utils/works";

import { ENUMS_COURTS } from "constants/enums";

import { MySideList } from "components/myComponents/MySideList";
import { findBadges } from "utils/works/tools";

import { useCVState } from "context/hub/cv";
import { MyTable } from "components/myComponents/table/MyTable";
import {
  HEAD_table_missions,
  _table_mission,
  _table_missions,
} from "utils/works/mission";

export const ProfileMissions = ({}) => {
  let state = useCVState();
  let [isDetails, setIsDetails] = useState(null);
  let details = async () => {
    setIsDetails(await stateDetailsCV(state.cvID));
  };
  useEffect(() => {
    if (!isDetails && state.cvID) details();
  }, [state.cvID]);

  return (
    <MyTable
      state={state}
      list={_table_missions(state, isDetails)}
      head={HEAD_table_missions}
    />
  );
};
