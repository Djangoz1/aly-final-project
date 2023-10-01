import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { MyCountdown } from "../MyCountdown";
import { v4 } from "uuid";
import { Hg, Hg1 } from "components/text/HeroGradient";

export const MyHeaderCard = ({ head, icon, arr, btn }) => {
  let colors = ["", "gb1", "gr1"];
  let _colors = ["text-primary", "text-info", "text-error"];

  return (
    <div className=" rounded-lg shadow-inner font2 bg-zinc-900 flex justify-between  right-0 h-fit py-5 px-5">
      <div className="flex flex-col relative w-full  items-start">
        <div className="flex justify-between items-center w-full">
          <Hg style={"flex items-center"}>{head?.title}</Hg>
          <Icon icon={icon} className={" text-2xl  "} />
        </div>

        <div
          className={`g1 py-[1px] rounded-full my-5 w-full ${colors[0]} transition-all `}
        ></div>
        <div className="flex  flex-wrap justify-between w-full  items-end">
          {arr?.map((el, i) => (
            <>
              <div
                key={v4()}
                className={`flex flex-col w-1/2 mb-2    rounded-lg ${
                  i % 2 === 0 ? "text-left" : "text-right"
                }`}
              >
                <div className="text-xs text-white/40 mb-1">{el?.title}</div>
                <div className="text-xs">{el?.value}</div>
              </div>
            </>
          ))}
          {btn && <div className="ml-auto mt-2">{btn}</div>}
        </div>
      </div>
    </div>
  );
};
