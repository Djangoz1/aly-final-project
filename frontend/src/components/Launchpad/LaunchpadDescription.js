import { MyCard } from "components/myComponents/MyCard";
import React from "react";

export const LaunchpadDescription = ({ datas }) => {
  return (
    <div>
      <div className="divider text-primary">Description</div>

      <p className="text-white">{datas?.metadata?.description}</p>
    </div>
  );
};
