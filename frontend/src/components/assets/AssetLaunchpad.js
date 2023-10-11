import { Icon } from "@iconify/react";
import { MyAsset } from "components/myComponents/MyAsset";
import { BtnGb1 } from "components/myComponents/btn/MyGradientButton";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateLaunchpad } from "utils/ui-tools/state-tools";
import { fromTimestamp } from "utils/ux-tools";

export const AssetLaunchpad = ({ id, style }) => {
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
        {
          value: (
            <>{fromTimestamp(parseInt(isLaunchpad?.datas?.saleEnd || 0))}</>
          ),
          title: "Token sale end",
        },
        {},
        {
          value: (
            <Link href={`/launchpad/${isLaunchpad?.datas?.id}`}>
              <BtnGb1 style={" btn-xs mt-3 px-5 normal-case"}>View</BtnGb1>
            </Link>
          ),
        },
      ]}
    />
  );
};
