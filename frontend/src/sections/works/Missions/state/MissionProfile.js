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
  let { state, pointer } = useToolsState();
  let [isMission, setIsMission] = useState(null);

  let fetch = async () => {
    setIsMission(await stateMission(missionID));
  };

  useEffect(() => {
    if (missionID && isMission?.missionID !== missionID) {
      fetch();
    } else if (state?.mission) {
      setIsMission(state?.mission);
    }
  }, [missionID, state?.mission]);

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
      value: isMission?.datas?.features?.length,
    },
    {
      title: "Work slot",
      value:
        isMission?.datas?.features?.length - isMission?.datas?.workers || 0,
    },
    {
      title: "Disputes",
      value: isMission?.datas?.disputes || 0,
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
      value: isMission?.datas?.pubs?.length,
    },
    {
      title: "Domain",
      value: (
        <p className="flex items-center  capitalize">
          <Icon
            className={`mr-2 text-2xl text-${
              ENUMS.domain[isMission?.metadatas?.attributes?.[0]?.domain]?.color
            }`}
            icon={
              ENUMS.domain[isMission?.metadatas?.attributes?.[0]?.domain]?.icon
            }
          />
          {ENUMS.domain[isMission?.metadatas?.attributes?.[0]?.domain]?.name}
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
  return (
    <div className="flex relative overflow-visible  h-full">
      <MyCardInfos
        style={"w-full rounded-t-none mr-[1px]"}
        arr={infos}
      ></MyCardInfos>
      <MyCardInfo
        header={{
          title: (
            <MissionName
              metadatas={isMission?.metadatas}
              id={isMission?.missionID}
            />
          ),

          image: isMission?.metadatas?.image,
        }}
        color={1}
        styles={" w-full h-full overflow-visible "}
        noBtn={true}
        main={{
          text: isMission?.metadatas?.description,
          title:
            ENUMS?.domain?.[isMission?.metadatas?.attributes?.[0]?.domain]
              ?.name,
        }}
      />
    </div>
  );
};
