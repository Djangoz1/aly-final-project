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
import { MyCard } from "components/myComponents/card/MyCard";
import { icfy } from "icones";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doStateCV } from "context/hub/cv";
import { BoardCard } from "components/Mission/BoardCard";
import { MyCalendar } from "components/myComponents/MyCalendar";
import { MENUS_EDIT } from "constants/menus";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { useAccount } from "wagmi";

const Mission = ({ params }) => {
  const missionID = params.missionID;
  let { address } = useAccount();
  let state = useMissionState();
  let dispatch = useMissionDispatch();
  let dispatchAuth = useAuthDispatch();
  MENUS_EDIT.feature[1].setter = async (id) => {
    await _apiPost("askToJoin", [id]);
    await doStateMission(dispatch, missionID);
    await doAuthCV(dispatchAuth, address);
  };
  return (
    <LayoutMission id={missionID}>
      <div className="w-full mt-5  flex">
        <MyCard
          head={{ title: "Jobs", icon: icfy.work.casual }}
          styles={
            "w-full max-h-[60vh] overflow-y-scroll hidden-scrollbar pb-5 text-xs mr-12"
          }
        >
          <MyTable
            list={_table_features(state.features, state.owner)}
            head={HEAD_table_features}
            editBtns={MENUS_EDIT.feature}
          />
        </MyCard>
        <div className="flex flex-col ml-auto">
          <BoardCard />
        </div>
      </div>
    </LayoutMission>
  );
};

export default Mission;
