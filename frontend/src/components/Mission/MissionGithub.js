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
      <div className="stat-title text-xs">Owner</div>

      <div className={`stat-figure`}>
        <Icon icon={icfyGITHUB} className="text-[42px] text-secondary" />
      </div>

      <div className="stat-value text-lg text-secondary my-auto">
        <CVName address={metadata?.owner} />
      </div>

      <div className={`stat-desc truncate mt-auto w-[180px] hover:text-info`}>
        <a href={metadata?.url}>
          {metadata?.url === "" ? "No link provided" : metadata?.url}
        </a>
      </div>
    </div>
  );
};
