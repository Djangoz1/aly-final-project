"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/Missions/LayoutMission";
import { useMissionState } from "context/hub/mission";

const Page = ({ params }) => {
  const missionID = params.missionID;

  let state = useMissionState();

  return (
    <LayoutMission path={`/features`} id={missionID}>
      <div className="w-full flex">
        <MyTable
          state={state}
          list={_table_features(state)}
          head={HEAD_table_features}
        />

        {/* <MySideList list={isState?.list} badges={isState?.mission?.badges} /> */}
      </div>
    </LayoutMission>
  );
};

export default Page;
