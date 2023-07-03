import { ZERO_ADDRESS } from "constants/web3";

import { IcCommunity, IcLock, IcShieldCheck, IcUnlock } from "icones";
import React from "react";

export const FeatureWorker = ({ feature }) => {
  const { isDone, isInviteOnly, assignedWorker } = feature;
  return (
    <div className="stat">
      <div className="stat-title">Worker</div>

      <div
        className={`stat-figure ${
          isInviteOnly ? "text-error" : "text-success"
        }`}
      >
        <IcCommunity />
      </div>

      <div className="stat-title truncate w-[100px]">
        {assignedWorker === ZERO_ADDRESS
          ? "En attente d'un worker ..."
          : assignedWorker}
      </div>
      <div
        className={`stat-desc text-secondary ${
          isInviteOnly ? "text-error" : "text-success"
        }`}
      >
        {isDone
          ? "Finished"
          : isInviteOnly && assignedWorker === ZERO_ADDRESS
          ? "Invitation only"
          : "Open to every workers"}
      </div>
    </div>
  );
};
