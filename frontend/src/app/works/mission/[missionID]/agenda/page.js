"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/works/Missions/LayoutMission";

import { _apiPost } from "utils/ui-tools/web3-tools";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyCalendar } from "components/myComponents/MyCalendar";
import { icfy } from "icones";

const Page = ({ params }) => {
  const missionID = params.missionID;

  return (
    <LayoutMission path={`/agenda`} id={missionID}>
      <MyCard
        head={{ title: "Agenda", icon: icfy.ux.calendar }}
        styles={"w-full text-xs mt-4"}
      >
        <MyCalendar />
      </MyCard>
    </LayoutMission>
  );
};

export default Page;
