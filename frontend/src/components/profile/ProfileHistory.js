import { MyCard } from "components/myComponents/card/MyCard";
import { MyPagination } from "components/myComponents/MyPagination";
import { MyTitle } from "components/myComponents/MyTitle";
import React from "react";

import { v4 as uuidv4 } from "uuid";
export const ProfileHistory = () => {
  const historics = [
    { missionId: "12", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "7", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "10", from: "Django", to: "Ownie", value: "0.3 ETH" },
    { missionId: "12", from: "Django", to: "Ownie", value: "0.3 ETH" },
  ];
  return (
    <MyCard styles={"mt-3"}>
      <MyTitle title={"Historic"} />
      <div className="flex flex-col mt-4">
        <div className="flex justify-between text-center  border border-black/10 overflow-hidden rounded-md text-[10px]">
          <p className="w-[25%] border-r border border-black/10 border-l-0 border-y-0">
            #Mission
          </p>
          <p className="w-[25%] border-r border border-black/10 border-l-0 border-y-0">
            From
          </p>
          <p className="w-[25%] border-r border border-black/10 border-l-0 border-y-0">
            To
          </p>
          <p className="w-[25%] border-r border border-black/10 border-l-0 border-y-0">
            Amount
          </p>
        </div>
        {historics.length > 1 ? (
          historics.map((historic) => (
            <div
              className="text-[10px] flex border mt-1 border-black/10 text-black text-center"
              key={uuidv4}
            >
              <p className="w-[25%] truncate text-black/50 hover:text-info ">
                #{historic?.missionId}
              </p>
              <p className="w-[25%] truncate border-black/10 border-r-0 border border-y-0">
                {historic.from}
              </p>
              <p className="w-[25%] truncate border-black/10 border-r-0 border border-y-0">
                {historic?.to}
              </p>
              <p className="w-[25%] truncate border-black/10 border border-r-0 border-y-0">
                {historic?.value}
              </p>
            </div>
          ))
        ) : (
          <p className={" text-black mx-auto my-auto py-10 text-xs"}>
            You don't have any transactions
          </p>
        )}

        <MyPagination />
      </div>
    </MyCard>
  );
};
