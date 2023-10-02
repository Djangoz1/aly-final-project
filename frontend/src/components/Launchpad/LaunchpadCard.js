import { Icon } from "@iconify/react";
import { MyAsset } from "components/myComponents/MyAsset";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { stateLaunchpad } from "utils/ui-tools/state-tools";
import { fromTimestamp } from "utils/ux-tools";

export const LaunchpadCard = ({ id, style }) => {
  let [isLaunchpad, setIsLaunchpad] = useState(null);
  let fetchState = async () => {
    setIsLaunchpad(await stateLaunchpad(id));
  };
  useEffect(() => {
    if (id != 0 && isLaunchpad === null) {
      fetchState();
    }
  }, [id]);

  return (
    <MyAsset
      style={style}
      url={`/launchpad/${isLaunchpad?.datas?.id}`}
      banniere={isLaunchpad?.metadatas?.attributes?.[0]?.banniere}
      image={isLaunchpad?.metadatas?.image}
      title={isLaunchpad?.metadatas?.title}
      status={[
        {
          title: STATUS.launchpad?.[isLaunchpad?.datas?.status]?.status,
          color: STATUS.launchpad?.[isLaunchpad?.datas?.status]?.color,
        },
        {
          title: (
            <>
              <Icon
                icon={
                  ENUMS.domain?.[
                    isLaunchpad?.metadatas?.attributes?.[0]?.domain
                  ]?.icon
                }
                className={`mr-2`}
              />
              {
                ENUMS.domain?.[isLaunchpad?.metadatas?.attributes?.[0]?.domain]
                  ?.name
              }
            </>
          ),
          color:
            ENUMS.domain?.[isLaunchpad?.metadatas?.attributes?.[0]?.domain]
              ?.color,
        },
      ]}
      description={isLaunchpad?.metadatas?.description}
      details={[
        {
          title: "Fundraising goal",
          value: (
            <>
              {ethers.utils.formatEther(`${isLaunchpad?.datas?.maxCap || 0}`)}
              <span className="text-white/40 ml-1">ETH</span>
            </>
          ),
        },
        {
          title: "Token price",
          value: (
            <>
              ~ {isLaunchpad?.datas?.tokenPrice}
              <span className="text-white/40 ml-1">ETH</span>
            </>
          ),
        },

        {
          value: (
            <>{fromTimestamp(parseInt(isLaunchpad?.datas?.saleStart || 0))}</>
          ),
          title: "Token sale start",
        },
      ]}
    />
  );
};
