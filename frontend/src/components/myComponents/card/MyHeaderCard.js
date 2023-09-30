import { Icon } from "@iconify/react";
import React from "react";
import { MyCountdown } from "../MyCountdown";
import { v4 } from "uuid";

export const MyHeaderCard = ({ head, icon, arr }) => {
  return (
    <div className="absolute  rounded-lg shadow-inner font2 bg-gradient-to-l flex justify-between from-black/80 to-zinc-800/80 right-0 w-2/5 top-0 py-5 px-5">
      <div className="flex flex-col relative w-full  items-start">
        <div className="absolute -top-3 right-0">
          <Icon icon={icon} className=" text-[64px] text-red-900/40 " />
        </div>
        <div className="flex">
          <div className="flex flex-col items-start">
            <div className="text-white/40 text-xs">{head?.title}</div>
            <div className="text-xl">{head?.value}</div>
          </div>
        </div>
        <div className="flex  items-end mt-4">
          {arr?.map((el) => (
            <div
              key={v4()}
              className="flex flex-col text-left mr-5 border border-y-0 border-r-1 border-l-0 border-white/10 pr-10 shadow-inner rounded-lg"
            >
              <div className="text-xs text-white/40 mb-2">{el?.title}</div>
              <div>{el?.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
