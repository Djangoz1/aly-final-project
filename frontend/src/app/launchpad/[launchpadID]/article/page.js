"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import { stateLaunchpad } from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { CVOverview } from "sections/Profile/state/CVOverview";

import {
  AssetProfile1,
  AssetProfileCard,
} from "components/assets/AssetProfile";
import { ethers } from "ethers";
import { fromTimestamp } from "utils/ux-tools";
import { STATUS } from "constants/status";
import Link from "next/link";
import { ImagePin } from "components/Image/ImagePin";
import { Avatar } from "components/profile/ProfileAvatar";
import { CVName } from "components/links/CVName";

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
  console.log("state launchpad page", state);
  return (
    <MyLayoutApp
      particles={true}
      id={launchpadID}
      url={`/launchpad/${launchpadID}/article`}
      initState={isState}
    >
      <div className="flex flex-col">
        <div className="  relative items-end w-screen">
          <div className="z-2  absolute bottom-0 p-5 h-full w-full  flex flex-col justify-end">
            <p className="font-bold text-6xl uppercase w-fit mb-10 max-w-3/4">
              {state?.launchpad?.metadatas?.title}
            </p>
            <div className="flex w-fit items-start">
              <Avatar style={"w-24"} CID={state?.owner?.image} />
              <div className="flex ml-3 flex-col">
                <p>
                  <span className="italic text-white/80 mr-2">by</span>
                  <CVName metadata={state?.owner} />
                </p>
                <p className="text-xs">{state?.owner?.description} </p>
              </div>
            </div>
          </div>
          <Link
            href={"/launchpad/" + state?.launchpad?.launchpadID}
            className="btn btn-ghost h-fit absolute bottom-5 text-4xl  right-5"
          >
            <Icon className="rotate-180" icon={icfy.ux.enter}></Icon>
          </Link>
          <ImagePin
            CID={state?.launchpad?.metadatas?.attributes?.[0]?.banniere}
            styleImg={"w-screen h-[50vh] -z-1  top-0 left-0"}
          />
        </div>
        <div
          className="backdrop-blur  mr-4 w-3/4  h-[75vh] p-5 text-xs rounded-lg shadow overflow-scroll hide-scrollbar  text-justify whitespace-break-spaces"
          noBtn={true}
        >
          {state?.launchpad?.metadatas?.description}
        </div>
      </div>
    </MyLayoutApp>
  );
}

export default App;
