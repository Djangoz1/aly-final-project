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
import { Avatar } from "components/profile/ProfileAvatar";
import { CVName } from "components/inputs/inputsCV/CVName";
import { BtnFollow } from "components/btn/BtnsSocial/BtnFollow";
import { MissionMenusDropdown } from "sections/works/Missions/state/MissionMenusDropdown";
import { MyLoader } from "components/myComponents/layout/MyLoader";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();

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

  let closeMission = async () => {
    await _apiPost("closeMission", [parseInt(missionID)]);
    await doStateMissionTools(dispatch, parseInt(missionID));
  };

  let askToJoin = async (featureID) => {
    await _apiPost("askToJoin", [parseInt(featureID)]);
    await doStateMissionTools(dispatch, parseInt(featureID));
  };
  return (
    <MyLayoutApp
      notLoad={true}
      particles={true}
      id={missionID}
      url={`/works/mission/${missionID}`}
      ownerProfile={
        loading ? null : <AssetProfileCard />
        // <AssetProfile1
        //   style={"w-full"}
        //   noBtn={true}
        //   cvID={isState?.mission?.datas?.owner}
        //   target={"owner"}
        // />
      }
      subMenus={
        loading
          ? []
          : [
              { title: "Profile", tag: "profile" },
              { title: "Agendas", tag: "agendas" },
              { title: "Features", tag: "features" },
              { title: "Pubs", tag: "pubs" },
            ]
      }
      target={"mission"}
    >
      {loading ? (
        <Viewport full={true}>
          <div className="w-full h-full items-center justify-center flex">
            <MyLoader />
          </div>
        </Viewport>
      ) : (
        <>
          <Viewport
            img={tools?.state?.mission?.metadatas?.attributes?.[0]?.banniere}
            id={"home"}
            full={true}
            index={null}
          >
            <MyCard styles={"w-fit px-4 py-3  mt-auto "}>
              <h6 className="text-3xl mb-4">
                {tools?.state?.mission?.metadatas?.title}
              </h6>
              <div className="flex items-end mt-7 mb-2 text-3xl">
                <Icon icon={icfyETHER} className="text-6xl w-fit p-0 c2" />
                {tools?.state?.mission?.datas?.amount}
                <span className="c2 text-lg ml-3"> ETH</span>
              </div>
              <div className="flex items-center  ">
                <MyStatus
                  status={tools?.state?.mission?.datas?.status}
                  target={"mission"}
                />
                <div className=" mx-3 flex text-lg items-center">
                  <Icon
                    icon={icfyCODE}
                    className="text-3xl text-secondary mr-2"
                  />
                  {tools?.state?.mission?.datas?.workers}
                  {tools?.state?.mission?.datas?.workers > 0 && (
                    <> / {tools?.state?.mission?.datas?.features?.length}</>
                  )}
                </div>
              </div>
            </MyCard>
          </Viewport>
          <Viewport id={"profile"} index={0}>
            <MissionProfile />
          </Viewport>
          <Viewport id={"agendas"} index={1}>
            <AgendasMission />
          </Viewport>
          <Viewport side={<MissionMenusDropdown />} id={"features"} index={2}>
            <MissionFeatures index={tools?.state?.front?.props} />
          </Viewport>
          <Viewport id={"pubs"} index={3}>
            <MissionPubs />
          </Viewport>

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
          </div>
        </>
      )}
    </MyLayoutApp>
  );
}

export default App;
