"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateLaunchpad,
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
import { LaunchpadProfile } from "sections/Launchpad/state/LaunchpadProfile";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();
  const { state, status } = useToolsState();

  let [isState, setIsState] = useState(null);

  const launchpadID = params.launchpadID;

  let fetch = async () => {
    let launchpad = await stateLaunchpad(launchpadID);

    let _state = {
      launchpad: {
        datas: launchpad.datas,
        launchpadID: launchpad.launchpadID,
        metadatas: launchpad.metadatas,
      },
      owner: launchpad.owner,
    };

    setIsState(_state);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [launchpadID, status]);

  return (
    <MyLayoutApp
      id={launchpadID}
      url={`/launchpad/${launchpadID}`}
      //   side={
      //     <div className="flex flex-col  ml-auto w-full  justify-end">
      //       <div className="flex  ml-auto  mb-5 w-2/3  flex-col">
      //         <div className="flex text-xs justify-between">
      //           <p className="c2 ">Followers</p>
      //           <span>{state?.owner?.datas?.followers}</span>
      //         </div>

      //         <div className="flex text-xs justify-between">
      //           <p className="c2 ">Posts</p>
      //           <span>{state?.owner?.datas?.pubs}</span>
      //         </div>

      //         <div className="flex text-xs justify-between">
      //           <p className="c2 ">Features</p>
      //           <span>{state?.owner?.datas?.features}</span>
      //         </div>
      //         <div className="flex text-xs justify-between">
      //           <p className="c2 ">Jobs</p>
      //           <span>{state?.owner?.datas?.proposals?.length}</span>
      //         </div>
      //         <div className="flex text-xs justify-between">
      //           <p className="c2 ">Launchpads</p>
      //           <span>{state?.owner?.datas?.launchpads?.length}</span>
      //         </div>
      //       </div>
      //       <div className="flex items-center justify-end mb-1">
      //         <Icon icon={icfyETHER} className="text-white c2 text-[74px]" />
      //         <div className="flex flex-col">
      //           <span className="text-xs text-white/40">Récoltés</span>
      //           <p className="text-sm">
      //             <span>{state?.owner?.datas?.amount}</span>
      //             <span className="text-white c2 text-sm ml-3">ETH</span>
      //           </p>
      //           <span className="text-xs text-white/40">Dépensés</span>
      //           <p className="text-sm">
      //             <span>{state?.owner?.datas?.amount}</span>
      //             <span className="text-white c2 text-sm ml-3">ETH</span>
      //           </p>
      //         </div>
      //       </div>

      //       <div
      //         className={`flex items-center  p-3 mt-3 ml-auto badge badge-outline badge-xs text-xs badge-${
      //           state?.owner?.metadatas?.attributes?.[0]?.visibility
      //             ? "error"
      //             : "success"
      //         }`}
      //       >
      //         <Icon
      //           icon={
      //             state?.owner?.metadatas?.attributes?.[0]?.visibility
      //               ? icfy.eye.open
      //               : icfy.eye.close
      //           }
      //           className="text-lg mr-4"
      //         />
      //         {state?.owner?.metadatas?.attributes?.[0]?.visibility
      //           ? "Visible"
      //           : "Invisible"}
      //       </div>

      //       <div className="flex items-end mt-4 ml-auto">
      //         {state?.owner?.details?.badges?.map((el) => (
      //           <Icon
      //             icon={ENUMS.courts?.[el]?.badge}
      //             className="text-white c2 text-[24px] ml-4"
      //           />
      //         ))}
      //       </div>
      //     </div>
      //   }
      subMenus={[
        { title: "Profile", tag: "profile" },
        { title: "CV", tag: "cv" },
        { title: "Missions", tag: "missions" },
        { title: "Overview", tag: "overview" },
      ]}
      target={""}
      initState={isState}
    >
      <Viewport
        img={state?.launchpad?.metadatas?.attributes?.[0]?.banniere}
        id={"profile"}
        index={0}
      >
        <LaunchpadProfile />
      </Viewport>
      <Viewport id={"cv"} index={1}>
        <div
          className="backdrop-blur  mr-4 w-full  h-[75vh] p-5 text-xs rounded-lg shadow overflow-scroll hide-scrollbar  text-justify whitespace-break-spaces"
          header={{
            title: state?.mission?.metadatas?.title,
            image: state?.mission?.metadatas?.image,
          }}
          noBtn={true}
        >
          {state?.launchpad?.metadatas?.description}
        </div>
      </Viewport>
      <Viewport id={"missions"} index={2}>
        <CVMissions />
      </Viewport>
      <Viewport id={"overview"} index={3}>
        <CVOverview />
      </Viewport>
    </MyLayoutApp>
  );
}

export default App;
