"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyCODE,
  icfyETHER,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfyTWITTER,
  icsystem,
} from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";
import { STATUS } from "constants/status";

import { AgendasMission } from "sections/works/Missions/state/AgendasMission";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MissionPubs } from "sections/works/Missions/state/MissionPubs";
import { Viewport } from "components/myComponents/layout/MyViewport";
import {
  AssetProfile,
  AssetProfile1,
  AssetProfileCard,
} from "components/assets/AssetProfile";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import Link from "next/link";
import { MyMenusDropdown } from "components/myComponents/menu/MyMenus";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyFunMenus } from "components/myComponents/menu/MyFunMenus";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { CVName } from "components/inputs/inputsCV/CVName";
import { BtnFollow } from "components/btn/BtnsSocial/BtnFollow";
import { MissionMenusDropdown } from "sections/works/Missions/state/MissionMenusDropdown";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";
import { ENUMS } from "constants/enums";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();
  const { state, pointer } = useToolsState();

  let [isState, setIsState] = useState(null);
  let [loading, setLoading] = useState(null);
  const missionID = params.missionID;
  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setLoading(true);
    let _state = await doStateMissionTools(dispatch, parseInt(missionID));
    setIsState(_state);
    setLoading(false);
  };
  useEffect(() => {
    if (!isState) {
      fetch();
      console.log("Origine !!! fetch mission state", isState);
    }
  }, [missionID]);

  let askToJoin = async (featureID) => {
    console.log("askToJoin", askToJoin);
    await _apiPost("askToJoin", [parseInt(featureID)]);
    await doStateMissionTools(dispatch, parseInt(featureID));
  };
  console.log(state);
  return (
    <MyLayoutDashboard
      // setter={askToJoin}

      id={missionID}
      allowed={
        cv == state?.mission?.datas?.owner &&
        state?.mission?.datas?.status === 0
      }
      refresh={() => doStateMissionTools(dispatch, state?.mission?.missionID)}
      template={[0, 1, 1, 1, 1, 1]?.[pointer]}
      isLoading={loading}
      header={state?.mission?.metadatas?.title}
      statusObj={{
        current: state?.mission?.datas?.status,
        to: 1,
      }}
      price={state?.mission?.datas?.amount || 0}
      owner={{ ...state?.owner?.metadatas, cvID: state?.owner?.cvID }}
      url={`/works/mission/${missionID}`}
      btn={{
        title: cv == state?.owner?.cvID ? "New feature" : "Ask to join",
        info: <>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</>,
        url: cv == state?.owner?.cvID ? "/create/feature" : "#section2",
      }}
      // ownerProfile={
      //   loading ? null : <AssetProfileCard />
      //   // <AssetProfile1
      //   //   style={"w-full"}
      //   //   noBtn={true}
      //   //   cvID={isState?.mission?.datas?.owner}
      //   //   target={"owner"}
      //   // />
      // }
      lists={[
        {
          icon: icfyCODE,
          title: "Contract",
          description: (
            <>
              <MySub style={"mr-2"}>On work</MySub>
              {tools?.state?.mission?.datas?.workers}
              {tools?.state?.mission?.datas?.workers > 0 && (
                <> / {tools?.state?.mission?.datas?.features?.length}</>
              )}
              <Icon icon={icsystem.mission} className="ml-2 mr-4" />
            </>
          ),
        },
        {
          title: "Specifications",
          image: "/worker.png",
          description: (
            <>
              <Icon icon={icsystem.feature} className=" mr-2" />
              {state?.mission?.details?.badges?.map((el, i) => (
                <Icon
                  icon={ENUMS.courts?.[el]?.badge}
                  className={`w-[34px] h-[34px] _hover rounded-full ${
                    i > 0 && "-ml-5 hover:ml-0"
                  }`}
                  key={v4()}
                />
              ))}
            </>
          ),
          url: `#section1`,
        },
        {
          title: "Workers",

          description: (
            <>
              <Icon icon={icsystem.profile} className=" mr-2" />
              {state?.features?.map((el, i) => (
                <ProfileAvatar
                  onlyAvatar={true}
                  style={`w-[44px] h-[44px] _hover rounded-full ${
                    i > 0 && "-ml-5 hover:ml-0"
                  }`}
                  cvID={el?.datas?.cvWorker}
                  key={v4()}
                />
              ))}
            </>
          ),
          url: `#section1`,
        },
        {
          title: "Social",
          description: (
            <>
              <Icon icon={icsystem.social} className=" mr-2" />
              {state?.mission?.datas?.pubs?.length || 0}
            </>
          ),
          url: `#section1`,
        },
        {
          title: "Escrow",

          description: (
            <>
              <Icon icon={icsystem.escrow} className=" mr-2" />
              {state?.mission?.datas?.disputes || 0}
            </>
          ),
          url: `#section1`,
        },
        {
          title: "Notifications",

          description: <>to do</>,
          url: `#section1`,
        },
      ]}
      menus={
        loading
          ? []
          : [
              { icon: icfy.ux.admin, title: "Profile", url: "#section1" },
              { icon: icfy.ux.admin, title: "Agendas", url: "#section2" },
              { icon: icfy.ux.admin, title: "Features", url: "#section3" },
              { icon: icfy.ux.admin, title: "Pubs", url: "#section4" },
            ]
      }
      target={"mission"}
    >
      <div className=" w-full relative">
        {/* <Viewport
            img={tools?.state?.mission?.metadatas?.attributes?.[0]?.banniere}
            id={"home"}
            full={true}
            index={null}
          > */}

        {/* */}
        {
          [
            <div className=""></div>,
            <MissionProfile />,
            <AgendasMission />,
            <MissionFeatures index={tools?.state?.front?.props} />,
            <MissionPubs />,
          ]?.[pointer]
        }
        {/* 
          
         

          <div className="fixed z-100 bottom-20   flex flex-col items-end h-fit right-10">
            <CreatePub
              style={" bottom-20 btn c2 btn-xs btn-outline flex h-fit mb-2 "}
              missionID={missionID}
              btn={<Icon icon={icfy?.msg?.chat} className="text-2xl m-4" />}
            />
            <div className="flex  mt-2">
              {tools?.state?.features?.[tools?.index]?.datas?.cvWorker == 0 &&
                tools?.pointer == 2 &&
                tools?.state?.features?.[tools?.index]?.datas?.owner != cv && (
                  <MyFModal
                    btns={{ btn: "Join feature", submit: "Confirm" }}
                    submit={() =>
                      askToJoin(
                        tools?.state?.features?.[tools?.index]?.featureID
                      )
                    }
                    styles={{ btn: "btn btn-xs c2 btn-outline " }}
                  >
                    <div className="min-h-[20vh]">
                      <p className="text-xs">
                        Êtes-vous sûre de vouloir demander à travailler pour
                        <span className="text-success">
                          {
                            tools?.state?.features?.[tools?.index]?.metadatas
                              ?.title
                          }
                          ?{" "}
                        </span>
                      </p>
                      <div className="flex flex-col">
                        <span className="text-white/60  text-[10px]">
                          Si l'owner accepte votre proposition, vous serez
                          désigner automatiquement comme le worker.
                        </span>
                        <span className="text-white/60  text-[10px]">
                          Please be sure to be available for this task.
                        </span>
                      </div>
                    </div>
                  </MyFModal>
                )}

              {tools?.state?.mission?.datas?.status === 0 &&
                tools?.state?.owner?.cvID == cv && (
                  <MyFModal
                    submit={closeMission}
                    styles={{ btn: "btn btn-xs ml-4 btn-error" }}
                    btns={{ btn: "Close Mission", submit: "Valider" }}
                  >
                    <div className="min-h-[20vh]">
                      <p className="text-xs">
                        Êtes-vous sûre de vouloir{" "}
                        <span className="text-error">fermer la mission ? </span>
                      </p>
                      <div className="flex flex-col">
                        <span className="text-white/60  text-[10px]">
                          Si vous accepter, cette mission ne pourras plus créer
                          de nouvelles features.
                        </span>
                        <span className="text-white/60  text-[10px]">
                          Les features en cours convervent leurs modalités et
                          peuvent aller jusqu'à leurs termes.
                        </span>
                      </div>
                    </div>
                  </MyFModal>
                )}

              {tools?.state?.mission?.datas?.status === 0 &&
                tools?.state?.owner?.cvID == cv && (
                  <Link
                    href={"/create/feature"}
                    className="btn btn-xs c2 ml-4 "
                  >
                    Create feature
                  </Link>
                )}
            </div>
          </div> */}
      </div>
    </MyLayoutDashboard>
  );
}

export default App;
