"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { MyCardInfos } from "components/myComponents/card/MyCard";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.features && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.features.length; index++) {
        const element = state?.features[index];

        amount += parseFloat(element?.datas?.wadge);
      }

      setIsAmount(amount);
    }
  }, [state?.features]);

  console.log("state", state);
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
      controller={"features"}
      cvID={cvID}
      target={"profile"}
      url={"/features"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyList
          head={["Date", "Court", "Mission", "Worker", "Status", "Amount"]}
          arr={state?.features?.map((el) => [
            el?.metadatas?.created,
            <MyBadge color={1}>
              <Icon icon={ENUMS.courts?.[el?.datas?.specification]?.badge} />
              {ENUMS.courts?.[el?.datas?.specification]?.court}
            </MyBadge>,
            el?.metadatas?.title,
            <CVName cvID={el?.datas?.cvWorker} />,
            <MyStatus status={el?.datas?.status} target={"feature"} />,
            <MyBadge>{el?.datas?.wadge} ETH</MyBadge>,
          ])}
        />
        <div className="flex relative  w-full">
          <MyScrolledXDiv style={" gap-4 pr-[400px] "}>
            <>
              {state?.features?.map((el) => (
                <MyCardDropdown
                  style={"h-fit min-w-fit"}
                  key={v4()}
                  header={
                    <>
                      <Icon
                        icon={icsystem.feature}
                        className="c4 text-lg mr-2"
                      />
                      <MySub size={"8"}>
                        <CVName cvID={el?.datas?.cvWorker} />
                      </MySub>
                      <Icon
                        icon={icfy.bank.dollars}
                        className="c4 text-lg ml-4 mr-2"
                      />
                      <MySub style={"flex gap-1 items-start"} size={"9"}>
                        <MyNum num={el?.datas?.wadge} />
                        <span className="c4">ETH</span>
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
                        padding={"px-2 py-1 "}
                        status={el?.datas?.status}
                        style={" w-full text-xs"}
                        target={"feature"}
                      />
                    </>
                  }
                  title={el?.metadatas?.title}
                >
                  <MyCardInfos
                    style={"w-full min-w-[500px]"}
                    template={5}
                    arr={[
                      {
                        title: "Domain",
                        icon: ENUMS.domain[el?.metadatas?.domain]?.icon,
                        value: (
                          <MyBadge
                            style={
                              "text-xs text-center justify-center font-light"
                            }
                            color={el?.metadatas?.domain}
                          >
                            {ENUMS.domain[el?.metadatas?.domain]?.name}
                          </MyBadge>
                        ),
                      },
                      {
                        title: "Specification",
                        icon: ENUMS.courts[el?.datas?.specification]?.badge,
                        value: (
                          <MyBadge color={1} style="  text-xs">
                            {ENUMS.courts[el?.datas?.specification]?.court}
                          </MyBadge>
                        ),
                      },
                      {
                        title: "Skills",
                        value: (
                          <div className="flex gap-2 w-2/3 flex-wrap">
                            {el?.metadatas?.skills?.map((skill, i) => (
                              <MyBadge
                                style={
                                  "min-w-[100px] overflow-hidden transition hover:min-w-fit  text-[8px]"
                                }
                                color={i}
                                key={v4()}
                              >
                                {skill}
                              </MyBadge>
                            ))}
                          </div>
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
                <MyNum style={"text-xs"} num={state?.features?.length}></MyNum>
                <MySub size={8}>Total feature(s)</MySub>
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
