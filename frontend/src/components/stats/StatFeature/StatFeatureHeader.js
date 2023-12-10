import { Icon } from "@iconify/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Timer } from "components/Timer";
import { CVName } from "components/links/CVName";
import { ENUMS_FEATURE_STATUS } from "constants/enums";
import { calcTimestamp, parseTimestamp, selectDevDomain } from "helpers";
import Link from "next/link";
import React from "react";
import { zeroAddress } from "viem";

export const StatFeatureHeader = ({ obj, feature }) => {
  return (
    <div className="flex">
      <Icon
        icon={selectDevDomain(feature?.metadata?.attributes?.[0]?.domain)?.icon}
        className={"text-primary text-[60px]"}
      />

      <div className="flex-col ml-3 flex justify-between">
        <Link
          href={`/profile/cv/${obj?.cvAddress}`}
          className=" text-white hover:text-info"
        >
          <CVName address={obj?.cvAddress} />
        </Link>
        <p className="font-black text-white">{feature?.metadata?.title}</p>
        <div>
          <p className=" text-xs">
            Oppened At :{" "}
            <span className="text-white">
              {parseTimestamp(feature?.created)}
            </span>
          </p>
          {feature?.assignedWorker !== zeroAddress && (
            <p className="text-xs ">
              Temps restants :{" "}
              <span className="text-white">
                <Timer
                  units={() =>
                    calcTimestamp(feature?.startedAt, feature?.estimatedDays)
                  }
                />
              </span>
            </p>
          )}
        </div>
      </div>
      <p className="ml-auto badge badge-outline badge-success">
        {ENUMS_FEATURE_STATUS[feature?.status]}
      </p>
    </div>
  );
};
