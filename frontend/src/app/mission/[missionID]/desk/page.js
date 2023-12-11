"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  doStateTools,
  doStateToolsMission,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyCODE, icfyETHER, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { CVName } from "components/links/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCounter } from "components/myComponents/MyCountdown";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyModal } from "components/myComponents/modal/MyModal";
import { useRouter } from "next/navigation";
import { MySub } from "components/myComponents/text/MySub";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { MyToDo } from "components/myComponents/form/MyToDo";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { AgendasMission } from "sections/works/Missions/state/AgendasMission";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;
  const [isMenu, setIsMenu] = useState(0);
  let dispatch = useToolsDispatch();
  let router = useRouter();
  return (
    <LayoutMission controller={"agendas"} missionID={missionID} url={"/desk"}>
      <div className="flex flex-col gap-10">
        <div className="flex w-full relative">
          <MyScrolledXDiv style={"pr-[250px] gap-3"}>
            {state?.features?.map((el, i) => (
              <MyCardDropdown
                styleClick={" min-w-[60vw] h-fit "}
                style={" h-fit min-w-fit max-w-[60vw] "}
                key={v4()}
                header={
                  <>
                    <Icon icon={icsystem.feature} className="c4 text-lg mr-2" />
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
                  <div className="w-full gap-2 items-center flex mt-auto">
                    {el?.datas &&
                      el?.datas?.status !== 2 &&
                      el?.datas?.status !== 3 &&
                      (cv == state?.owner?.cvID ||
                        cv == el?.datas?.cvWorker) && (
                        <>
                          <MyMainBtn
                            url={"/create/escrow"}
                            style={"btn-xs"}
                            icon={false}
                            color={3}
                            template={1}
                          >
                            Contest
                          </MyMainBtn>
                        </>
                      )}
                    <MyStatus
                      padding={"px-2 py-1 "}
                      style={"w-full  text-[9px]"}
                      status={
                        el?.datas?.status >= 0
                          ? el?.datas?.status
                          : "notDeployed"
                      }
                      target={el?.datas?.status >= 0 ? "feature" : "_feature"}
                    />
                    {el?.datas &&
                      el?.datas?.status !== 2 &&
                      el?.datas?.status !== 3 &&
                      (cv == state?.owner?.cvID ||
                        cv == el?.datas?.cvWorker) && (
                        <>
                          <MyMainBtn
                            style={"btn-xs"}
                            icon={{ no: true }}
                            color={2}
                            template={1}
                            setter={async () => {
                              await _apiPost("validateFeature", [
                                el?.featureID,
                              ]);
                              doStateToolsMission({
                                dispatch,
                                missionID,
                                target: "features",
                              });
                            }}
                          >
                            Validate
                          </MyMainBtn>
                        </>
                      )}
                    {!el?.datas && (
                      <MyMainBtn
                        _refresh={false}
                        setter={async () => {
                          await doStateTools(dispatch, {
                            allowed: true,
                            form: { feature: el?.metadatas, missionID },
                          });
                          console.log("bah ouais");
                          router.push("/create/feature");
                        }}
                        icon={false}
                        template={1}
                        style={"btn-xs"}
                      >
                        Deployed
                      </MyMainBtn>
                    )}
                  </div>
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
                    {
                      title: "Abstract",
                      value: el?.metadatas?.abstract,
                    },
                    {
                      title: "Description",
                      value: el?.metadatas?.description,
                    },
                  ]}
                />
              </MyCardDropdown>
            ))}
          </MyScrolledXDiv>
          <div className="backdrop-blur-2xl gap-2 flex-col absolute right-0 top-0 h-full flex items-start p-4 pl-1 ">
            <div className="flex items-center pl-2 border-4 gap-2 border-l-white/5 border-white/0 ">
              <Icon icon={icfyETHER} className="text-[24px]" />
              <div className="flex flex-col ">
                <MyNum style={"text-xs"} num={state?.mission?.datas?.amount}>
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

        <MyMenusTabs
          style={" ml-1"}
          value={isMenu}
          template={2}
          color={15}
          setter={setIsMenu}
          arr={["Works", "Agendas"]}
        />
        {
          [
            <>
              <div className="flex flex-row-reverse pb-5 w-full gap-5 justify-end flex-wrap">
                <MyToDo workflow={2} />
                <MyToDo workflow={1} />
                <MyToDo workflow={0} />
              </div>
              <MyList
                title={"List features"}
                description={
                  "All features of " + state?.mission?.metadatas?.title
                }
                withoutBtn={true}
                head={[
                  "Created",
                  "Title",
                  "Court",
                  "Status",
                  "Worker",
                  "Wadge",
                  "",
                ]}
                arr={state?.features?.map((el) => [
                  el?.metadatas?.created,
                  el?.metadatas?.title,
                  ENUMS.courts[el?.datas?.specification]?.court,
                  <MyStatus
                    padding={"px-3 py-1 text-[9px]"}
                    status={
                      el?.datas?.status >= 0 ? el?.datas?.status : "notDeployed"
                    }
                    target={el?.datas?.status >= 0 ? "feature" : "_feature"}
                  />,
                  <CVName cvID={el?.datas?.cvWorker} />,
                  <MyBadge>{el?.datas?.wadge} ETH</MyBadge>,
                  <MyModal
                    id={v4()}
                    btn={
                      <MyMainBtn
                        icon={false}
                        style={"whitespace-nowrap btn-xs ml-auto"}
                        template={1}
                      >
                        View more
                      </MyMainBtn>
                    }
                  >
                    <div className="">
                      {el?.metadatas?.abstract ? (
                        <span className="text-xs c4 font-light mb-1">
                          {el?.metadatas?.abstract}
                        </span>
                      ) : (
                        <></>
                      )}
                      <article className="whitespace-break-spaces text-xs c3 font-light">
                        {el?.metadatas?.description}
                      </article>
                    </div>
                  </MyModal>,
                ])}
              />
            </>,
            <AgendasMission />,
          ]?.[isMenu]
        }
      </div>
    </LayoutMission>
  );
}

export default App;
