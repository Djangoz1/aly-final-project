"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/works/Missions/LayoutMission";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import { MENUS_EDIT } from "constants/menus";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { useAccount } from "wagmi";
import { _apiPost } from "utils/ui-tools/web3-tools";

const Page = ({ params }) => {
  const missionID = params.missionID;
  let { address } = useAccount();
  let state = useMissionState();
  let dispatch = useMissionDispatch();
  let dispatchAuth = useAuthDispatch();
  MENUS_EDIT.feature[1].setter = async (id) => {
    console.log(id);
    await _apiPost("askToJoin", [id]);
    await doStateMission(dispatch, missionID);
    await doAuthCV(dispatchAuth, address);
  };
  return (
    <LayoutMission path={`/features`} id={missionID}>
      <div className="w-full flex">
        <MyTable
          list={_table_features(state.features, state.owner)}
          head={HEAD_table_features}
          editBtns={MENUS_EDIT.feature}
        />

        {/* <MySideList list={isState?.list} badges={isState?.mission?.badges} /> */}
      </div>
    </LayoutMission>
  );
};

export default Page;
