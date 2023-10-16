import { Icon } from "@iconify/react";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyTable } from "components/myComponents/table/MyTable";
import { Hg, Hg0, Hg1 } from "components/text/HeroGradient";
import { ENUMS } from "constants/enums";
import { MENUS_EDIT } from "constants/menus";
import { STATUS } from "constants/status";
import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { IcClock, icfyETHER, icfyTIME } from "icones";
import React, { useEffect, useRef, useState } from "react";
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
import { fromTimestamp } from "utils/ux-tools";
import { _table_invites } from "utils/works/feature";

export const LaunchpadProfile = ({ missionID }) => {
  let { state, pointer } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);

  let [isTables, setIsTables] = useState(null);

  console.log(state);
  return (
    <div className="flex border max-w-fit  bg-black/20 py-3   px-4 justify-end w-fit backdrop-blur rounded-lg border-white/10   flex-col  ">
      <h6 className="font2 font-light c2 w-fit text-[44px]">
        {state?.launchpad?.metadatas?.title}
      </h6>
      <div className="flex  items-center ">
        <Icon icon={icfyTIME} className="c2 text-2xl mr-3" />

        <p className="flex flex-col text-white/70">
          Started
          <span className="text-white">
            {fromTimestamp(parseInt(state?.launchpad?.datas?.saleStart))}
          </span>
        </p>
        <p className="flex flex-col text-white/70 ml-4">
          End
          <span className="text-white">
            {fromTimestamp(parseInt(state?.launchpad?.datas?.saleEnd))}
          </span>
        </p>
      </div>
      <div className="flex mt-4 items-center">
        <Icon icon={icfyETHER} className="text-2xl c2 mr-3" />
        <span className="">{state?.launchpad?.datas?.amountRaised}</span>
        <span className="mx-3 text-xs">ETH Raised</span>
      </div>
      <div
        className={
          " badge badge-2xl badge-outline mt-4 items-center flex p-2  badge-" +
          STATUS.launchpad?.[state?.launchpad?.datas?.status]?.color
        }
      >
        <Icon
          icon={STATUS.launchpad[state?.launchpad?.datas?.status]?.icon}
          className=" mr-3"
        />
        {STATUS.launchpad[state?.launchpad?.datas?.status]?.status}
        {/* <span className="">
        </span>
        <span className="mx-3 text-xs">ETH Raised</span> */}
      </div>
    </div>
  );
};
