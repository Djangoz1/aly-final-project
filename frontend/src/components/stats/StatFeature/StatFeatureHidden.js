import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ZERO_ADDRESS } from "constants/web3";
import { selectDevDomain, selectLanguage } from "helpers";
import Link from "next/link";
import React from "react";
import { recastDescription } from "utils/ux-tools";

export const StatFeatureHidden = ({ feature }) => {
  return (
    <div className="flex ml-[8vw]">
      <div className="flex-col flex  justify-start h-full">
        <span className="text-xs ">{feature?.metadata?.name}</span>
        <span className="text-xs ">
          Mission ID #{parseInt(feature?.missionID)}
        </span>

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
              selectDevDomain(feature?.metadata?.attributes?.[0]?.domain)?.icon
            }
            className="text-[28px] mr-4 text-primary"
          />
          <Icon
            icon={
              selectLanguage(feature?.metadata?.attributes?.[0]?.devLanguage)
                ?.icon
            }
            className="text-[28px] "
            style={{
              color: selectLanguage(
                feature?.metadata?.attributes?.[0]?.devLanguage
              )?.color,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col ml-5">
        <p className="text-xs">Description :</p>
        <p className="text-sm text-black max-w-[350px]">
          {feature?.metadata?.description}
        </p>
      </div>
      <div className="flex flex-col ml-5">
        <p className="text-xs">Link :</p>
        <a href={feature?.metadata?.url} className="text-sm text-info ">
          {feature?.metadata?.url}
        </a>
      </div>
    </div>
  );
};
