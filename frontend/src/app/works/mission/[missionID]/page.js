"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/Missions/LayoutMission";
import { useMissionState } from "context/hub/mission";

const Mission = ({ params }) => {
  const missionID = params.missionID;

  let state = useMissionState();

  return (
    <LayoutMission id={missionID}>
      <div className="w-full flex"></div>
    </LayoutMission>
  );
};

export default Mission;
