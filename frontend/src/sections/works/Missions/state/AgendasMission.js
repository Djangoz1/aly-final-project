"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useAuthState } from "context/auth";

import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";

import { MyCalendar } from "components/myComponents/MyCalendar";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { v4 } from "uuid";

export const AgendasMission = () => {
  const { cv } = useAuthState();
  let [isClicked, setIsClicked] = useState(null);

  const { state, pointer } = useToolsState();

  let ref = useRef(null);
  const isInView = useInView(ref);
  let dispatch = useToolsDispatch();

  let fetch = async () => {
    let _state = state;
    _state.events = [];

    for (let index = 0; index < _state?.features?.length; index++) {
      const feature = _state?.features[index];

      let start = new Date(parseInt(feature?.datas?.startedAt) * 1000);
      let end = new Date(start);
      end.setDate(start.getDate() + feature.datas?.estimatedDays);
      let event = {
        start: start,
        end: end,
        days: feature?.datas?.estimatedDays,
        title: feature?.metadatas?.title,
      };
      _state.events.push(event);
    }

    doStateTools(dispatch, _state);
  };
  useEffect(() => {
    if (!state?.events && isInView) {
      fetch();
      console.log("fetch events ...");
    }
  }, [state?.events, isInView]);

  return (
    <div ref={ref}>
      <div className="tabs tabs-boxed backdrop-blur  mb-1">
        <button
          onClick={() => setIsClicked(null)}
          className={`  tab mr-5 btn-xs ${
            isClicked === null ? "bg-black text-white" : " "
          }`}
        >
          All
        </button>
        {state?.features?.map((el, i) => (
          <button
            onClick={() => setIsClicked(i)}
            key={v4()}
            className={`  tab mr-5 btn-xs ${
              isClicked === i ? " bg1 text-white" : " "
            }`}
          >
            {el?.metadatas?.title}
          </button>
        ))}
      </div>
      <MyCard1 color={1}>
        <MyCalendar
          events={
            isClicked !== null ? [state?.events?.[isClicked]] : state?.events
          }
        />
      </MyCard1>
    </div>
  );
};
