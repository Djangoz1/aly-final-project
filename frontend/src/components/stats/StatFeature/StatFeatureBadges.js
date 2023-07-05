import React from "react";
import { recastDescription } from "utils/ux-tools";

export const StatFeatureBadges = ({ feature }) => {
  return (
    <div className="flex">
      <p className="badge badge-info">
        {recastDescription(feature?.description)?.dev}
      </p>

      <p className="badge badge-primary mx-3">
        {recastDescription(feature?.description)?.domain}
      </p>
      <p className="badge badge-warning ">{feature?.estimatedDays} day(s)</p>
    </div>
  );
};
