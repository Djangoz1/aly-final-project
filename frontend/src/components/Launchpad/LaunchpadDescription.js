import { MyCard } from "components/myComponents/MyCard";
import React from "react";

export const LaunchpadDescription = ({ datas }) => {
  return (
    <MyCard styles={"mt-3 min-h-[40vh]"}>
      <h6 className="text-white  font-bold">Launchpad Description</h6>
      <p className="text-white">{datas?.metadata?.description}</p>
    </MyCard>
  );
};
