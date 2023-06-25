import { ENUMS_FEATURE_STATUS, ENUMS_FEATURE_TYPE } from "constants/enums";
import { parseHex } from "helpers";
import React from "react";

export const FeatureInfo = ({ feature }) => {
  const { description, id, status, featureType } = feature;
  return (
    <div className="stat">
      <div className="stat-figure text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-8 h-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
      </div>
      <div className="stat-title">Feature #{parseHex(id)}</div>
      <div className="stat-value text-primary flex flex-col">
        <span className=" text-xs">{ENUMS_FEATURE_TYPE[featureType]}</span>
        <span className="">{ENUMS_FEATURE_STATUS[status]}</span>
      </div>
      <div className="stat-desc flex flex-col">
        <span>Description:</span>
        <span className="text-gray-200 w-[200px] truncate">{description}</span>
      </div>
    </div>
  );
};
