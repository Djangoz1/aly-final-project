"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useAuthState } from "context/auth";

import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";

import { MyCalendar } from "components/myComponents/MyCalendar";
import {
  MyCard,
  MyCard1,
  MyCardInfos,
} from "components/myComponents/card/MyCard";
import { v4 } from "uuid";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { fromTimestamp } from "utils/ux-tools";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { ENUMS } from "constants/enums";
import { Avatar, AvatarsList } from "components/profile/ProfileAvatar";

export const AgendasMission = () => {
  const { cv } = useAuthState();

  const { state, pointer } = useToolsState();

  let ref = useRef(null);
  let { colors } = ENUMS;
  return (
    <div className="w-full   h-full flex-col flex" ref={ref}>
      <div className="flex w-full justify-between ">
        <MyCardInfos
          style={"rounded-none w-full mr-[1px] h-fit"}
          arr={state?.agendas?.events?.map((event, i) => {
            return {
              // icon: ENUMS.domain?.[],
              icon: ENUMS.courts[
                state?.features?.[event?.index]?.datas?.specification
              ]?.badge,
              title: (
                <>
                  <div className={`${colors?.[i]} badge badge-xs mr-2`} />
                  {event?.title}
                </>
              ),
              value: (
                <>
                  <div className="flex ml-10 debug flex-col">
                    <div className="flex justify-between items-center">
                      <p className="mr-2 text-white/40">Started At</p>
                      <span>{fromTimestamp(event?.start?.getTime())}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="mr-2 text-white/40">Claimable At</p>
                      <span>{fromTimestamp(event?.end?.getTime())}</span>
                    </div>
                  </div>
                  <Avatar
                    style={"ml-10"}
                    _cvID={state?.features?.[event?.index]?.datas?.cvWorker}
                    designation={true}
                  />
                </>
              ),
            };
          })}
        ></MyCardInfos>

        <div className={" backdrop-blur-[2px] p-0  w-full"} color={1}>
          <MyCalendar events={state?.agendas?.events} />
        </div>
      </div>
    </div>
  );
};
