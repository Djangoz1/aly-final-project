import { Icon } from "@iconify/react";
import { ENUMS_FEATURE_STATUS, ENUMS_FEATURE_TYPE } from "constants/enums";
import { parseHex, selectLanguage } from "helpers";
import React from "react";

export const FeatureInfo = ({ feature }) => {
  const { description, id, status, featureType } = feature;

  return (
    <div className="stat flex">
      <div className=" w-fit">
        <div className="stat-title w-fit">{ENUMS_FEATURE_STATUS[status]}</div>
        <div className="stat-value text-primary w-fit flex flex-col">
          <span className=" text-xs">{ENUMS_FEATURE_TYPE[featureType]}</span>
          <span className="capitalize">{description?.split(": ")?.[0]}</span>
        </div>
        <div className="stat-desc flex flex-col ">
          <span>Description:</span>
          <span className="text-gray-200 w-[150px] truncate">
            {description?.split(": ")?.[1]}
          </span>
        </div>
      </div>
      <div className="stat-figure  ">
        <Icon
          icon={selectLanguage(description)?.icon}
          className="text-[40px]"
        />
      </div>
    </div>
  );
};
