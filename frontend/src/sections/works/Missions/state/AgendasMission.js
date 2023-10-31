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

export const AgendasMission = () => {
  const { cv } = useAuthState();
  let [isClicked, setIsClicked] = useState(null);

  const { state, pointer } = useToolsState();

  let ref = useRef(null);
  const isInView = useInView(ref);
  let dispatch = useToolsDispatch();

  let [isInfos, setIsInfos] = useState(null);
  let fetch = async () => {
    let _state = state;
    _state.events = [];
    let infos = [];
    for (let index = 0; index < _state?.features?.length; index++) {
      const feature = _state?.features[index];

      let start = new Date(parseInt(feature?.datas?.startedAt) * 1000);
      let end = new Date(start);
      end.setDate(start.getDate() + feature.datas?.estimatedDays);
      let event = {
        start: start,
        end: end,
        index,
        days: feature?.datas?.estimatedDays,
        title: feature?.metadatas?.title,
      };
      _state.events.push(event);
      infos.push({
        title: (
          <>
            <div className="badge badge-xs badge-primary mr-2" />
            {event?.title}
          </>
        ),
        value: (
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="mr-2 text-white/40">Started At</p>
              <span>{fromTimestamp(event?.start.getTime())}</span>
            </div>
            <div className="flex items-center">
              <p className="mr-2 text-white/40">Claimable At</p>
              <span>{fromTimestamp(event?.end.getTime())}</span>
            </div>
          </div>
        ),
      });
      if (feature?.details?.dispute?.datas?.timers?.createdAt) {
        let start = new Date(parseInt(feature?.datas?.startedAt) * 1000);
        let end = new Date(start);
        end.setDate(
          start.getDate() + feature.details?.dispute?.datas?.reclamationPeriod
        );
        let event = {
          start: start,
          end: end,
          index,
          days: feature?.details?.dispute?.datas?.reclamationPeriod,
          title: `Court - ${feature?.metadatas?.title}`,
          backgroundColor: "red",
          color: "white",
        };

        infos.push({
          title: (
            <>
              <div className="badge badge-xs mr-2 badge-error" />
              {event?.title}
            </>
          ),
          value: (
            <div className="flex   flex-col">
              <div className="flex items-center">
                <p className="mr-2 text-white/40">Started At</p>
                <span>{fromTimestamp(event?.start.getTime())}</span>
              </div>
              <div className="flex items-center">
                <p className="mr-2 text-white/40">Closed At</p>

                <span>{fromTimestamp(event?.end.getTime())}</span>
              </div>
            </div>
          ),
        });
        _state.events.push(event);
      }
    }
    setIsInfos(infos);
    doStateTools(dispatch, _state);
  };
  useEffect(() => {
    if (!state?.events) {
      fetch();
      console.log("fetch events ...");
    }
  }, [state?.events, isInView]);
  console.log("isinfos", isInfos);
  return (
    <div className="w-full mt-[1px] flex" ref={ref}>
      <MyMenusTabs
        template={1}
        style={"backdrop-blur-[1px] bg-neutral-50/10"}
        color={2}
        styleOrigin={"  c2  "}
        setter={setIsClicked}
        arr={state?.features?.map((el) => el?.metadatas?.title)}
        value={isClicked}
      >
        All
      </MyMenusTabs>
      <div className="flex w-full justify-between ">
        <MyCardInfos style={"rounded-tl-none w-full mr-3"} arr={isInfos}>
          coucou
        </MyCardInfos>

        <div className={"ml-auto backdrop-blur-[2px] w-full"} color={1}>
          <MyCalendar
            events={
              isClicked !== null
                ? state?.events?.filter((el) => el.index === isClicked)
                : state?.events
            }
          />
        </div>
      </div>
    </div>
  );
};
