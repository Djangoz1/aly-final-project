import { Icon } from "@iconify/react";
import { CVName } from "components/links/CVName";
import { MyAsset } from "components/myComponents/MyAsset";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { BtnGb1 } from "components/myComponents/btn/MyGradientButton";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import { icfy, icfyETHER, icfyTIME, icsystem } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateLaunchpad } from "utils/ui-tools/state-tools";
import { fromTimestamp } from "utils/ux-tools";
import { AssetProfile, AssetProfile1 } from "./AssetProfile";
import { Avatar } from "components/profile/ProfileAvatar";
import { MyTabs } from "components/myComponents/MyTabs";
import { doStateFormPointer } from "context/form";
import {
  doPointerTools,
  doStateLaunchpadTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { MyNum } from "components/myComponents/text/MyNum";

export const AssetLaunchpad = ({
  id,
  setter,
  allowed,
  target,
  header,
  url,
  children,
  style,
  state,
}) => {
  let [isLaunchpad, setIsLaunchpad] = useState(null);
  let fetchState = async () => {
    setIsLaunchpad(await stateLaunchpad(id));
  };

  let dispatch = useToolsDispatch();
  let { pointer } = useToolsState();
  useEffect(() => {
    if (state?.launchpadID && isLaunchpad === null) {
      setIsLaunchpad(state);
    } else if (id && id != 0 && isLaunchpad === null) {
      fetchState();
    }
  }, [id, state]);

  let lists = [
    {
      title: "Investors",
      description: (
        <>
          <span className="text-xs uppercase mr-2">Total users</span>
          {parseInt(isLaunchpad?.datas?.totalUser)}
        </>
      ),
      icon: icfy.person.team,
    },

    {
      title: "Fundraising goal",
      description: (
        <>
          {parseInt(
            ethers.utils.formatEther(`${isLaunchpad?.datas?.maxCap || 0}`)
          ).toFixed(5)}
          <span className="text-xs ml-2">ETH</span>
        </>
      ),
      icon: icfy.bank.coin,
    },

    {
      icon: icfyTIME,
      title: isLaunchpad?.datas?.status === 1 ? "Sale start" : "Sale end",
      description: (
        <MyCountdown
          style={"mt-2 c2"}
          size={10}
          startDate={Math.floor(Date.now() / 1000)}
          timestamp={parseInt(
            isLaunchpad?.datas?.status === 1
              ? isLaunchpad?.datas?.saleEnd
              : isLaunchpad?.datas?.saleStart
          )}
        />
      ),
      check: Math.floor(Date.now() / 1000) < isLaunchpad?.datas?.endDate,
    },
    {
      icon: STATUS.launchpad[isLaunchpad?.datas?.status]?.icon,
    },
  ];

  return (
    <MyCardList
      target={target}
      color={0}
      setter={setter}
      icon={{ img: isLaunchpad?.metadatas?.image }}
      style={style}
      image={isLaunchpad?.metadatas?.image}
      price={<MyNum num={isLaunchpad?.datas.amountRaised} />}
      url={url || `/launchpad/${isLaunchpad?.launchpadID}`}
      btn={{
        title: isLaunchpad?.metadatas?.title,
        info: (
          <>
            Nombres de rounds:
            <span className="c1 text-lg font-semibold ml-2">
              {isLaunchpad?.datas?.numberOfTier}
            </span>
          </>
        ),
      }}
      head={{
        icon: icsystem.launchpad,
        title: (
          <Link
            className="hover:text-info mx-auto"
            href={`/launchpad/${isLaunchpad?.launchpadID}`}
          >
            {isLaunchpad?.metadatas?.title}
          </Link>
        ),
        component: header,
      }}
      arr={lists}
    >
      <div
        className="flex flex-col c1 w-full  mb-auto flex-start text-start
      "
      >
        <div className="flex pb-3 mb-8 w-full border justify-between bc1 border-b-2 border-t-0 border-x-0   items-start ">
          <div className="flex items-center">
            <Avatar CID={isLaunchpad?.owner?.image} />

            <div className="flex ml-3 flex-col">
              <CVName metadata={isLaunchpad?.owner} styles={"text-lg "} />
              <p className="font-light text-xs">
                Créer le
                <span className="ml-2 font-semibold">
                  {fromTimestamp(parseInt(isLaunchpad?.datas?.saleStart))}
                </span>
              </p>
            </div>
          </div>

          <MyStatus
            allowed={allowed}
            status={
              isLaunchpad?.datas?.status == 1 &&
              isLaunchpad?.datas?.saleStart > Math.floor(Date.now() / 1000)
                ? 0
                : isLaunchpad?.datas?.status
            }
            setter={async () => {
              if (isLaunchpad?.datas?.status == 0) {
                doPointerTools(dispatch, 2);
              } else {
                await _apiPost("setTierID", [
                  parseInt(isLaunchpad?.launchpadID),
                ]);
                doStateLaunchpadTools(dispatch, isLaunchpad?.launchpadID);
              }
            }}
            toStatus={
              isLaunchpad?.datas?.status == 0 ||
              (isLaunchpad?.datas?.status == 1 &&
                isLaunchpad?.datas?.saleStart > Math.floor(Date.now() / 1000))
                ? 1
                : 3
            }
            style={
              "text-xs  bg-black/20 backdrop-blur-2xl  rounded   font-bold "
            }
            target={"launchpad"}
          >
            <p className="text-xs absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full">
              👉
            </p>
          </MyStatus>
        </div>
        {children ? (
          <>{children} </>
        ) : (
          <>
            <h6 className="font-bold uppercase  mb-4 underline">Description</h6>
            <article className="text-xs  hover:text-black my-3 text-justify whitespace-break-spaces font-light">
              {isLaunchpad?.metadatas?.description}
            </article>
          </>
        )}
      </div>
    </MyCardList>
  );
};
