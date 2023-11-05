"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateCourtTools,
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
import { _apiGet, _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";
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
import { MyNum } from "components/myComponents/text/MyNum";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { ethers } from "ethers";

function PageCourt({ params }) {
  const { cv, metadatas, details } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isArbitrator, setIsOnCourt] = useState(false);
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const courtID = params.courtID;

  let dispatch = useToolsDispatch();

  let fetchArbitrators = async () => {
    for (let index = 0; index < details?.arbitrators?.length; index++) {
      let arbitrator = details?.arbitrators?.[index];
      if (arbitrator?.courtID == courtID) {
        setIsOnCourt({
          ...arbitrator,
          datas: await _apiGet("datasOfArbitrator", [arbitrator?.arbitratorID]),
        });

        return;
      }
    }
  };

  useEffect(() => {
    if (!isLoading === null || status === "reload") {
      setIsLoading(true);
      doStateCourtTools(dispatch, courtID);
      setIsLoading(false);

      console.log("Origin fetch is datas court");
    }
  }, [courtID, status]);

  useEffect(() => {
    if (details && isArbitrator?.datas?.cvID != cv) {
      fetchArbitrators();
    }
  }, [cv, details]);

  console.log(state);
  console.log("metadatas,", metadatas);
  console.log("isArbitrator", isArbitrator);

  return (
    <MyLayoutDashboard
      //   isLoading={isLoading}
      template={[0, 0, 1, 1, 1]?.[pointer]}
      id={courtID}
      btn={{
        title: "Invest on court",
        info: (
          <>You can invest on court to increase your chance to be selected</>
        ),
        url: "#section1",
      }}
      refresh={() => doStateProfileTools({ dispatch, courtID })}
      owner={{ ...metadatas, cvID: cv }}
      price={ethers?.utils?.formatEther(state?.datas?.balance || 0)}
      statusObj={{ current: isArbitrator ? 0 : 1 }}
      header={state?.profile?.metadatas?.username}
      lists={[
        {
          title: "Court",

          description: (
            <>
              <MyNum num={ethers.utils.formatEther(state?.datas?.balance || 0)}>
                <MySub style={"ml-1"}>ETH</MySub>
              </MyNum>
              <Icon icon={icfyETHER} className="ml-2 mr-4" />
              <MyNum num={state?.datas?.arbitrators?.length}>
                <MySub style={"ml-1"}>arbitrators</MySub>
              </MyNum>
              <Icon icon={icfy.person.team} className="ml-2 mr-4" />
            </>
          ),
          url: `#section2`,
        },

        {
          title: "Disputes",
          image: "/social.png",
          description: (
            <>
              TO DO
              <Icon icon={icsystem.mission} className="ml-2 mr-4" />
            </>
          ),
          url: `#section1`,
        },

        isArbitrator
          ? {
              title: "My Balance",
              image: "/wallet.png",
              description: (
                <>
                  <MyNum
                    toFix={0}
                    num={ethers.utils.formatEther(
                      isArbitrator?.datas?.balance || 0
                    )}
                  >
                    <MySub style={"ml-1"}>ETH</MySub>
                  </MyNum>
                  <Icon icon={icfyETHER} className="ml-2 mr-4" />
                  <MyNum toFix={0} num={isArbitrator?.datas?.nbArbitrations}>
                    <MySub style={"ml-1"}>disputes</MySub>
                  </MyNum>
                  <Icon icon={icfy.court.hammer} className="ml-2 mr-4" />
                </>
              ),
              url: `#section2`,
            }
          : undefined,
      ]}
      menus={[
        {
          title: "Lists",
          url: "#section1",
          icon: icfy.ux.admin,
        },
        isArbitrator
          ? {
              title: "Invest",
              url: "#section2",
              icon: icfy.ux.mediation,
            }
          : undefined,
      ]}
      initState={isState}
      target={"court"}
    >
      <>
        {
          [
            <></>,
            <LayoutForm
              stateInit={{
                allowed: true,
                placeholders: {
                  tokens: "Tokens to invest",
                  tokensWithdraw: "Tokens to withdraw",
                },
                form: {
                  target: "investToken",
                  tokens: 0,
                  tokensWithdraw: 0,
                },
              }}
            >
              <MyInput
                type={"number"}
                target={"tokens"}
                styles={"w-full"}
                label={"Invest on court"}
                setter={async (tokens) => {
                  await _apiPostPayable(
                    "investOnCourt",
                    [parseInt(courtID)],
                    ethers.utils.parseEther(tokens)._hex
                  );
                  doStateCourtTools(dispatch, courtID);
                  await fetchArbitrators();
                }}
              ></MyInput>
              <MyInput
                type={"number"}
                target={"tokensWithdraw"}
                label={"Withdraw on court"}
                styles={"mt-2"}
                max={ethers.utils.formatEther(
                  isArbitrator?.datas?.balance || 0
                )}
                setter={async (tokens) => {
                  await _apiPost("withdrawFromCourt", [
                    ethers.utils.parseEther(tokens)._hex,
                    parseInt(courtID),
                  ]);
                  doStateCourtTools(dispatch, courtID);
                  await fetchArbitrators();
                }}
              ></MyInput>
            </LayoutForm>,

            <div className="flex h-full w-full">
              <CVMenusDropdown style={"   backdrop-blur mr-[1px] w-1/5"} />

              <CVOverview />
            </div>,
            <CVInfos />,
            cv == courtID ? <EditProfile /> : undefined,
          ]?.[pointer]
        }

        {/* 

          
          {cv == courtID && (
            <Viewport id={"edit"} index={3}>
            </Viewport>
          )}
          <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">
           
            {state?.profile?.courtID != cv &&
              state?.profile?.metadatas?.attributes?.[0]?.visibility && (
                <EditWorker styles={"c2"} />
              )}
          </div> */}
      </>
    </MyLayoutDashboard>
  );
}

export default PageCourt;
