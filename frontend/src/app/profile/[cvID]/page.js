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
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

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
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
  MyMenusTabs,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { doStateFormPointer } from "context/form";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { STATUS } from "constants/status";
import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let _state = await doStateProfileTools({ dispatch, cvID });
    console.log("_state", _state);
    setIsState(_state);
    setIsLoading(false);
  };
  useEffect(() => {
    if (status === "idle" || status === "reload") {
      fetch();
      console.log("Origin fetch is datas cv", isState);
    }
  }, [cvID, status]);

  return (
    <MyLayoutDashboard
      //! isLoading={isLoading}
      template={[0, 1, 1, 1, 1]?.[pointer]}
      id={cvID}
      btn={{
        title: "Invite worker",
        info: <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>,
      }}
      refresh={() => doStateProfileTools({ dispatch, cvID })}
      owner={state?.profile?.metadatas}
      price={state?.profile?.datas?.amount}
      allowed={cv == cvID}
      statusObj={{
        current: state?.profile?.metadatas?.visibility ? 0 : 1,
        to: state?.profile?.metadatas?.visibility ? 1 : 0,
      }}
      header={state?.profile?.metadatas?.username}
      lists={[
        {
          title: "Enterprise",
          description: (
            <>
              {state?.profile?.datas?.missions?.length}{" "}
              <Icon icon={icsystem.mission} className="ml-2 mr-4" />
              {state?.profile?.datas?.features}{" "}
              <Icon icon={icsystem.feature} className="ml-2 mr-4" />
              {state?.profile?.details?.wadge}{" "}
              <Icon icon={icfyETHER} className="ml-2 mr-4" />
            </>
          ),
          url: `#section2`,
        },
        {
          title: "Worker",
          description: (
            <>
              {state?.profile?.details?.arbitrators?.length}{" "}
              <Icon icon={icfy.court.hammer} className="ml-2 mr-4" />
              {state?.profile?.datas?.proposals?.length}{" "}
              <Icon icon={icsystem.feature} className="ml-2 mr-4" />
              {state?.profile?.details?.wadge}{" "}
              <Icon icon={icfyETHER} className="ml-2 mr-4" />
            </>
          ),
          url: `#section2`,
        },
        {
          title: "Launchpad",
          description: (
            <>
              {state?.profile?.datas?.launchpads?.length}{" "}
              <Icon icon={icsystem.launchpad} className="ml-2 mr-4" />
              {state?.profile?.details?.launchpads?.totalRaised}{" "}
              <Icon icon={icfyETHER} className="ml-2 mr-4" />
            </>
          ),
          url: `#section2`,
        },

        {
          title: "Social",
          description: (
            <>
              {state?.profile?.datas?.missions?.length}{" "}
              <Icon icon={icsystem.mission} className="ml-2 mr-4" />
              {state?.profile?.datas?.features}{" "}
              <Icon icon={icsystem.feature} className="ml-2 mr-4" />
              {state?.profile?.details?.wadge}{" "}
              <Icon icon={icfyETHER} className="ml-2 mr-4" />
            </>
          ),
          url: `#section1`,
        },
        {
          title: "Notifications",
          description: (
            <>
              {state?.profile?.datas?.invitation?.length}{" "}
              <Icon icon={icfySEND} className="ml-2 rotate-180 mr-4" />
              {state?.profile?.details?.invites?.length}{" "}
              <Icon icon={icfySEND} className="ml-2 mr-4" />
            </>
          ),
          url: `#section2`,
        },
      ]}
      menus={[
        {
          title: "Profile",
          url: "#section1",
          icon: icfy.ux.admin,
        },
        {
          title: "Dashboard",
          url: "#section2",
          icon: icfy.ux.mediation,
        },
        {
          title: "Informations",
          url: "#section3",
          icon: icfy.ux.admin,
        },

        cv == cvID
          ? {
              title: "Settings",
              url: "#section4",
              icon: icfy.tools.casual,
            }
          : undefined,
      ]}
      target={"profile"}
    >
      <>
        {
          [
            <></>,
            <CVProfile />,
            <div className="flex h-full w-full">
              <CVMenusDropdown style={"   backdrop-blur mr-[1px] w-1/5"} />

              <CVOverview />
            </div>,
            <CVInfos />,
            cv == cvID ? <EditProfile /> : undefined,
          ]?.[pointer]
        }

        {/* 

          
          {cv == cvID && (
            <Viewport id={"edit"} index={3}>
            </Viewport>
          )}
          <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">
           
            {state?.profile?.cvID != cv &&
              state?.profile?.metadatas?.visibility && (
                <EditWorker styles={"c2"} />
              )}
          </div> */}
      </>
    </MyLayoutDashboard>
  );
}

export default App;
