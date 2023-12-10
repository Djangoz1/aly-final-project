"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsState } from "context/tools";

import { _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";

import { Avatar, AvatarsList } from "components/profile/ProfileAvatar";

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
import { CVName } from "components/links/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { controllers } from "utils/controllers";

import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyChart } from "components/myComponents/box/MyChart";
import { MyModal } from "components/myComponents/modal/MyModal";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;
  // ! TO DO SECURE HTML

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
      <div className="flex ">
        <div className="w-full -z-1 border-t border-r border-white/5 flex flex-col">
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
            <article className="flex flex-col gap-4">
              {state?.features?.map((element) => (
                <MyCardInfos
                  arr={[
                    {
                      title: element?.metadatas?.title,
                      value: (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: (() => {
                              return `${element?.metadatas?.abstract}<br/>${element?.metadatas?.description}`;
                            })(),
                          }}
                          className="font-ligt whitespace-break-spaces text-[10px] "
                        />
                      ),
                    },
                    {
                      title: "Badges",
                      value: (
                        <div className="flex flex-wrap gap-2 w-2/3">
                          {element?.metadatas?.skills?.map((el, i) => (
                            <MyBadge
                              key={v4()}
                              color={i}
                              style={"text-[9px] h-fit"}
                            >
                              {el}
                            </MyBadge>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                  style={"w-full  "}
                  className=" hover:opacity-100 opacity-50 c3 flex flex-col"
                  key={v4()}
                ></MyCardInfos>
              ))}
            </article>
          </div>
        </div>
        <MyLayoutDetails
          btns={[
            {
              btn: (
                <>
                  <Icon icon={icfy.ux.experiment} className="text-lg" />{" "}
                  Statistics features{" "}
                  <Icon
                    icon={icfy.ux.arrow}
                    className="rotate-90 ml-auto text-lg "
                  />
                </>
              ),
              modal: (
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
              ),
            },
          ]}
          arr={[
            {
              icon: ENUMS.domain[state?.mission?.metadatas?.domain]?.icon,
              title: "Domain",
              value: ENUMS.domain[state?.mission?.metadatas?.domain]?.name,
            },
            {
              icon: icfyETHER,
              title: "Dépenses restantes",
              num: state?.mission?.datas?.amount,
              value: <span className="text-[8px]">ETH</span>,
            },
            {
              icon: icsystem.feature,
              title: "Features",
              num: state?.features?.length,
            },
            {
              icon: icsystem.feature,
              title: "Work slot(s)",
              num: state?.features?.length - state?.mission?.datas?.workers,
            },
            state?.mission?.datas?.disputes?.length && {
              icon: icsystem.escrow,
              title: "Dispute(s)",
              num: state?.mission?.datas?.disputes?.length,
            },
            state?.mission?.datas?.launchpad > 0 && {
              icon: icsystem.launchpad,
              title: "Launchpad",
              value: "To do launchpad name",
            },
            {
              icon: icfy.person.friend,
              title: "Follower(s)",
              num: state?.mission?.details?.social?.followers?.length,
            },
            {
              icon: icfy.msg.post,
              title: "Post(s)",
              num: state?.pubs?.length,
            },
          ]}
          objStatus={{
            target: "mission",
            status: state?.mission?.datas?.status,
          }}
          footers={[
            {
              title: "Technology",
              value: (
                <div className="grid gap-2 grid-cols-5">
                  {state?.mission?.details?.badges?.map((el) => (
                    <Icon
                      key={v4()}
                      icon={ENUMS.courts?.[el]?.badge}
                      className="text-white c2 text-[24px] "
                    />
                  ))}
                </div>
              ),
            },
            {
              title: "Owner",
              value: (
                <Avatar
                  metadatas={state?.owner?.metadatas}
                  designation={true}
                />
              ),
            },
            {
              title: "Worker(s)",
              value: (
                <div className="flex flex-row items-center justify-center  mb-10 w-full">
                  {state?.features
                    ?.filter(
                      (el, index, self) =>
                        index ===
                        self.findIndex(
                          (o) => o.datas?.cvWorker == el?.datas?.cvWorker
                        )
                    )

                    ?.map((el) => (
                      <Avatar
                        designation={true}
                        style={"-mr-4  group"}
                        key={v4()}
                        _cvID={el?.datas?.cvWorker}
                      />
                    ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </LayoutMission>
  );
}

export default App;
