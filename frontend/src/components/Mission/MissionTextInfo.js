import { Icon } from "@iconify/react";
import { ENUMS_FEATURE_STATUS, ENUMS_FEATURE_TYPE } from "constants/enums";
import { selectDevDomain, selectLanguage } from "helpers";
import React from "react";
import { recastDescription } from "utils/ux-tools";

export const MissionTextInfo = ({ metadata }) => {
  return (
    <div className="stat bg-white w-full flex">
      <div className=" w-fit">
        <div className="stat-value text-primary w-fit flex flex-col">
          <span className="capitalize">{metadata?.title}</span>
        </div>
        <div className="stat-desc   flex flex-col ">
          <span>Description:</span>
          <span className="text-black whitespace-normal ">
            {metadata?.description}
          </span>
        </div>
      </div>
    </div>
  );
};
