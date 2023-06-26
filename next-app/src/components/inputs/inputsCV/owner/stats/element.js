import { MyStat } from "components/stats/MyStat";
import { icfyCV, icfyETHER } from "icones";
import React from "react";

export const StatOwnerMission = ({ obj }) => {
  const values = {
    title: "Leaderboard",
    value: obj?.amountDispersed,
    description: (
      <>
        <span className="truncate w-[80px] text-xs">
          Missions {obj?.missions?.length}
        </span>
        <span className="truncate w-[80px]">
          Features {obj?.featuresLength}
        </span>
      </>
    ),
    icon: { name: icfyETHER, color: "text-secondary" },
  };
  return <MyStat values={values} style={" text-secondary w-1/2"} />;
};

export const StatOwnerCV = ({ obj }) => {
  const values = {
    title: "Owner",
    value: obj?.name,
    description: (
      <>
        <span className="truncate w-[80px] text-xs">addr: {obj?.address}</span>
        <span className="truncate w-[80px]">cv: {obj?.cvAddress}</span>
      </>
    ),
    icon: { name: icfyCV, color: "text-primary" },
  };

  return <MyStat values={values} style={"w-1/2 text-primary"} />;
};
