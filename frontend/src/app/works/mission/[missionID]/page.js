"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";

import {
  Avatar,
  AvatarsList,
  ProfileAvatar,
} from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyCODE,
  icfyETHER,
  icfyMAIL,
  icfySEND,
  icsystem,
} from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { MySub } from "components/myComponents/text/MySub";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { controllers } from "utils/controllers";
import { ImagePin } from "components/Image/ImagePin";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyChart } from "components/myComponents/box/MyChart";
import { MyModal } from "components/myComponents/modal/MyModal";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;

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
        lists.push({
          metadatas: {
            username: worker?.metadatas?.username,
            id: worker?.metadatas?.id,
            avatar: worker?.metadatas?.avatar,
            ["@collectionName"]: "accounts",
          },
          designation: ENUMS.courts?.[element?.specification]?.court,
        });
      }
      setIsWorkers(lists);
    })();
  }, [state?.mission?.details?.features]);

  return (
    <LayoutMission controller={"overview"} missionID={missionID} url={"/"}>
      <MyLayoutHeader
        style={"mb-7"}
        target={"mission"}
        bio={state?.owner?.metadatas?.description}
        statusObj={{ current: state?.mission?.datas?.status }}
        banniere={state?.mission?.metadatas?.banniere}
        cvID={state?.owner?.cvID}
        metadatas={state?.mission?.metadatas}
        image={state?.mission?.metadatas?.image}
        username={state?.owner?.metadatas?.username}

        // username={state?.owner?.metadatas?.username}
      ></MyLayoutHeader>
      <div className="flex flex-col-reverse">
        <div className="w-full -z-1 mb-2 flex">
          <MyCardInfos
            style={"w-[44%] rounded-t-none mr-[1px]"}
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
              },
              {
                title: "Features",
                num: state?.mission?.datas?.features?.length,
              },
              {
                title: "Work slot",
                num:
                  state?.mission?.datas?.features?.length -
                    state?.mission?.datas?.workers || 0,
              },
              {
                title: "Disputes",
                num: state?.mission?.datas?.disputes || 0,
              },

              {
                title: "Total wadge",
                value: (
                  <>
                    <p className="flex items-center">
                      <Icon
                        icon={icfyETHER}
                        className="text-white text-lg mr-1  "
                      />
                      <span>{state?.mission?.datas?.amount.toFixed(5)}</span>
                      <span className="text-white c2  ml-1">ETH</span>
                    </p>
                  </>
                ),
              },
              {
                title: "Posts",
                num: state?.mission?.pubs?.length,
              },
              {
                title: "Followers",
                num: state?.mission?.details?.social?.followers?.length,
              },
              {
                title: "Domain",
                value: (
                  <p className="flex items-center  capitalize">
                    <Icon
                      className={`mr-2 text-2xl text-${
                        ENUMS.domain[state?.mission?.metadatas?.domain]?.color
                      }`}
                      icon={
                        ENUMS.domain[state?.mission?.metadatas?.domain]?.icon
                      }
                    />
                    {ENUMS.domain[state?.mission?.metadatas?.domain]?.name}
                  </p>
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
          <div className="px-4 w-[50%]">
            <MySub style={"mt-5 mb-2 hover:text-white c4"}>
              Presented {state?.mission?.metadatas?.title}
            </MySub>
            <article className="text-white/80 font-ligt whitespace-break-spaces text-[10px] mb-10">
              {state?.mission?.metadatas?.abstract}
              <br />
              <br />
              <br />
              {state?.mission?.metadatas?.description}
            </article>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center  -translate-y-1/2  w-full gap-3">
          {/* <Avatar metadatas={}/> */}
          <div className="ml-auto mr-5 ">
            <AvatarsList lists={isWorkers} />
          </div>
          <MyCard
            template={0}
            styles={"w-fit  flex flex-col px-1 py-2  items-center gap-1 h-fit"}
          >
            <Icon icon={icfy.person.friend} className="text-2xl" />
            <MySub style={"c4"}>Follower(s)</MySub>
            <MyNum num={state?.mission?.details?.social?.followers?.length} />
          </MyCard>
          <MyCard
            template={0}
            styles={"w-fit  flex flex-col px-1 py-2  items-center gap-1 h-fit"}
          >
            <Icon icon={icfyCODE} className="text-2xl" />
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
          </MyCard>

          <MyCard
            template={0}
            styles={"w-fit  flex flex-col px-1 py-2  items-center gap-1 h-fit"}
          >
            <Icon icon={icfy.court.hammer} className="text-2xl" />
            <MySub style={"c4"}>Disputes</MySub>
            <div className="flex c4 text-xs  items-center">
              <MyNum
                style={"c3 mr-2 text-sm"}
                num={state?.mission?.datas?.disputes?.length || 0}
              />
            </div>
          </MyCard>
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
