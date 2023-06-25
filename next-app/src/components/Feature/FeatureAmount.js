import { parseHex } from "helpers";
import React from "react";

export const FeatureAmount = ({ feature }) => {
  const { wadge } = feature;
  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      </div>
      <div className="stat-title">Amount</div>
      <div className="stat-value text-secondary">{parseHex(wadge)}</div>
      <div className="stat-desc text-secondary">ETH</div>
    </div>
  );
};
