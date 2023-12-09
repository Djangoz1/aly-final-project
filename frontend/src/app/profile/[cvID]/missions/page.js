"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { MySub } from "components/myComponents/text/MySub";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { v4 } from "uuid";
import { ENUMS } from "constants/enums";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.missions && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.missions.length; index++) {
        const element = state?.missions[index];
        amount += element?.datas?.amount;
      }

      setIsAmount(amount);
    }
  }, [state?.missions]);

  return (
    <LayoutProfile
      controller={"missions"}
      cvID={cvID}
      target={"profile"}
      url={"/missions"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyList
          title={"Missions"}
          description={"All mission created"}
          arr={state?.missions?.map((el) => [
            el?.metadatas?.created,
            <MissionName id={el?.missionID} metadatas={el?.metadatas} />,
            el?.datas?.workers,
            el?.datas?.features?.length,
            <MyBadge>{el?.datas?.amount} ETH</MyBadge>,
            <MyStatus target={"mission"} status={el?.datas?.status} />,
          ])}
          head={["Date", "Mission", "Workers", "Features", "Amount", "Status"]}

          // btns={infos?.[state?.indexOverview]?.btns}
          // editBtns={infos?.[state?.indexOverview]?.editBtns}
        />
        <div className="flex relative w-full">
          <MyScrolledXDiv style={" gap-4  pr-[400px]   "}>
            <>
              {state?.missions?.map((el, i) => (
                <MyCardDropdown
                  style={"min-w-fit h-fit "}
                  key={v4()}
                  header={
                    <>
                      <Icon
                        icon={icsystem.feature}
                        className="text-lg mr-2 c4"
                      />
                      <MySub style={"flex items-center gap-1"} size={"8"}>
                        <MyNum num={el?.datas?.features?.length} />
                      </MySub>
                      <Icon
                        icon={icfy.bank.dollars}
                        className="text-lg ml-4 mr-2 c4"
                      />
                      <MySub style={"flex items-center gap-1"} size={"8"}>
                        <MyNum num={el?.datas?.amount} />
                        ETH
                      </MySub>
                      <Icon
                        icon={icfy.person.team}
                        className="text-lg ml-4 mr-2 c4"
                      />
                      <MySub style={"flex items-center gap-1"} size={"8"}>
                        <MyNum num={el?.datas?.workers} />
                        Users
                      </MySub>
                    </>
                  }
                  title={
                    <MissionName id={el?.missionID} metadatas={el?.metadatas} />
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
                        style={" w-full text-xs"}
                        target={"mission"}
                      />
                    </>
                  }
                >
                  <MyCardInfos
                    style={"w-fit"}
                    template={5}
                    arr={[
                      {
                        title: "Domain",
                        icon: ENUMS?.domain?.[el?.metadatas?.domain]?.icon,
                        value: (
                          <MyBadge
                            color={el?.metadatas?.domain}
                            style={"items-center gap-2 text-xs"}
                          >
                            {ENUMS?.domain?.[el?.metadatas?.domain]?.name}
                          </MyBadge>
                        ),
                      },

                      {
                        icon: icsystem.escrow,
                        title: "Disputes",
                        num: el?.details?.features?.filter(
                          (feature) => feature?.dispute > 0
                        )?.length,
                      },
                      {
                        icon: icsystem.feature,
                        title: "Features",
                        value: (
                          <div className="flex border border-l-white/5 divide-y divide-white/5 border-white/0 flex-col  min-w-fit  w-full">
                            {el?.details?.features?.map((feature) => (
                              <div
                                key={v4()}
                                className="flex w-full transition py-3  hover:backdrop-blur-xl relative items-center gap-3 "
                              >
                                <MyStatus
                                  style={"text-[9px] -ml-5 font-light"}
                                  padding={"px-2  py-1 "}
                                  target={"feature"}
                                  status={feature?.status}
                                />
                                <MyBadge
                                  color={feature?.specification}
                                  style={"text-[9px] items-center"}
                                >
                                  <Icon
                                    className="text-lg"
                                    icon={
                                      ENUMS.courts[feature?.specification]
                                        ?.badge
                                    }
                                  />
                                  {ENUMS.courts[feature?.specification]?.court}
                                </MyBadge>
                                <MyBadge
                                  color={1}
                                  style={
                                    "overflow-hidden hover:w-fit text-[9px]"
                                  }
                                >
                                  {feature?.title}
                                </MyBadge>
                                {feature?.cvWorker ? (
                                  <CVName
                                    styles={"ml-auto"}
                                    cvID={feature?.cvWorker}
                                  />
                                ) : (
                                  <></>
                                )}
                              </div>
                            ))}
                          </div>
                        ),
                      },
                      {
                        title: "Description",
                        value: (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: el?.metadatas?.description,
                            }}
                            className=" text-[9px] max-w-[500px] font-light   whitespace-break-spaces "
                          ></div>
                        ),
                      },
                    ]}
                  ></MyCardInfos>
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
              <Icon icon={icsystem.mission} className="text-[24px]" />
              <div className="flex flex-col ">
                <MyNum style={"text-xs"} num={state?.missions?.length}></MyNum>
                <MySub size={8}>Total mission(s)</MySub>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutProfile>
  );
}

export default App;
