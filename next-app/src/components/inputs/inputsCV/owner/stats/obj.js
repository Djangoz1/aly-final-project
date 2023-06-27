import React from "react";
import { StatOwnerCV, StatOwnerMission } from "./element";
import { BtnWorkerJoinFeature } from "./btn";

export const ObjStatsOwner = ({ obj }) => {
  return (
    <div className="flex items-center  " key={obj?.address}>
      <div className="stats border bg-primary/50  mr-5 flex w-[30vw] border-primary">
        <StatOwnerCV obj={obj} />
        <StatOwnerMission obj={obj} />
      </div>
    </div>
  );
};
