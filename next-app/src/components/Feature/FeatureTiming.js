import { Timer } from "components/Timer";
import { calcTimestamp, parseTimestamp } from "helpers";
import { IcClock } from "icones";
import React from "react";

export const FeatureTiming = ({ feature }) => {
  const { oppenedAt, estimatedDays, commitLength } = feature;
  return (
    <div className="stat">
      <div className={`stat-figure ${"text-info"}`}>
        <IcClock />
      </div>

      <div className=" stat-title  flex flex-col">
        Total time:{" "}
        <span className="text-xs text-info "> {estimatedDays} jours</span>
      </div>
      <div className="stat-value ">
        <span className="text-lg ">
          <Timer units={() => calcTimestamp(oppenedAt, estimatedDays)} />
        </span>
      </div>

      <div className="stat-title">
        Ouvert le <span className="text-xs">{parseTimestamp(oppenedAt)}</span>
      </div>
      <div className="stat-desc text-secondary">
        {commitLength} commits posted
      </div>
    </div>
  );
};
