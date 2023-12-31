import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { recastDescription } from "utils/ux-tools";

export const StatFeatureBadges = ({ feature }) => {
  return (
    <div className="flex">
      <p className="badge badge-info">
        {feature?.metadata?.attributes?.[0]?.devLanguage}
      </p>

      <p className="badge badge-primary mx-3">
        {feature?.metadata?.attributes?.[0]?.domain}
      </p>
      <p className="badge badge-warning ">{feature?.estimatedDays} day(s)</p>
    </div>
  );
};
