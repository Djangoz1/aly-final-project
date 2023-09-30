import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreateFeature } from "sections/works/Features/form/create/CreateFeature";
import { MyHeader } from "components/myComponents/MyHeader";
import { ENUMS } from "constants/enums";
import { MENUS, MENUS_ID } from "constants/menus";
import { STATUS } from "constants/status";
import { useMissionState } from "context/hub/mission";
import {
  icfyETHER,
  icfyGAMING,
  icfyLOCK,
  icfyROCKET,
  icfySTAR,
  icfyTIME,
} from "icones";
import React from "react";
import { themes } from "styles/style";
import { fromTimestamp, timestampToCounter } from "utils/ux-tools";
import { useLaunchpadState } from "context/hub/launchpad";
import { ethers } from "ethers";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Icon } from "@iconify/react";

export const HeaderLaunchpad = ({ path }) => {
  let { metadatas, datas, owner } = useLaunchpadState();

  let domain = ENUMS.domain[metadatas?.attributes?.[0]?.domain];
  let attributes = metadatas?.attributes?.[0];

  let menus = MENUS_ID(datas?.id).mission;

  return (
    <MyHeader
      path={
        path
          ? `/works/mission/${datas?.id}${path && path}`
          : `/works/mission/${datas?.id}`
      }
      menus={menus}
      img={metadatas?.image}
      name={metadatas?.title}
      desc1={<p>Créer le {fromTimestamp(attributes?.createdAt)}</p>}
      desc2={<CVName metadata={owner} />}
      stats={
        {
          component: (
            <div className="absolute  rounded-lg shadow-inner font2 bg-gradient-to-l flex justify-between from-black/80 to-zinc-800/80 right-0 w-2/5 top-0 py-5 px-5">
              <div className="flex flex-col relative w-full  items-start">
                <div className="absolute -top-3 right-0">
                  <Icon
                    icon={icfyROCKET}
                    className=" text-[64px] text-red-900/40 "
                  />
                </div>
                <div className="flex">
                  <div className="flex flex-col items-start">
                    <p className="text-white/40 text-xs">Started in</p>
                    <MyCountdown timestamp={parseInt(datas?.saleEnd)} />
                  </div>
                </div>
                <div className="flex  items-end mt-4">
                  <div className="flex flex-col text-left mr-5 border border-y-0 border-r-1 border-l-0 border-white/10 pr-10 shadow-inner rounded-lg">
                    <p className="text-xs text-white/40 mb-2">
                      Current balance
                    </p>
                    <p>{datas?.amountRaised} ETH</p>
                  </div>
                  <div className="flex flex-col text-left mr-5 border border-y-0 border-r-1 border-l-0 border-white/10 pr-10 shadow-inner rounded-lg">
                    <p className="text-xs text-white/40 mb-2">Token price</p>
                    <p>{datas?.tokenPrice} ETH</p>
                  </div>
                  <div className="flex flex-col text-left mr-5 border border-y-0 border-r-1 border-l-0 border-white/10 pr-10 shadow-inner rounded-lg">
                    <p className="text-xs text-white/40 mb-2">Locked Time</p>
                    <p>{parseInt(datas?.lockedTime || 0n)} Days</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        }

        // {
        //   title: "Token price",
        //   value: `${datas?.tokenPrice} $`,
        //   icon: icfyETHER,
        //   theme: themes.pubs,
        // },
        // {
        //   title: "Domain",
        //   value: domain?.name.toUpperCase(),
        //   icon: domain?.icon,
        //   theme: themes.proposals,
        // },
        // {
        //   title: "Jobs",
        //   value: datas?.features?.length,
        //   icon: icfyLOCK,
        //   theme: themes.launchpads,
        // },
        // {
        //   //   title: "Started",
        //   value: <MyCountdown timestamp={parseInt(datas?.saleEnd)} />,
        //   icon: icfyTIME,
        //   theme: themes.missions,
        // },
      }
      details={[
        {
          title: "Post(s)",
          value: datas?.pubs?.length,
        },
        {
          title: "Status",
          value: STATUS.launchpad?.[datas?.status]?.status,
        },
        {
          title: "Worker(s)",
          value: datas?.workers,
        },
      ]}
    />
  );
};
