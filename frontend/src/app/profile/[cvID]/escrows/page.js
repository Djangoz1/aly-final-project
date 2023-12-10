"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
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
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyTable } from "components/myComponents/table/MyTable";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { CVName } from "components/links/CVName";
import {
  HEAD_table_arbitrators,
  _table_arbitrators,
} from "utils/states/tables/escrow";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.launchpads && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.launchpads.length; index++) {
        const element = state?.launchpads[index];

        amount += parseFloat(element?.datas?.wadge);
      }

      setIsAmount(amount);
    }
  }, [state?.launchpads]);

  //   let isTable = {
  //     btn: "Missions",
  //     table:,
  //     head: ,
  //     setState: stateMission,

  //     // btns: MENUS_EDIT.mission,
  //   };
  console.log(state);
  let dispatch = useToolsDispatch();
  let [selectedID, setSelectedID] = useState(null);
  let colors = [
    "primary",
    "secondary",
    "info",
    "success",
    "error",
    "accent",
    "warning",
  ];
  return (
    <LayoutProfile
      controller={"arbitrators"}
      cvID={cvID}
      target={"profile"}
      url={"/escrows"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyCard template={1} styles={"h-full  rounded-t-none w-full "}>
          <div
            ref={ref}
            className="w-full h-full rounded-lg py-20 shadow backdrop-blur "
          >
            <MyTable
              list={_table_arbitrators(state?.arbitrators)}
              head={HEAD_table_arbitrators}

              // btns={infos?.[state?.indexOverview]?.btns}
              // editBtns={infos?.[state?.indexOverview]?.editBtns}
            />
          </div>
        </MyCard>
        <div className="flex w-full">
          <MyScrolledXDiv>
            <>
              <MyFramerModal
                style={
                  "on_hover my-3 min-w-[430px] flex flex-col h-[150px] p-2 mr-2 bg-white/5  "
                }
                arr={state?.jobs?.map((el) => (
                  <>
                    <h6 className="font-light text-sm ">
                      {el?.metadatas?.title}
                    </h6>
                    <div className="flex mb-3 items-center">
                      <Icon icon={icsystem.feature} className="text-lg mr-2" />
                      <MySub>
                        <CVName cvID={el?.datas?.cvWorker} />
                      </MySub>
                      <Icon
                        icon={icfy.bank.dollars}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.wadge} />
                      <Icon
                        icon={icfy.person.team}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.workers} />
                    </div>
                    <div className="grid mt-3 grid-cols-5 gap-2 items-center">
                      <div
                        className={
                          "badge badge-" + colors[el?.metadatas?.domain]
                        }
                      >
                        {ENUMS.domain[el?.metadatas?.domain]?.name}
                      </div>
                      <div className="badge super-btn">
                        {ENUMS.courts[el?.datas?.specification]?.court}
                      </div>
                      {JSON.parse(el?.metadatas?.skills)?.map((skill, i) => (
                        <div
                          key={v4()}
                          className={"badge badge-" + colors?.[i]}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>

                    <div className="flex mt-auto w-full items-center">
                      {el?.datas?.launchpad > 0 ? (
                        <MyMainBtn
                          template={2}
                          style={"text-xs"}
                          icon={icsystem.launchpad}
                        >
                          Launchpad
                        </MyMainBtn>
                      ) : (
                        <></>
                      )}
                      <MyStatus
                        status={el?.datas?.status}
                        style={" w-full text-xs"}
                        target={"dispute"}
                      />
                    </div>
                  </>
                ))}
                selectedId={selectedID}
                setSelectedId={setSelectedID}
              >
                <div className="w-full h-full ">
                  <FeatureDispute disputeID={state?.disputes?.[selectedID]} />
                </div>
              </MyFramerModal>
            </>
          </MyScrolledXDiv>
          <div className="bg-zinc-900 flex items-center p-4 ">
            <Icon icon={icfyETHER} className="text-[64px]" />
            <div className="flex flex-col">
              <MyNum style={"text-xl"} num={isAmount} />
              <MySub size={8}>Total received</MySub>
            </div>
          </div>
        </div>
      </div>

      {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
    </LayoutProfile>
  );
}

export default App;
