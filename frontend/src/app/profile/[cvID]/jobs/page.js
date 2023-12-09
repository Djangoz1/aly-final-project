"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

// import {
//   HEAD_table_features,
//   // _table_features,
// } from "utils/states/tables/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MyTable } from "components/myComponents/table/MyTable";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { MyBadge } from "components/myComponents/box/MyList";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.jobs && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.jobs.length; index++) {
        const element = state?.jobs[index];

        amount += parseFloat(element?.datas?.wadge);
      }

      setIsAmount(amount);
    }
  }, [state?.jobs]);

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
      controller={"jobs"}
      cvID={cvID}
      target={"profile"}
      url={"/jobs"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyCard template={1} styles={"h-full  rounded-t-none w-full "}>
          <div
            ref={ref}
            className="w-full h-full rounded-lg py-20 shadow backdrop-blur "
          >
            {/* <MyTable
              list={_table_features(state?.jobs)}
              head={HEAD_table_features}

              // btns={infos?.[state?.indexOverview]?.btns}
              // editBtns={infos?.[state?.indexOverview]?.editBtns}
            /> */}
          </div>
        </MyCard>
        <div className="flex relative w-full">
          <MyScrolledXDiv style={" gap-4  pr-[400px]   "}>
            <>
              {state?.jobs?.map((el) => (
                <MyCardDropdown
                  style={"min-w-fit  h-fit "}
                  key={v4()}
                  header={
                    <>
                      <Icon icon={icfy.ux.admin} className="text-lg mr-2 c4" />
                      <MySub style={"flex items-center gap-1"} size={"8"}>
                        <CVName cvID={el?.datas?.owner} />
                      </MySub>
                      <Icon
                        icon={icfy.bank.dollars}
                        className="text-lg ml-4 mr-2 c4"
                      />
                      <MySub style={"flex items-center gap-1"} size={"8"}>
                        <MyNum num={el?.datas?.wadge} />
                        <span className="c4"> ETH</span>
                      </MySub>
                    </>
                  }
                  footer={
                    <>
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
                        padding={"px-2 py-1 "}
                        style={" w-full text-[9px]"}
                        target={"feature"}
                      />
                    </>
                  }
                  title={el?.metadatas?.title}
                >
                  <MyCardInfos
                    style={"min-w-[400px] w-full"}
                    template={5}
                    arr={[
                      {
                        title: "Domain",
                        icon: ENUMS.domain[el?.metadatas?.domain]?.icon,
                        value: (
                          <MyBadge>
                            {ENUMS.domain[el?.metadatas?.domain]?.name}
                          </MyBadge>
                        ),
                      },
                      {
                        title: "Specification",

                        icon: ENUMS.courts[el?.datas?.specification]?.badge,
                        value: (
                          <MyBadge style={"super-btn"}>
                            {ENUMS.courts[el?.datas?.specification]?.court}
                          </MyBadge>
                        ),
                      },
                      {
                        title: "Skills",

                        value: (
                          <div className="flex flex-wrap gap-2 w-full">
                            {el?.metadatas?.skills?.map((skill, i) => (
                              <MyBadge color={i} key={v4()}>
                                {skill}
                              </MyBadge>
                            ))}
                          </div>
                        ),
                      },
                      {
                        title: "Description",

                        value: (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `
                                  ${
                                    el?.metadatas?.abstract
                                      ? `${el?.metadatas?.abstract} <br/>`
                                      : ""
                                  }

                                  ${el?.metadatas?.description}
`,
                            }}
                            className="flex flex-wrap gap-2 w-full"
                          ></div>
                        ),
                      },
                    ]}
                  />
                </MyCardDropdown>
              ))}
            </>
          </MyScrolledXDiv>
          <div className="backdrop-blur-2xl gap-2 flex-col absolute right-0 top-0 h-full flex items-start p-4 pl-1 ">
            <div className="flex items-center pl-2 border-4 gap-2 border-l-white/5 border-white/0 ">
              <Icon icon={icfyETHER} className="text-[24px]" />
              <div className="flex flex-col ">
                <MyNum style={"text-xs"} num={isAmount}>
                  {" "}
                  ETH
                </MyNum>
                <MySub size={8}>Total depense</MySub>
              </div>
            </div>
            <div className="flex items-center pl-2 border-4 gap-2  border-l-white/5 border-white/0 ">
              <Icon icon={icsystem.feature} className="text-[24px]" />
              <div className="flex flex-col ">
                <MyNum style={"text-xs"} num={state?.jobs?.length}></MyNum>
                <MySub size={8}>Total job(s)</MySub>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
    </LayoutProfile>
  );
}

export default App;
