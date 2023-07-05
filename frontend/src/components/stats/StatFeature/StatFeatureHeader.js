import { Icon } from "@iconify/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Timer } from "components/Timer";
import { ENUMS_FEATURE_STATUS } from "constants/enums";
import { calcTimestamp, parseTimestamp, selectDevDomain } from "helpers";
import React from "react";
import { recastDescription } from "utils/ux-tools";
import { zeroAddress } from "viem";

export const StatFeatureHeader = ({ feature, mission }) => {
  return (
    <div className="flex">
      <Icon
        icon={
          selectDevDomain(recastDescription(feature?.description)?.domain)?.icon
        }
        className={"text-primary text-[60px]"}
      />
      <div className="flex-col ml-3 flex justify-between">
        <p className="font-black text-black">{mission?.owner}</p>
        <div>
          <p className=" text-xs">
            Oppened At :{" "}
            <span className="text-black">
              {parseTimestamp(feature?.oppenedAt)}
            </span>
          </p>
          {feature?.assignedWorker !== zeroAddress && (
            <p className="text-xs ">
              Temps restants :{" "}
              <span className="text-black">
                <Timer
                  units={() =>
                    calcTimestamp(feature?.oppenedAt, feature?.estimatedDays)
                  }
                />
              </span>
            </p>
          )}
        </div>
      </div>
      <p className="ml-auto badge badge-success">
        {ENUMS_FEATURE_STATUS[feature?.status]}
      </p>
    </div>
  );
};
