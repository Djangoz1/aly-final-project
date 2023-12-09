"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";

import { AvatarsList } from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";

import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { MySub } from "components/myComponents/text/MySub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { controllers } from "utils/controllers";

import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyChart } from "components/myComponents/box/MyChart";
import { MyModal } from "components/myComponents/modal/MyModal";
import { MyTitle } from "components/myComponents/text/MyTitle";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;
  // ! TO DO SECURE HTML
  let dispatch = useToolsDispatch();
  let [isDatas, setIsDatas] = useState(null);
  let [isWorkers, setIsWorkers] = useState(null);
  useEffect(() => {
    (async () => {
      let lists = [];
      for (
        let index = 0;
        index < state?.mission?.details?.features.length;
        index++
      ) {
        const element = state?.mission?.details?.features[index];
        let worker = await controllers.get.profile.item({
          cvID: element?.cvWorker,
        });
        if (!lists.map((el) => el?.metadatas?.id).includes(worker.metadatas.id))
          lists.push({
            metadatas: {
              username: worker?.metadatas?.username,
              id: worker?.metadatas?.id,
              avatar: worker?.metadatas?.avatar,
              ["@collectionId"]: worker?.metadatas?.["@collectionId"],
            },
            designation: ENUMS.courts?.[element?.specification]?.court,
          });
      }
      setIsWorkers(lists);
    })();
  }, [state?.mission?.details?.features]);

  return (
    <LayoutMission controller={"overview"} missionID={missionID} url={"/"}>
      <div className="flex flex-col-reverse">
        <div className="w-full -z-1 mb-2 flex flex-col">
          <MySub style={"mt-5 mb-2 hover:text-white px-4 c4"}>
            Presented {state?.mission?.metadatas?.title}
          </MySub>
          <div className="flex  my-3 px-4 ">
            <MyTitle style=" text-[8px] c4 min-w-[15%]">Abstract</MyTitle>
            <article className="hover:text-white/80 c4 font-ligt whitespace-break-spaces text-[10px] ">
              {state?.mission?.metadatas?.abstract || (
                <span className="text-warning">
                  <Icon icon={icfy.ux.warning} /> Please provide an abstract
                  description for a better referencing
                </span>
              )}
            </article>
          </div>
          <div className="flex  my-3 px-4 ">
            <MyTitle style=" text-[8px] c4 min-w-[15%]">Description</MyTitle>

            {/* ! TO DO : secure parse html*/}
            <article
              dangerouslySetInnerHTML={{
                __html: state?.mission?.metadatas?.description,
              }}
              className="hover:text-white/80 c4 font-ligt whitespace-break-spaces text-[10px] "
            />
          </div>
          <div className="flex  my-3 px-4 ">
            <MyTitle style=" text-[8px] c4 min-w-[15%]">Features</MyTitle>

            {/* ! TO DO : secure parse html*/}
            <article
              dangerouslySetInnerHTML={{
                __html: (() => {
                  let descriptions = "";
                  for (
                    let index = 0;
                    index < state?.features?.length;
                    index++
                  ) {
                    const element = state?.features[index];
                    descriptions += `<b>${element?.metadatas?.title}</b><br/>${element?.metadatas?.abstract}<br/>${element?.metadatas?.description}<br/><br/>`;
                  }
                  return descriptions;
                })(),
              }}
              className="hover:text-white/80 c4 font-ligt whitespace-break-spaces text-[10px] "
            />
          </div>
          <div className="flex  my-3 px-4 ">
            <MyTitle style=" text-[8px] c4 min-w-[15%]">Informations</MyTitle>
            <MyCardInfos
              style={"w-full rounded-t-none "}
              arr={[
                {
                  title: "Status",
                  value: (
                    <MyStatus
                      status={state?.mission?.datas?.status}
                      target={"mission"}
                      padding={"px-2 py-1"}
                    />
                  ),
                  icon: icfy.ux.workflow,
                },
                {
                  icon: icsystem.feature,
                  title: "Features",
                  num: state?.mission?.datas?.features?.length,
                },
                {
                  icon: icfy.person.team,
                  title: "Work slot",
                  num:
                    state?.mission?.datas?.features?.length -
                      state?.mission?.datas?.workers || 0,
                },
                {
                  icon: icsystem.escrow,
                  title: "Disputes",
                  num: state?.mission?.datas?.disputes || 0,
                },

                {
                  icon: icfyETHER,
                  title: "Total wadge",
                  value: (
                    <>
                      <MyNum
                        style={"items-center "}
                        num={state?.mission?.datas?.amount}
                      >
                        <span className="text-white c2 ml-1">ETH</span>
                      </MyNum>
                    </>
                  ),
                },

                {
                  icon: ENUMS.domain[state?.mission?.metadatas?.domain]?.icon,
                  title: "Domain",
                  value: (
                    <MyBadge
                      color={state?.mission?.metadatas?.domain}
                      style={"capitalize"}
                    >
                      {ENUMS.domain[state?.mission?.metadatas?.domain]?.name}
                    </MyBadge>
                  ),
                },

                {
                  title: "Technology",
                  value: (
                    <div className="w-full flex overflow-x-scroll h-full hide-scrollbar">
                      {state?.mission?.details?.badges?.map((el) => (
                        <Icon
                          key={v4()}
                          icon={ENUMS.courts?.[el]?.badge}
                          className="text-white c2 text-[24px] mr-4"
                        />
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="flex  my-3 px-4 ">
            <MyTitle style=" text-[8px] c4 min-w-[15%]">Social</MyTitle>
            <MyCardInfos
              style={"w-full rounded-t-none "}
              arr={[
                {
                  title: "Posts",
                  num: state?.pubs?.length,
                },
                {
                  title: "Followers",
                  num: state?.mission?.details?.social?.followers?.length,
                },
                {
                  title: "Likes",
                  value: "TO DO",
                },
              ]}
            />
          </div>
        </div>
        <div className="flex relative  flex-row-reverse justify-end items-center    w-full gap-3">
          {/* <Avatar metadatas={}/> */}
          <div className=" mr-5 h-fit translate-y-full absolute right-0 bottom-0">
            <AvatarsList lists={isWorkers} />
          </div>
          <MyBadge
            color={1}
            styles={"w-fit  flex flex-col px-1 py-2  items-center gap-1 h-fit"}
          >
            <MySub style={"c4"}>Follower(s) </MySub>
            <MyNum num={state?.mission?.details?.social?.followers?.length} />
          </MyBadge>
          <MyBadge
            color={1}
            styles={"w-fit  flex flex-col px-1 py-2  items-center gap-1 h-fit"}
          >
            <MySub style={"c4"}>Worker(s)</MySub>
            <div className="flex items-center">
              <MyNum num={state?.mission?.datas?.workers} />
              {state?.mission?.datas?.workers > 0 && (
                <>
                  {" "}
                  / <MyNum num={state?.mission?.datas?.features?.length} />
                </>
              )}
            </div>
          </MyBadge>

          {state?.mission?.datas?.disputes?.length && (
            <MyBadge color={0}>
              <MySub style={"c4"}>Disputes </MySub>
              <MyNum
                style={"ml-1 text-sm"}
                num={state?.mission?.datas?.disputes?.length || 0}
              />
            </MyBadge>
          )}
          {state?.mission?.datas?.launchpad > 0 ? (
            <MyCard
              template={0}
              styles={
                "w-fit  flex flex-col px-1 py-2  super-btn items-center gap-1 h-fit"
              }
            >
              <Icon icon={icsystem.launchpad} className="text-4xl" />
              <MySub style={"c4"}>Launchpad name</MySub>
            </MyCard>
          ) : (
            <></>
          )}

          <MyModal
            id={v4()}
            style={
              "fixed z-100 backdrop-blur-xl bg-black/30  left-4    bg-zinc-950 flex justify-center w-fit max-w-full top-0 "
            }
            btn={
              <MyChart
                style={"w-full bg-black cursor-pointer h-fit "}
                price={state?.mission?.datas?.amount}
              />
            }
          >
            <MyList
              description={"All recent payment to workers"}
              arr={state?.features?.map((el) => [
                el?.metadatas?.created,
                <CVName cvID={el?.datas?.cvWorker} />,
                el?.metadatas?.title,
                ENUMS.domain?.[el?.metadatas?.domain]?.name,
                <MyBadge>-{el?.datas?.wadge} ETH</MyBadge>,
              ])}
            />
          </MyModal>
        </div>
      </div>
    </LayoutMission>
  );
}

export default App;
