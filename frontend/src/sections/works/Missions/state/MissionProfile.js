import { Icon } from "@iconify/react";
import { AssetProfile } from "components/assets/AssetProfile";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCard1, MyCardInfos } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMenus, MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyTable } from "components/myComponents/table/MyTable";
import { ENUMS } from "constants/enums";
import { MENUS_EDIT } from "constants/menus";
import { STATUS } from "constants/status";
import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfyETHER } from "icones";
import React, { useEffect, useRef, useState } from "react";
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
import { stateMission } from "utils/ui-tools/state-tools";
import { _table_invites } from "utils/works/feature";
import { v4 } from "uuid";

export const MissionProfile = ({ missionID }) => {
  let { state, pointer, status } = useToolsState();
  let [isMission, setIsMission] = useState(null);

  let fetch = async () => {
    setIsMission(await stateMission(missionID));
  };

  useEffect(() => {
    if (status === "success" || status === "reload") {
      if (missionID && isMission?.missionID !== missionID) {
        fetch();
      } else if (state?.mission) {
        setIsMission(state?.mission);
      }
    }
  }, [missionID, state?.mission, status]);

  let infos = [
    {
      title: "Status",
      value: (
        <MyStatus
          status={isMission?.datas?.status}
          target={"mission"}
          padding={"px-2 py-1"}
        />
      ),
    },
    {
      title: "Features",
      num: isMission?.datas?.features?.length,
    },
    {
      title: "Work slot",
      num: isMission?.datas?.features?.length - isMission?.datas?.workers || 0,
    },
    {
      title: "Disputes",
      num: isMission?.datas?.disputes || 0,
    },

    {
      title: "Total wadge",
      value: (
        <>
          <p className="flex items-center">
            <Icon icon={icfyETHER} className="text-white text-lg mr-1  " />
            <span>{isMission?.datas?.amount.toFixed(5)}</span>
            <span className="text-white c2  ml-1">ETH</span>
          </p>
        </>
      ),
    },
    {
      title: "Posts",
      num: isMission?.pubs?.length,
    },
    {
      title: "Followers",
      num: isMission?.details?.social?.followers?.length,
    },
    {
      title: "Domain",
      value: (
        <p className="flex items-center  capitalize">
          <Icon
            className={`mr-2 text-2xl text-${
              ENUMS.domain[isMission?.metadatas?.domain]?.color
            }`}
            icon={ENUMS.domain[isMission?.metadatas?.domain]?.icon}
          />
          {ENUMS.domain[isMission?.metadatas?.domain]?.name}
        </p>
      ),
    },

    {
      title: "Technology",
      value: (
        <div className="w-full flex overflow-x-scroll h-full hide-scrollbar">
          {isMission?.details?.badges?.map((el) => (
            <Icon
              key={v4()}
              icon={ENUMS.courts?.[el]?.badge}
              className="text-white c2 text-[24px] mr-4"
            />
          ))}
        </div>
      ),
    },
  ];
  console.log(isMission);
  return (
    <div className="flex flex-col pt-20  relative overflow-visible  h-full">
      <div className="flex flex-col px-4">
        <div className="flex items-center">
          <MissionName
            style={"w-fit c4 uppercase font-semibold text-lg"}
            metadatas={isMission?.metadatas}
            id={isMission?.missionID}
          />
          <div className="badge badge-primary uppercase ml-2">
            {ENUMS?.domain?.[isMission?.metadatas?.domain || 0]?.name}
          </div>
        </div>
        {isMission?.metadatas?.abstract && (
          <article className="text-xs font-light my-8">
            {isMission?.metadatas?.abstract}
          </article>
        )}
        <article className=" font-light c3 my-8">
          {isMission?.metadatas?.description}
        </article>
      </div>
      <MyCardInfos
        style={"w-full rounded-t-none mr-[1px]"}
        arr={infos}
      ></MyCardInfos>
    </div>
  );
};
