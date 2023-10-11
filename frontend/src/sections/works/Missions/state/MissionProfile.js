import { AssetProfile } from "components/assets/AssetProfile";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyTable } from "components/myComponents/table/MyTable";
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
  return (
    <div className="flex relative flex-col">
      <div className="flex flex-wrap">
        <MyCardInfo
          header={{
            title: state?.mission?.metadatas?.title,
            image: state?.mission?.metadatas?.image,
          }}
          color={1}
          styles={" w-[69%]  h-[30vh] mr-[.6%]  "}
          noBtn={true}
          main={{
            text: state?.mission?.metadatas?.description,
            title:
              ENUMS?.domain?.[
                state?.mission?.metadatas?.attributes?.[0]?.domain
              ]?.name,
          }}
        />
        <AssetProfile
          style={"w-[30.4%]   "}
          noBtn={true}
          cvID={state?.mission?.datas?.owner}
          target={"owner"}
        />
        <div className="tabs tabs-boxed w-full backdrop-blur  my-1">
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
        </MyCard1>
      </div>
    </div>
  );
};
