import { Icon } from "@iconify/react";

import React from "react";

export const MissionAmount = ({ metadata }) => {
  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
        <Icon icon="mdi:ethereum" className=" w-12 h-12" />
      </div>
      <div className="stat-title">Amount</div>
      <div className="stat-value text-secondary">{metadata?.totalAmount}</div>
      <div className="stat-desc text-secondary">ETH</div>
    </div>
  );
};
