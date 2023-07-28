import { Icon } from "@iconify/react";
import { Timer } from "components/Timer";
import { calcTimestamp, parseTimestamp } from "helpers";
import { IcClock, icfyINFO } from "icones";
import React from "react";

export const MissionDataInfo = ({ metadata }) => {
  return (
    <div className="stat">
      <div className={`stat-figure ${"text-info"}`}>
        <Icon icon={icfyINFO} className="text-[42px] text-secondary" />
      </div>

      <div className=" stat-title text-xs  flex flex-col">Information</div>
      <div className="stat-value text-lg text-secondary my-auto">
        {metadata?.name}
      </div>
      <span className="stat-desc mt-auto text-sm  ">
        Tasks number : {metadata?.features?.length}
      </span>
    </div>
  );
};
