import { Icon } from "@iconify/react";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCard1, MyCardInfos } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
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
import { _table_invites } from "utils/works/feature";

export const MissionProfile = ({ missionID }) => {
  let { state, pointer } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);

  let [isTables, setIsTables] = useState(null);

  useEffect(() => {
    if (
      !isTables?.invites &&
      !isTables?.features &&
      state?.features &&
      state?.owner
    ) {
      let invites = _table_invites(state?.features);
      let features = _table_features(state?.features, state?.owner);
      setIsTables({
        invites,
        features,
      });
      console.log("set Is tables mission profile ...");
    }
  }, [state?.features, state?.owner]);
  console.log("state mission profile", state);
  let infos = [
    {
      title: "Status",
      value: (
        <div
          className={
            "flex items-center p-3   badge badge-outline badge-xs text-xs badge-" +
            STATUS?.mission[state?.mission?.datas?.status]?.color
          }
        >
          <Icon
            icon={STATUS?.mission[state?.mission?.datas?.status]?.icon}
            className="text-lg mr-4"
          />
          {STATUS?.mission[state?.mission?.datas?.status]?.status}
        </div>
      ),
    },
    {
      title: "Features",
      value: state?.mission?.datas?.features?.length,
    },
    {
      title: "Work slot",
      value:
        state?.mission?.datas?.features?.length -
        state?.mission?.datas?.workers,
    },
    {
      title: "Disputes",
      value: state?.mission?.datas?.disputes,
    },
    {
      title: "Total wadge",
      value: (
        <>
          <p className="flex items-center">
            <Icon icon={icfyETHER} className="text-white text-lg mr-1  " />
            <span>{state?.mission?.datas?.amount.toFixed(5)}</span>
            <span className="text-white c2  ml-1">ETH</span>
          </p>
        </>
      ),
    },
    {
      title: "Posts",
      value: state?.mission?.datas?.pubs?.length,
    },
    {
      title: "Domain",
      value: (
        <p className="flex items-center  capitalize">
          <Icon
            className={`mr-2 text-2xl text-${
              ENUMS.domain[state?.mission?.metadatas?.attributes?.[0]?.domain]
                ?.color
            }`}
            icon={
              ENUMS.domain[state?.mission?.metadatas?.attributes?.[0]?.domain]
                ?.icon
            }
          />
          {
            ENUMS.domain[state?.mission?.metadatas?.attributes?.[0]?.domain]
              ?.name
          }
        </p>
      ),
    },
    {
      title: "Technology",
      value: (
        <div className="w-full flex overflow-x-scroll h-full hide-scrollbar">
          {state?.mission?.badges?.map((el) => (
            <Icon icon={el?.badge} className="text-white c2 text-[24px] mr-4" />
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className="flex relative h-full">
      <MyCardInfos style={"w-1/3 mr-3"} arr={infos}></MyCardInfos>
      <MyCardInfo
        header={{
          title: state?.mission?.metadatas?.title,
          image: state?.mission?.metadatas?.image,
        }}
        color={1}
        styles={" w-full h-full  "}
        noBtn={true}
        main={{
          text: state?.mission?.metadatas?.description,
          title:
            ENUMS?.domain?.[state?.mission?.metadatas?.attributes?.[0]?.domain]
              ?.name,
        }}
      />

      {/* <div className="backdrop-blur w-full mt-2">
          <MyMenusTabs
            setter={setIsClicked}
            value={isClicked}
            arr={["Jobs", "Worker"]}
          />

          {isClicked === 0 ? (
            <>
              <MyTable list={isTables?.invites} head={["Job", "Worker"]} />
            </>
          ) : (
            <MyTable
              list={isTables?.features}
              head={HEAD_table_features}
              editBtns={MENUS_EDIT.feature}
            />
          )}
        </div> */}
    </div>
  );
};
