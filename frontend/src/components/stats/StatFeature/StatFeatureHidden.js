import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ZERO_ADDRESS } from "constants/web3";
import { selectDevDomain, selectLanguage } from "helpers";
import Link from "next/link";
import React from "react";
import { recastDescription } from "utils/ux-tools";

export const StatFeatureHidden = ({ mission, feature }) => {
  return (
    <div className="flex ml-[8vw]">
      <div className="flex-col flex  justify-start h-full">
        <span className="text-xs ">Mission address :</span>
        <p className="text-[8px] mb-2 hover:text-info">{mission?.address}</p>
        <div className="flex flex-col">
          <span className="text-xs">Assigned Worker :</span>
          {feature?.assignedWorker !== ZERO_ADDRESS ? (
            <Link
              href={`/profile/cv/${feature?.assignedWorker}`}
              className="hover:text-info flex flex-col"
            >
              <CVName
                address={feature?.assignedWorker}
                styles={"text-info hover:text-info"}
              />
              <span className="text-[9px]">{feature?.assignedWorker}</span>
            </Link>
          ) : (
            <span className="text-[9px]">Waiting for a worker ...</span>
          )}
        </div>
        <div className="flex h-full  items-end mt-5">
          <Icon
            icon={
              selectDevDomain(recastDescription(feature?.description)?.domain)
                ?.icon
            }
            className="text-[28px] mr-4 text-primary"
          />
          <Icon
            icon={
              selectLanguage(recastDescription(feature?.description)?.dev)?.icon
            }
            className="text-[28px] "
            style={{
              color: selectLanguage(
                recastDescription(feature?.description)?.dev
              )?.color,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col ml-5">
        <p className="text-xs">Description :</p>
        <p className="text-sm text-black">
          {recastDescription(feature?.description)?.desc}
        </p>
      </div>
    </div>
  );
};
