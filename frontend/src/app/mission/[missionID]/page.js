"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsState } from "context/tools";

import { _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";

import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfySTAR, icsystem } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";
import { MyCardInfos } from "components/myComponents/card/MyCard";

import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { MySub } from "components/myComponents/text/MySub";
import { CVName } from "components/links/CVName";

import { MyBadge, MyList } from "components/myComponents/box/MyList";

import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyBtnDropdown } from "components/myComponents/btn/MyDropdownBtn";
import { MyStatus } from "components/myComponents/item/MyStatus";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;
  // ! TO DO SECURE HTML

  return (
    <LayoutMission controller={"overview"} missionID={missionID} url={"/"}>
      <div className="flex divide-x divide-white/5 pt-5">
        <div className="w-full  -z-1 min-h-screen pb-20   flex  flex-col">
          <div className="w-full mb-6 relative flex flex-col gap-1 p-4  bg-first rounded-lg shadow-2xl">
            <div className="flex w-full justify-between">
              <MyTitle style={"opacity-80"}>
                {state?.mission?.metadatas?.title}
              </MyTitle>
              <MyBtnDropdown
                arr={[{ title: "Close mission", icon: icfy.ux.check.uncheck }]}
              />
            </div>
            <Avatar designation={"Owner"} metadatas={state?.owner?.metadatas} />
          </div>
          <MySub>Features</MySub>
          <p className="opacity-50 text-xs">List of active features</p>
          <div className="my-5  grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-5 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            {state?.features
              ?.filter(
                (el, index, self) =>
                  index ===
                  self.findIndex(
                    (o) => o.datas?.specification == el?.datas?.specification
                  )
              )
              ?.map((el) => (
                <div
                  className={
                    "flex flex-col gap-2 bg-first border rounded-lg border-white/5 shadow-xl px-3 py-5 relative"
                  }
                  key={v4()}
                >
                  <div className="flex text-[25px] justify-between mb-5">
                    <div className="bg-gradient-to-br from-white/5 to-white/10 p-3  border-white/5 border rounded-lg shadow-xl">
                      <Icon
                        icon={ENUMS.courts?.[el?.datas?.specification]?.badge}
                      />
                    </div>
                    <MyBtnDropdown
                      arr={[{ title: "Follow" }, { title: "Join" }]}
                    />
                  </div>

                  <MySub>{el.metadatas.title}</MySub>
                  <p className="opacity-50 my-3 text-[10px]">
                    {el.metadatas.abstract}
                  </p>
                  <MyStatus
                    target={"feature"}
                    status={el.datas.status}
                    style={"w-full text-[10px] mt-auto"}
                  />
                </div>
              ))}
          </div>
          <MyMainBtn style={"ml-auto"} url={"/create/feature"} color={2}>
            Create new feature
          </MyMainBtn>
        </div>
        {/* <div className="flex w-[15%] min-w-[250px] flex-col  px-5">
          <MyLayoutDetails
            style={"w-full  "}
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
                  <div className="flex flex-wrap gap-2">
                    {state?.features
                      ?.filter(
                        (el, index, self) =>
                          index ===
                          self.findIndex(
                            (o) =>
                              o.datas?.specification == el?.datas?.specification
                          )
                      )
                      ?.map((el) => (
                        <MyBadge
                          icon={ENUMS.courts?.[el?.datas?.specification]?.badge}
                          key={v4()}
                          color={el?.datas?.specification}
                        >
                          {ENUMS.courts?.[el?.datas?.specification]?.court}
                        </MyBadge>
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
        </div> */}
      </div>
    </LayoutMission>
  );
}

export default App;
