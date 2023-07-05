import { Icon } from "@iconify/react";
import { ENUMS_FEATURE_STATUS } from "constants/enums";
import { ZERO_ADDRESS } from "constants/web3";
import { useAuthState } from "context/auth";
import { parseTimestamp, selectDevDomain, selectLanguage } from "helpers";
import { icfyCODER, icfyETHER } from "icones";
import React from "react";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { recastDescription } from "utils/ux-tools";

export const StatFeature = ({ feature, mission, submit }) => {
  console.log(feature);

  const { cv } = useAuthState();

  return (
    <div className="flex flex-col border border-white/30 cursor-pointer hover:border-white p-4 box-border w-[370px] rounded">
      <div className="flex">
        <Icon
          icon={
            selectDevDomain(recastDescription(feature?.description)?.domain)
              ?.icon
          }
          className={"text-primary text-[60px]"}
        />
        <div className="flex-col ml-3 flex justify-between">
          <p className="font-black">{mission?.owner}</p>
          <p className="stat-desc">{parseTimestamp(feature?.oppenedAt)}</p>
        </div>
        <p className="ml-auto badge badge-success">
          {ENUMS_FEATURE_STATUS[feature?.status]}
        </p>
      </div>
      <p className="my-5 font-black">
        {recastDescription(feature?.description)?.title}
      </p>
      <div className="flex">
        <p className="badge badge-primary">
          {recastDescription(feature?.description)?.dev}
        </p>

        <p className="badge badge-info mx-3">
          {recastDescription(feature?.description)?.domain}
        </p>
        <p className="badge badge-warning ">{feature?.estimatedDays} day(s)</p>
      </div>
      <div className="flex items-center mt-4">
        <Icon icon={icfyCODER} className="text-2xl" />
        <p className="ml-1 mr-3">
          {feature?.assignedWorker !== ZERO_ADDRESS ? 1 : 0}
        </p>
        <Icon icon={icfyETHER} className="text-2xl" />
        <p>{parseInt(feature?.wadge)} ETH</p>

        {cv &&
          feature?.assignedWorker === ZERO_ADDRESS &&
          !feature?.isInviteOnly && (
            <button
              className="btn btn-xs btn-success btn-outline ml-auto"
              onClick={() => submit(mission?.address, parseInt(feature?.id))}
            >
              Join Feature
            </button>
          )}
      </div>
    </div>
  );
};
