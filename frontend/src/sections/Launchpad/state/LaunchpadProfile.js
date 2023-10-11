import { AssetProfile } from "components/assets/AssetProfile";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyTable } from "components/myComponents/table/MyTable";
import { Hg, Hg0, Hg1 } from "components/text/HeroGradient";
import { ENUMS } from "constants/enums";
import { MENUS_EDIT } from "constants/menus";
import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

export const LaunchpadProfile = ({ missionID }) => {
  let { state, pointer } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);

  let [isTables, setIsTables] = useState(null);

  console.log(state);
  return (
    <div className="flex relative mt-auto justify-end flex-col">
      <div className="flex items-end">
        <Hg0 style="font1 text-[84px]">
          {state?.launchpad?.metadatas?.title}
        </Hg0>
        {/* {state?.launchpad?.metadatas?.description} */}

        {/* <div className="tabs tabs-boxed w-full backdrop-blur  my-1">
          <button
            onClick={() => setIsClicked(0)}
            className={`  tab mr-5 btn-xs ${
              isClicked === 0 ? "bg1 text-white" : " "
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setIsClicked(1)}
            className={`  tab mr-5 btn-xs ${
              isClicked === 1 ? "bg1 text-white" : " "
            }`}
          >
            Worker
          </button>
        </div>
        <MyCard1 color={1} styles={"w-full h-[50vh] "}>
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
        </MyCard1> */}
      </div>
    </div>
  );
};
