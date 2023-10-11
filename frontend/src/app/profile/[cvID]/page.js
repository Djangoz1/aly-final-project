"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { CVMissions } from "sections/Profile/state/CVFeatures";
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { Particle } from "components/myComponents/MyParticles";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();
  const { state, status } = useToolsState();

  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let fetch = async () => {
    let owner = await stateCV(cvID);
    owner.details = await stateDetailsCV(cvID);
    let _pubs = await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]);

    let _state = {
      owner,
      pubs: [],
    };

    for (let index = 0; index < _pubs.length; index++) {
      _state.pubs.push(await statePub(_pubs[index]));
    }
    setIsState(_state);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [cvID, status]);

  return (
    <MyLayoutApp
      id={cvID}
      url={`/profile/${cvID}`}
      side={
        <div className="flex flex-col  ml-auto w-full  justify-end">
          <div className="flex  ml-auto  mb-5 w-2/3  flex-col">
            <div className="flex text-xs justify-between">
              <p className="c2 ">Followers</p>
              <span>{state?.owner?.datas?.followers}</span>
            </div>

            <div className="flex text-xs justify-between">
              <p className="c2 ">Posts</p>
              <span>{state?.owner?.datas?.pubs}</span>
            </div>

            <div className="flex text-xs justify-between">
              <p className="c2 ">Features</p>
              <span>{state?.owner?.datas?.features}</span>
            </div>
            <div className="flex text-xs justify-between">
              <p className="c2 ">Jobs</p>
              <span>{state?.owner?.datas?.proposals?.length}</span>
            </div>
            <div className="flex text-xs justify-between">
              <p className="c2 ">Launchpads</p>
              <span>{state?.owner?.datas?.launchpads?.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-end mb-1">
            <Icon icon={icfyETHER} className="text-white c2 text-[74px]" />
            <div className="flex flex-col">
              <span className="text-xs text-white/40">Récoltés</span>
              <p className="text-sm">
                <span>{state?.owner?.datas?.amount}</span>
                <span className="text-white c2 text-sm ml-3">ETH</span>
              </p>
              <span className="text-xs text-white/40">Dépensés</span>
              <p className="text-sm">
                <span>{state?.owner?.datas?.amount}</span>
                <span className="text-white c2 text-sm ml-3">ETH</span>
              </p>
            </div>
          </div>

          <div
            className={`flex items-center  p-3 mt-3 ml-auto badge badge-outline badge-xs text-xs badge-${
              state?.owner?.metadatas?.attributes?.[0]?.visibility
                ? "error"
                : "success"
            }`}
          >
            <Icon
              icon={
                state?.owner?.metadatas?.attributes?.[0]?.visibility
                  ? icfy.eye.open
                  : icfy.eye.close
              }
              className="text-lg mr-4"
            />
            {state?.owner?.metadatas?.attributes?.[0]?.visibility
              ? "Visible"
              : "Invisible"}
          </div>

          <div className="flex items-end mt-4 ml-auto">
            {state?.owner?.details?.badges?.map((el) => (
              <Icon
                icon={ENUMS.courts?.[el]?.badge}
                className="text-white c2 text-[24px] ml-4"
              />
            ))}
          </div>
        </div>
      }
      subMenus={[
        { title: "Profile", tag: "profile" },
        { title: "CV", tag: "cv" },
        { title: "Missions", tag: "missions" },
        { title: "Overview", tag: "overview" },
        cv == cvID && { title: "Settings", tag: "settings" },
      ]}
      target={""}
      initState={isState}
    >
      <Particle style={"fixed z-0"} />
      <Viewport id={"profile"} index={0}>
        <CVProfile />
      </Viewport>
      <Viewport id={"cv"} index={1}>
        <MyModal
          styles={{
            btn: "btn-ghost ml-auto w-fit h-fit overflow-scroll hide-scrollbar",
          }}
          btn={
            <ImagePin
              style={"h-[70vh] w-[35vw]"}
              CID={state?.owner?.metadatas?.attributes?.[0]?.cvImg}
            />
          }
          modal={
            <ImagePin
              style={"h-[90vh] w-[80vw] "}
              CID={state?.owner?.metadatas?.attributes?.[0]?.cvImg}
            />
          }
        />
      </Viewport>
      <Viewport id={"missions"} index={2}>
        <CVMissions />
      </Viewport>
      <Viewport id={"overview"} index={3}>
        <CVOverview />
      </Viewport>
      {cv == cvID && (
        <Viewport id={"edit"} index={4}>
          <EditProfile />
        </Viewport>
      )}
    </MyLayoutApp>
  );
}

export default App;
