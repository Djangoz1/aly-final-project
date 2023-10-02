"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
  _table_invites,
} from "utils/ux-tools/table/feature";

import { LayoutMission } from "sections/works/Missions/LayoutMission";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import {
  MyCard,
  MyCard1,
  MyCardList,
} from "components/myComponents/card/MyCard";
import { icfy, icfyETHER } from "icones";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doStateCV } from "context/hub/cv";

import { MyCalendar } from "components/myComponents/MyCalendar";
import { MENUS_EDIT } from "constants/menus";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { useAccount } from "wagmi";
import { ENUMS } from "constants/enums";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { STATUS } from "constants/status";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { fromTimestamp } from "utils/ux-tools";

const Mission = ({ params }) => {
  const missionID = params.missionID;
  let { address } = useAccount();
  const { features, mission, owner } = useMissionState();

  let state = useMissionState();
  let dispatch = useMissionDispatch();
  let dispatchAuth = useAuthDispatch();
  MENUS_EDIT.feature[1].setter = async (id) => {
    await _apiPost("askToJoin", [id]);
    await doStateMission(dispatch, missionID);
    await doAuthCV(dispatchAuth, address);
  };

  console.log(state);
  return (
    <LayoutMission id={missionID}>
      <div className="w-full  flex">
        <div className="w-3/4 mr-12">
          <MyCard1
            color={2}
            menus={["Description", "Features", "Job Invites"]}
            head={{
              component: (
                <div className="flex items-center">
                  <span className="text-white  text-xs flex flex-col items-center mr-3">
                    <Icon icon={icfyETHER} className="text-4xl text-white" />{" "}
                    <Hg>Balance</Hg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-2xl text-white items-center flex ">
                      {state?.mission?.datas?.amount}
                      <Hg style="text-lg ml-2">ETH</Hg>
                    </span>
                    <div
                      className={`badge badge-sm badge-outline py-2 px-4 badge-${
                        STATUS.mission[state?.mission?.datas?.status]?.color
                      }`}
                    >
                      <Icon
                        icon={
                          STATUS.mission[state?.mission?.datas?.status]?.icon
                        }
                        className="mr-4 text-sm"
                      />
                      {STATUS.mission[state?.mission?.datas?.status]?.status}
                    </div>
                  </div>
                </div>
              ),
            }}
            components={[
              <p className="text-xs  text-justify whitespace-break-spaces">
                {state?.mission?.metadatas?.description}
              </p>,
              <MyTable
                list={_table_features(state.features, state.owner)}
                head={HEAD_table_features}
                editBtns={MENUS_EDIT.feature}
              />,
              <MyTable
                list={_table_invites(state.features)}
                head={["Job", "Worker"]}
              />,
            ]}
          />
        </div>

        <div className="flex w-1/4 flex-col ml-auto">
          <MyCard1
            color={2}
            styles={" h-fit mb-5"}
            head={{ title: "Board", icon: icfy.ux.checkList }}
            menus={["Owner", "Features"]}
            components={[
              <div className="flex flex-col">
                <ProfileAvatar
                  component={
                    <p className="text-[10px] ">
                      {owner?.attributes?.[0]?.identity?.email}
                    </p>
                  }
                  metadatas={owner}
                  cvID={mission?.datas?.owner}
                />
              </div>,
              <div className="flex h-[35vh]  overflow-y-scroll hide-scrollbar flex-wrap font2 mb-5 w-fit mx-auto">
                {features?.map((el) => (
                  <div
                    className="relative w-fit flex mr-5 mt-8  flex-col"
                    key={v4()}
                  >
                    <CVName cvID={el?.datas?.cvWorker} styles={"text-xs"} />

                    <p className="text-[8px]">
                      {fromTimestamp(parseInt(el?.datas?.startedAt))}
                    </p>
                    <Icon
                      className={
                        " text-[6px] btn btn-ghost absolute top-0 w-fit right-0 btn-xs"
                      }
                      icon={icfy.ux.plus}
                    />
                    <div className="gr1 g1 py-[1px] w-12 mb-3 rounded-2xl" />
                    <div className="text-xs text-justify line-clamp-4 whitespace-break-spaces">
                      {el?.metadatas?.description}
                    </div>
                  </div>
                ))}
              </div>,
            ]}
          />
          <MyCardList
            color={2}
            styles={"mb-5"}
            head={{ title: "Information", icon: icfy.work.casual }}
            arr={[
              {
                value: (
                  <span className="flex items-center">
                    {state?.mission?.datas?.amount}
                    <Icon icon={icfyETHER} />
                  </span>
                ),
                title: "Amount",
              },
              {
                value: <>{state?.features?.length}</>,
                title: "Features",
              },
              {
                value: <>{state?.features?.length}</>,
                title: "Status",
              },
              {
                value: (
                  <>
                    {state?.features?.length - state?.mission?.datas?.workers}
                  </>
                ),
                title: "Jobs available",
              },
              {
                value: (
                  <div className="flex ">
                    {state?.mission?.badges?.map((el) => (
                      <Icon
                        className="mr-2 text-xl"
                        icon={el?.badge}
                        key={v4()}
                      />
                    ))}
                  </div>
                ),
                title: "Technologies",
              },
              {
                value: (
                  <div className="flex justify-end items-center uppercase">
                    <Icon
                      className="mr-2 text-xl"
                      icon={
                        ENUMS.domain[
                          state?.mission?.metadatas?.attributes?.[0]?.domain
                        ]?.icon
                      }
                    />
                    {
                      ENUMS.domain[
                        state?.mission?.metadatas?.attributes?.[0]?.domain
                      ]?.name
                    }
                  </div>
                ),
                title: "Domain",
              },
            ]}
          />
        </div>
      </div>
    </LayoutMission>
  );
};

export default Mission;
