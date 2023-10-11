"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";
import { STATUS } from "constants/status";

import { AgendasMission } from "sections/works/Missions/state/AgendasMission";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MissionPubs } from "sections/works/Missions/state/MissionPubs";
import { Viewport } from "components/myComponents/layout/MyViewport";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();

  let [isState, setIsState] = useState(null);

  const missionID = params.missionID;

  let fetch = async () => {
    let mission = await stateMission(missionID);
    let owner = await stateCV(mission?.datas?.owner);
    owner.details = await stateDetailsCV(mission?.datas?.cvOwner);
    let features = [];

    for (let index = 0; index < mission?.datas?.features?.length; index++) {
      const featureID = mission?.datas?.features[index];
      let feature = await stateFeature(featureID);
      features.push(feature);
    }

    let _state = {
      mission,
      owner,
      features,
    };
    setIsState(_state);
  };
  useEffect(() => {
    if (!isState) {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [missionID]);

  return (
    <MyLayoutApp
      id={missionID}
      url={`/works/mission/${missionID}`}
      side={
        <div className="flex flex-col  ml-auto w-full  justify-end">
          <div className="flex  ml-auto  mb-5 w-1/2  flex-col">
            {tools?.state?.followers && (
              <div className="flex text-xs justify-between">
                <p className="c2 ">Followers</p>
                <span>{tools?.state?.followers?.length}</span>
              </div>
            )}
            {tools?.state?.pubs && (
              <div className="flex text-xs justify-between">
                <p className="c2 ">Posts</p>
                <span>{tools?.state?.pubs?.length}</span>
              </div>
            )}
            <div className="flex text-xs justify-between">
              <p className="c2 ">Features</p>
              <span>{tools?.state?.mission?.datas?.features?.length}</span>
            </div>
            <div className="flex text-xs justify-between">
              <p className="c2 ">Work slot</p>
              <span>
                {tools?.state?.mission?.datas?.features?.length -
                  tools?.state?.mission?.datas?.workers}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end mb-1">
            <Icon icon={icfyETHER} className="text-white c2 text-[34px]" />
            <p className="text-xl">
              <span>{tools?.state?.mission?.datas?.amount}</span>
              <span className="text-white c2 text-lg ml-3">ETH</span>
            </p>
          </div>

          <div
            className={
              "flex items-center p-3 mt-3 ml-auto badge badge-outline badge-xs text-xs badge-" +
              STATUS?.mission[tools?.state?.mission?.datas?.status]?.color
            }
          >
            <Icon
              icon={STATUS?.mission[tools?.state?.mission?.datas?.status]?.icon}
              className="text-lg mr-4"
            />
            {STATUS?.mission[tools?.state?.mission?.datas?.status]?.status}
          </div>

          <div className="flex items-end mt-4 ml-auto">
            {tools?.state?.mission?.badges?.map((el) => (
              <Icon
                icon={el?.badge}
                className="text-white c2 text-[24px] ml-4"
              />
            ))}
          </div>
        </div>
      }
      subMenus={[
        { title: "Profile", tag: "profile" },
        { title: "Agendas", tag: "agendas" },
        { title: "Features", tag: "features" },
        { title: "Pubs", tag: "pubs" },
      ]}
      target={""}
      initState={isState}
    >
      <Viewport id={"profile"} index={0}>
        <MissionProfile />
      </Viewport>
      <Viewport id={"agendas"} index={1}>
        <AgendasMission />
      </Viewport>
      <Viewport id={"features"} index={2}>
        <MissionFeatures />
      </Viewport>
      <Viewport id={"pubs"} index={3}>
        <MissionPubs />
      </Viewport>
    </MyLayoutApp>
  );
}

export default App;
