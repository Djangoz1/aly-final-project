"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/Missions/LayoutMission";
import { useMissionState } from "context/hub/mission";
import { Pub } from "components/Pub";
import { v4 } from "uuid";
import { useEffect, useState } from "react";

const Page = ({ params }) => {
  const missionID = params.missionID;
  let [pubs, setPubs] = useState(null);
  let state = useMissionState();

  useEffect(() => {
    if (!pubs) {
      console.log("pubs", pubs);
      setPubs(state?.mission?.datas?.pubs);
    }
  }, [missionID, state?.mission?.datas?.pubs]);

  return (
    <LayoutMission path={`/pubs`} id={missionID}>
      <div className="w-full flex flex-col">
        {pubs?.map((el) => (
          <Pub id={el} owner={state?.owner} key={v4()} />
        ))}

        {/* <MySideList list={isState?.list} badges={isState?.mission?.badges} /> */}
      </div>
    </LayoutMission>
  );
};

export default Page;
