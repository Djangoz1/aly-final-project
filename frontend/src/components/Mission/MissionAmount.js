import { Icon } from "@iconify/react";

import React from "react";

export const MissionAmount = ({ metadata }) => {
  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
        <Icon icon="mdi:ethereum" className=" w-12 h-12" />
      </div>
      <div className="stat-title text-xs">Amount</div>
      <div className="stat-value text-secondary text-lg my-auto">
        {metadata?.totalAmount}
      </div>
      <div className="stat-desc mt-auto">ETH</div>
    </div>
  );
};
