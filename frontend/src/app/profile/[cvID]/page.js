"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icsystem } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { controllers } from "utils/controllers";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MyStatus } from "components/myComponents/item/MyStatus";

import { CVInfos } from "sections/Profile/state/CVInfos";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MissionName } from "components/links/MissionName";
import { CVName } from "components/links/CVName";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyBadge } from "components/myComponents/box/MyList";
import {
  MyCountdown,
  MyCounter,
  MyTimer,
} from "components/myComponents/MyCountdown";
import { Avatar } from "components/profile/ProfileAvatar";

function App({ params }) {
  const { cv, metadatas } = useAuthState();

  const { state, status, pointer, refresh } = useToolsState();

  const cvID = params.cvID;
  let [isClick, setIsClick] = useState(0);
  return (
    <LayoutProfile controller={"overview"} cvID={cvID} url={"/"}>
      <MyMenusTabs
        template={2}
        color={15}
        styleOrigin={"mb-4"}
        value={isClick}
        setter={setIsClick}
        arr={["Jobs proposition", "Overview", "Works", "Launchpads", "Social"]}
      />

      <div className="w-full border-y border-white/5 flex">
        {
          [
            <div className="flex  w-full flex-col p-3 gap-2">
              {state?.features?.map((el) => (
                <div className="px-4 py-3 hover:bg-white/10 backdrop-blur hover:border-white/15 border border-white/5 rounded-xl bg-white/5 rouded-lg shadow flex items-center justify-between w-full">
                  <Icon
                    icon={ENUMS.courts[el?.datas?.specification]?.badge}
                    className="text-[34px] mr-3 "
                  />
                  <div className="flex flex-col flex-auto h-full  gap-2">
                    <MyTitle>{el?.metadatas?.title}</MyTitle>
                    <div className="flex c4 gap-2   items-center">
                      <div className="flex gap-2 items-center">
                        <div className="p-2 rounded bg-white/5 ">
                          <Icon icon={icsystem.mission} />
                        </div>
                        <div className="flex flex-col">
                          <MySub size={8}>Mission</MySub>
                          <MissionName
                            style={
                              "c3 whitespace-nowrap max-w-[100px] truncate hover:max-w-fit text-xs"
                            }
                            id={el?.datas?.missionID}
                            missionHash={el?.metadatas?.missionID}
                          />
                        </div>
                      </div>
                      <div className="flex items-center c4 gap-2">
                        <div className="p-2 rounded bg-white/5 ">
                          <Icon icon={icfy.ux.admin} />
                        </div>
                        <div className="flex flex-col">
                          <MySub size={8}>Owner</MySub>
                          <CVName
                            styles={"c3 text-xs"}
                            cvID={el?.datas?.owner}
                            metadata={
                              el?.datas?.owner == state?.profile?.cvID
                                ? state?.profile?.metadatas
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      {el?.datas?.cvWorker && (
                        <div className="flex items-center c4 gap-2">
                          <div className="p-2 rounded bg-white/5 ">
                            <Icon icon={icsystem.feature} />
                          </div>
                          <div className="flex flex-col">
                            <MySub size={8}>worker</MySub>
                            <CVName
                              styles={"c3 text-xs"}
                              cvID={el?.datas?.cvWorker}
                              metadata={
                                el?.datas?.cvWorker == state?.profile?.cvID
                                  ? state?.profile?.metadatas
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {el?.metadatas?.abstract ? (
                      <p className="text-[9px] max-w-[500px] text-white/70 font-light">
                        {el?.metadatas?.abstract}
                      </p>
                    ) : (
                      <></>
                    )}
                    <div className="mt-auto flex items-center gap-2">
                      <MyStatus
                        status={
                          el?.datas?.cvWorker ? el?.datas?.status : "hiring"
                        }
                        target={el?.datas?.cvWorker ? "feature" : "_feature"}
                      />
                      <MyBadge color={1}>
                        {ENUMS.domain[el?.metadatas?.domain]?.name}
                      </MyBadge>
                    </div>
                  </div>
                  <div className="flex h-full items-end min-w-1/4 w-1/4 justify-between flex-col">
                    <div className="flex gap-2 justify-end">
                      <div className="c4 flex items-center gap-4">
                        <MySub size={8}>Claimable</MySub>
                        <MyTimer
                          style={"text-error text-[10px] whitespace-nowrap"}
                          days={el?.datas?.estimatedDays}
                          started={parseInt(el?.datas?.startedAt)}
                        />
                      </div>
                      <MyMainBtn
                        color={2}
                        style={"btn-xs"}
                        icon={icfy.ux.star}
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap max-w-full justify-end my-2 ">
                      {el?.metadatas?.skills?.map((el) => (
                        <MyBadge
                          style={
                            "text-white/70 font-light text-[9px] hover:text-white/90"
                          }
                          color={1}
                          key={v4()}
                        >
                          <span className="truncate hover:max-w-fit max-w-[100px]">
                            {el}
                          </span>
                        </MyBadge>
                      ))}
                    </div>
                    <div className="flex gap-3 items-end">
                      <div className="c4">
                        <MySub size={8}>Wadge</MySub>
                        <MyNum style={"c3"} num={el?.datas?.wadge}>
                          <span className="c4 ml-1 text-xs">ETH</span>
                        </MyNum>
                      </div>

                      <MyMainBtn
                        url={"/mission/" + el?.datas?.missionID}
                        style={"btn-sm"}
                      >
                        View more
                      </MyMainBtn>
                    </div>
                  </div>
                </div>
              ))}
            </div>,
            <CVInfos />,
          ]?.[isClick]
        }
        <MyLayoutDetails
          style={"border-l"}
          arr={[
            {
              value: (
                <MyStatus
                  style={" w-fit text-[8px]"}
                  target={"token"}
                  padding={"px-2 py-1"}
                  allowed={cv == cvID}
                  toStatus={state?.profile?.datas?.acceptToken ? 1 : 0}
                  status={state?.profile?.datas?.acceptToken ? 0 : 1}
                ></MyStatus>
              ),
              icon: icfy.bank.coin,
            },
            {
              title: "Domain",
              value: (
                <MySub style={"items-center flex"}>
                  {ENUMS?.domain[state?.profile?.metadatas?.domain]?.name}
                </MySub>
              ),
              icon: ENUMS.domain[state?.profile?.metadatas?.domain || 0]?.icon,
            },

            state?.profile?.datas?.missions?.length && {
              title: "Missions",
              num: state?.profile?.datas?.missions?.length,
              icon: icsystem.mission,
            },
            state?.profile?.datas?.missions?.length && {
              title: "Features",
              num: state?.profile?.datas?.features?.length,
              icon: icsystem.feature,
            },
            {
              title: "Jobs",
              num: state?.profile?.datas?.proposals?.length,
              icon: icsystem.feature,
            },
            state?.profile?.datas?.launchpads?.length && {
              title: "Launchpads",
              num: state?.profile?.datas?.launchpads?.length,
              icon: icsystem.launchpad,
            },
            state?.profile?.datas?.proposals?.length && {
              title: "Arbitrators",
              num: state?.profile?.datas?.arbitrators?.length,
              icon: icsystem.escrow,
            },
            (state?.profile?.datas?.proposals?.length ||
              state?.profile?.datas?.features?.length) && {
              title: "Disputes",
              num: state?.profile?.details?.escrows?.disputes,
              icon: icsystem.escrow,
            },
            {
              title: "Followers",
              num: state?.profile?.details?.social?.followers,
              icon: icfy.person.friend,
            },
            {
              title: "Posts",
              num: state?.profile?.details?.social?.pubs,
              icon: icfy.msg.post,
            },
          ]}
          footers={[
            {
              title: "Owner",
              value: (
                <Avatar
                  designation={true}
                  metadatas={state?.profile?.metadatas}
                />
              ),
            },
          ]}
          objStatus={{
            target: "profile",
            status: state?.profile?.metadatas?.visibility ? 0 : 1,
          }}
        />
      </div>
    </LayoutProfile>
  );
}

export default App;
