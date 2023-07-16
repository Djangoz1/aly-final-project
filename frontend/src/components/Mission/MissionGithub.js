import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ZERO_ADDRESS } from "constants/web3";

import {
  IcCommunity,
  IcLock,
  IcShieldCheck,
  IcUnlock,
  icfyGITHUB,
} from "icones";
import React from "react";

export const MissionGithub = ({ metadata }) => {
  // const { isDone, isInviteOnly, assignedWorker } = feature;
  return (
    <div className="stat">
      <div className="stat-title">Owner</div>

      <div className={`stat-figure`}>
        <Icon icon={icfyGITHUB} className="text-[42px] text-secondary" />
      </div>

      <div className="stat-title text-[34px] text-secondary">
        <CVName address={metadata?.owner} />
      </div>

      <div className={`stat-desc truncate w-[180px] hover:text-info`}>
        <a href={metadata?.url}>
          {metadata?.url === "" ? "No link provided" : metadata?.url}
        </a>
      </div>
    </div>
  );
};