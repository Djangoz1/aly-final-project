"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

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
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { Particle } from "components/myComponents/MyParticles";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let _state = await doStateProfileTools({ dispatch, cvID });
    setIsState(_state);
    setIsLoading(false);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Origin fetch is datas cv", isState);
    }
  }, [cvID, status]);

  return (
    <MyLayoutApp
      notLoad={true}
      particles={true}
      id={cvID}
      url={`/profile/${cvID}`}
      subMenus={
        !isLoading && [
          { title: "Profile", tag: "profile" },
          { title: "Informations", tag: "infos" },
          { title: "Overview", tag: "overview" },
          cv == cvID && { title: "Settings", tag: "settings" },
        ]
      }
      target={"profile"}
      // initState={isState}
    >
      {!isLoading ? (
        <>
          <Viewport id={"profile"} index={0}>
            <CVProfile />
          </Viewport>
          <Viewport id={"informations"} index={1}>
            <CVInfos />
          </Viewport>

          <Viewport side={<CVMenusDropdown />} id={"overview"} index={2}>
            <CVOverview />
          </Viewport>
          {cv == cvID && (
            <Viewport id={"edit"} index={3}>
              <EditProfile />
            </Viewport>
          )}
          <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">
            <CreatePub
              style={"  c2  mb-4"}
              btn={<Icon icon={icfy?.msg?.chat} className="text-6xl m-2" />}
            />
            {state?.owner?.cvID != cv &&
              state?.owner?.metadatas?.attributes?.[0]?.visibility && (
                <EditWorker styles={"c2"} />
              )}
          </div>
        </>
      ) : (
        <Viewport full={true} index={null}>
          <div className="flex items-center justify-center w-full h-full">
            <MyLoader />
          </div>
        </Viewport>
      )}
    </MyLayoutApp>
  );
}

export default App;
