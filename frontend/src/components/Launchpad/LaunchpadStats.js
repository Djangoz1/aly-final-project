import { Icon } from "@iconify/react";
import { Timer } from "components/Timer";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyStat } from "components/myComponents/MyStat";
import { launchpadStats } from "constants/stats";
import { calcTimeRemaining } from "helpers";
import { icfyETH, icfySTAR, icfyTIME } from "icones";
import React from "react";

export const LaunchpadStats = ({ datas }) => {
  const stats = launchpadStats(datas);
  return (
    <MyCard styles={"h-full"}>
      <div className="flex justify-between items-center mb-5">
        <h6 className="font-bold text-white">Overall Launchpad</h6>
        <div>
          <button className="btn btn-secondary capitalize btn-outline btn-sm mr-5">
            Withdraw
          </button>
          <button className="btn btn-secondary capitalize btn-sm">
            Deposit
          </button>
        </div>
      </div>

      <div className="stats bg-black/40 shadow">
        <MyStat values={stats[0].values} />
        <MyStat values={stats[1].values} />
        <MyStat values={stats[2].values} />
        <MyStat values={stats[3].values} />
      </div>
    </MyCard>
  );
};
