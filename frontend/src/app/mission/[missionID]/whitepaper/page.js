"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsState } from "context/tools";

import { _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";

import { Avatar } from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icsystem } from "icones";

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
        <div className="w-full  -z-1    flex pr-10 flex-col">
          <MyTitle style={"mb-3  text-2xl "}>
            {state?.mission?.metadatas?.title}
          </MyTitle>
          <div className="flex  my-5 flex-wrap gap-2">
            {state?.features
              ?.filter(
                (el, index, self) =>
                  index ===
                  self.findIndex(
                    (o) => o.datas?.specification == el?.datas?.specification
                  )
              )
              ?.map((el) => (
                <MyBadge
                  style={"gap-2 border-white/5 border text-[9px]"}
                  key={v4()}
                  icon={ENUMS.courts?.[el?.datas?.specification]?.badge}
                >
                  {ENUMS.courts?.[el?.datas?.specification]?.court}
                </MyBadge>
              ))}
          </div>
          <article className=" font-ligt whitespace-break-spaces text-lg ">
            {state?.mission?.metadatas?.abstract || (
              <span className="text-warning flex items-center text-xs">
                <Icon icon={icfy.ux.warning} /> Please provide an abstract
                description for a better referencing
              </span>
            )}
          </article>

          <article
            dangerouslySetInnerHTML={{
              __html: state?.mission?.metadatas?.description,
            }}
            className=" font-extraligth my-6 whitespace-break-spaces opacity-70 pr-10 "
          />

          <div className="flex flex-col divide-y w-full divide-white/5 ">
            {state?.features?.map((element, i) => (
              <div
                id={"feature" + i}
                className="flex flex-col-reverse w-full  py-5 "
              >
                {
                  <article
                    dangerouslySetInnerHTML={{
                      __html: element?.metadatas?.description,
                    }}
                    className=" font-extraligth my-6 whitespace-break-spaces opacity-70  "
                  />
                }
                {element?.metadatas?.abstract ? (
                  <p className="mb-3 opacity-50  text-xs">
                    {element.metadatas.abstract}
                  </p>
                ) : (
                  <></>
                )}

                <div className="flex w-full mb-5 flex-wrap gap-2">
                  {element?.metadatas?.skills?.map((el, i) => (
                    <MyBadge
                      key={v4()}
                      // color={0}
                      style={"gap-2 border-white/5 border text-[9px]"}
                    >
                      {el}
                    </MyBadge>
                  ))}
                </div>
                <div className="flex justify-between w-full  items-start gap-2 mb-5">
                  <div className="">
                    <MyTitle style={" mb-2 text-xl "}>
                      {element?.metadatas?.title}
                    </MyTitle>
                    <div className="flex gap-2">
                      <MyStatus
                        target={"feature"}
                        status={element.datas.status}
                      />
                      <MyBadge
                        style={""}
                        color={element?.datas?.specification}
                        icon={
                          ENUMS?.courts?.[element?.datas?.specification]?.badge
                        }
                      >
                        {ENUMS?.courts?.[element?.datas?.specification]?.court}
                      </MyBadge>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <Avatar
                      designation={true}
                      _cvID={element?.datas?.cvWorker}
                    />
                    <div className="flex  flex-col items-end gap-2 ">
                      <MySub size={10} style={"opacity-50"}>
                        #{i + 1}
                      </MySub>
                      <MyBtnDropdown
                        arr={[
                          element?.datas?.cvWorker ||
                          cv == element?.datas?.owner ||
                          element?.details?.workerDemand
                            ?.map((el) => `${el}`)
                            ?.includes(`${cv}`)
                            ? undefined
                            : {
                                setter: async () => {
                                  await _apiPost("askToJoin", [
                                    element?.featureID,
                                  ]);
                                },
                                icon: icfy.ux.edit,
                                title: "Join",
                              },

                          ,
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-[15%] min-w-[250px] flex-col  px-5">
          <MyTitle style={"mb-6"}>On this page</MyTitle>
          <MySub style={"mb-4"}>Features</MySub>

          <div className={"flex w-full flex-col gap-3"}>
            {state?.features?.map((el, i) => (
              <a
                href={"#feature" + i}
                className=" w-full text-xs opacity-50 flex gap-2 hover:opacity-70  items-center font-extralight"
                key={v4()}
              >
                <span className="w-[5%] text-[8px]">#{i + 1}</span>
                <Icon icon={icfy.ux.arrow} className={"rotate-90"} />
                {el.metadatas.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </LayoutMission>
  );
}

export default App;
