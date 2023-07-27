import { ImagePin } from "components/Image/ImagePin";
import { Timer } from "components/Timer";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyProgressbar } from "components/myComponents/MyProgressbar";
import { calcTimeRemaining } from "helpers";
import React, { useEffect, useState } from "react";
import { calcTierAverage } from "utils/ui-tools/launchpad-tools";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import {
  _getterAccessControl,
  _getterFactoryCV,
  _getterLaunchpad,
} from "utils/ui-tools/web3-tools";
import { getLaunchpadDatas } from "utils/ui-tools/launchpad-tools";
import Link from "next/link";

export const LaunchpadCard = ({ address }) => {
  const [isDatas, setIsDatas] = useState(null);
  const getDatas = async () => {
    const datas = await getLaunchpadDatas(address);
    setIsDatas(datas);
  };
  useEffect(() => {
    if (address && !isDatas) getDatas();
  }, [address]);

  const isStart = () => {
    const start = calcTimeRemaining(parseInt(isDatas?.saleStart));
    const end = calcTimeRemaining(parseInt(isDatas?.saleEnd));
    if (start.days > 0 || start.hours > 0 || start.minutes > 0) {
      return "Upcoming";
    } else if (end.days > 0 || end.hours > 0 || end.minutes > 0) {
      return "Live";
    } else {
      return "Finish";
    }
  };
  return (
    <div className="bg-white shadow z-0 relative min-h-[20vh] flex flex-col border-box rounded min-w-[450px] w-full p-3">
      <div className="badge badge-warning badge-outline badge-sm absolute right-2 ">
        {isStart()}
      </div>
      <div className="flex flex-col items-center mb-5">
        <div className="rounded-2xl w-[60px] shadow overflow-hidden border border-black/20">
          <ImagePin CID={isDatas?.metadata?.image} />
        </div>
        <h5 className="text-center text-black font-black">
          {isDatas?.metadata?.title}
        </h5>
        <span>
          <CVName address={isDatas?.owner} />
        </span>
      </div>

      <MyProgressbar
        title={"Sale progress"}
        value={isDatas?.amountRaised}
        endedValue={parseInt(isDatas?.maxCap)}
      />

      <div className="flex justify-evenly my-5">
        <p className="border border-primary text-xs rounded flex items-center px-2 py-1">
          Softcap :{" "}
          <span className="font-bold text-lg text-black ml-1">
            {parseInt(isDatas?.minCap)} ETH
          </span>
        </p>

        <p className="border border-primary text-xs rounded flex items-center px-2 py-1">
          Maxcap :{" "}
          <span className="font-bold text-lg text-black ml-1">
            {parseInt(isDatas?.maxCap)} ETH
          </span>
        </p>
      </div>
      <div className=" text-xs  flex justify-evenly mb-2 items-center  flex">
        <div className="flex flex-col items-center">
          <span className="badge badge-primary">{isDatas?.token?.name}</span>
          <p>Token Name</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="badge badge-secondary">
            {isDatas?.token?.symbol}
          </span>
          <p>Token Symbol</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-xs">Number of Round</label>
          <span className="text-black text-sm">{isDatas?.numberOfTier}</span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Current Round</label>
          <span className="text-black text-sm">{isDatas?.currentTier}</span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Min - Max Contribution</label>
          <span className="text-black text-sm">
            {parseInt(isDatas?.minInvest)} ~ {parseInt(isDatas?.maxInvest)} ETH{" "}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Lockup Time</label>
          <span className="text-black text-sm">
            {parseInt(isDatas?.lockedTime)} Day(s)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Current token price</label>
          <span className="text-black text-sm">
            {parseInt(isDatas?.tokenPrice)} ETH
          </span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Total supply </label>
          <span className="text-black text-sm">
            {parseInt(isDatas?.token?.totalSupply)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Launchpad supply</label>
          <span className="text-black text-sm">
            {parseInt(isDatas?.token?.allowance) || 0}
          </span>
        </div>
        <div className="flex justify-between my-2">
          <div className="flex flex-col items-center justify-center">
            <label className="text-xs">Presale start</label>

            <Timer
              units={() => calcTimeRemaining(parseInt(isDatas?.saleStart))}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <label className="text-xs">Presale end</label>

            <Timer
              units={() => calcTimeRemaining(parseInt(isDatas?.saleEnd))}
            />
          </div>
        </div>
      </div>
      <Link
        href={`/profile/launchpad/${address}`}
        className="btn btn-primary btn-xs w-1/2 my-3 mx-auto"
      >
        View details
      </Link>
      <Link
        href={`/profile/launchpad/${address}`}
        className="text-[8px] hover:text-info hover:underline"
      >
        {address}
      </Link>
    </div>
  );
};
