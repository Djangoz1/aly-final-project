import { Icon } from "@iconify/react";
import { Timer } from "components/Timer";
import { MyCard } from "components/myComponents/MyCard";
import { calcTimeRemaining } from "helpers";
import { icfyETH, icfySTAR, icfyTIME } from "icones";
import React from "react";

export const LaunchpadStats = ({ datas }) => {
  return (
    <MyCard>
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

      <div className="stats bg-black/10 shadow">
        <div className="stat">
          <div className="stat-figure text-[30px] text-secondary">
            <Icon icon={icfyETH} />
          </div>
          <div className="stat-title text-sm text-white/80">Capitalization</div>
          <div className="stat-value text-secondary flex items-center">
            {datas?.amountRaised} <span className="ml-1 text-sm ">ETH</span>
          </div>
          <div className="stat-desc ">
            Min ~ Max :{" "}
            <span className="text-white">
              {parseInt(datas?.minCap)} ~ {parseInt(datas?.maxCap)} ETH
            </span>
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            {datas?.token?.symbol}
          </div>
          <div className="stat-title text-sm text-white/80">
            Token :<span className="text-white"> {datas?.token?.name} </span>
          </div>
          <div className="stat-value text-secondary flex items-center">
            1{" "}
            <span className="ml-1 text-sm">
              = {parseInt(datas?.tokenPrice)} ETH
            </span>
          </div>
          <div className="stat-desc w-[70px] truncate">
            <span className="text-white w-[70px] truncate">
              {datas?.tokenAddress}
            </span>
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary text-[30px]">
            <Icon icon={icfySTAR} />
          </div>
          <div className="stat-title text-sm text-white/80">Round</div>
          <div className="stat-value text-secondary items-center flex">
            {datas?.currentTier}{" "}
            <span className="ml-1 text-sm"> / {datas?.numberOfTier}</span>
          </div>
          <div className="stat-desc">
            Total user :{" "}
            <span className="text-white">{parseInt(datas?.totalUser)}</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary text-[30px]">
            <Icon icon={icfyTIME} />
          </div>
          <div className="stat-title text-sm text-white/80">Timing</div>
          <div className="stat-value text-secondary justify-center text-sm flex flex-col">
            <div className="flex items-center">
              <span className="text-xs text-white mr-3">Start </span>
              <Timer
                units={() => calcTimeRemaining(parseInt(datas?.saleStart))}
              />
            </div>
            <div className="flex items-center">
              <span className="text-xs text-white mr-auto">End </span>
              <Timer
                units={() => calcTimeRemaining(parseInt(datas?.saleEnd))}
              />
            </div>
          </div>
        </div>
      </div>
    </MyCard>
  );
};
