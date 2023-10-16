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
import { icfy, icfyETHER } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";
import { STATUS } from "constants/status";

import { AgendasMission } from "sections/works/Missions/state/AgendasMission";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MissionPubs } from "sections/works/Missions/state/MissionPubs";
import { Viewport } from "components/myComponents/layout/MyViewport";
import { AssetProfile, AssetProfile1 } from "components/assets/AssetProfile";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import Link from "next/link";
import { MyMenusDropdown } from "components/myComponents/menu/MyMenus";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();

  let [isState, setIsState] = useState(null);

  const missionID = params.missionID;
  let dispatch = useToolsDispatch();
  let fetch = async () => {
    let _state = await doStateMissionTools(dispatch, parseInt(missionID));
    setIsState(_state);
  };
  useEffect(() => {
    if (!isState) {
      fetch();
      console.log("Origine !!! fetch mission state", isState);
    }
  }, [missionID]);

  let [isLoading, setIsLoading] = useState(false);

  let closeMission = async () => {
    setIsLoading(true);
    await _apiPost("closeMission", [parseInt(missionID)]);
    await doStateMissionTools(dispatch, parseInt(missionID));
    setIsLoading(false);
  };

  let askToJoin = async (featureID) => {
    setIsLoading(true);

    await _apiPost("askToJoin", [parseInt(featureID)]);
    await doStateMissionTools(dispatch, parseInt(featureID));

    setIsLoading(false);
  };

  return (
    <MyLayoutApp
      notLoad={true}
      particles={true}
      id={missionID}
      url={`/works/mission/${missionID}`}
      ownerProfile={
        <AssetProfile1
          style={"w-full"}
          noBtn={true}
          cvID={isState?.mission?.datas?.owner}
          target={"owner"}
        />
      }
      side={
        <>
          {/* <div className="flex flex-col  ml-auto w-full  justify-end">
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
                <span>{tools?.state?.mission?.datas?.amount.toFixed(5)}</span>
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
                icon={
                  STATUS?.mission[tools?.state?.mission?.datas?.status]?.icon
                }
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
          </div> */}
        </>
      }
      subMenus={[
        { title: "Profile", tag: "profile" },
        { title: "Agendas", tag: "agendas" },
        { title: "Features", tag: "features" },
        { title: "Pubs", tag: "pubs" },
      ]}
      target={"mission"}
    >
      <Viewport id={"profile"} index={0}>
        <MissionProfile />
      </Viewport>
      <Viewport id={"agendas"} index={1}>
        <AgendasMission />
      </Viewport>
      <Viewport side={<MyMenusDropdown />} id={"features"} index={2}>
        <MissionFeatures />
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
                  askToJoin(tools?.state?.features?.[tools?.index]?.featureID)
                }
                styles={{ btn: "btn btn-xs c2 btn-outline " }}
              >
                <div className="min-h-[20vh]">
                  <p className="text-xs">
                    Êtes-vous sûre de vouloir demander à travailler pour
                    <span className="text-success">
                      {tools?.state?.features?.[tools?.index]?.metadatas?.title}
                      ?{" "}
                    </span>
                  </p>
                  <div className="flex flex-col">
                    <span className="text-white/60  text-[10px]">
                      Si l'owner accepte votre proposition, vous serez désigner
                      automatiquement comme le worker.
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
                      Si vous accepter, cette mission ne pourras plus créer de
                      nouvelles features.
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
              <Link href={"/create/feature"} className="btn btn-xs c2 ml-4 ">
                Create feature
              </Link>
            )}
        </div>
      </div>
    </MyLayoutApp>
  );
}

export default App;
