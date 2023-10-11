import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { Pub } from "components/Pub";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyTable } from "components/myComponents/table/MyTable";
import { Avatar } from "components/profile/ProfileAvatar";
import { ENUMS } from "constants/enums";
import { MENUS_EDIT } from "constants/menus";
import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfy, icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect, useRef, useState } from "react";
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";
import { v4 } from "uuid";

export const CVProfile = ({ cvID }) => {
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
        <div className="relative  flex items-end justify-between    w-full h-[26vh]">
          <div className="overflow-hidden rounded-xl h-[26vh] absolute w-full">
            <ImagePin
              CID={state?.owner?.metadatas?.attributes?.[0]?.banniere}
              style={"w-full z-0 top-0 absolute opacity-80"}
            />
          </div>
          <div className="z-1 relative px-5 py-5  flex flex-col">
            <Avatar CID={state?.owner?.metadatas?.image} />
            <h6 className="text-white text-lg">
              {state?.owner?.metadatas?.username}
            </h6>
            <span className="text-white text-xs">
              {state?.owner?.metadatas?.description}
            </span>
          </div>
          <div className="absolute right-1  -bottom-1 flex ml-auto -mt-10 z-1">
            <Icon icon={icfyFB} className="text-2xl mr-3" />
            <Icon icon={icfyGITHUB2} className="text-2xl mr-3" />
            <Icon icon={icfyLINKEDIN} className="text-2xl mr-3" />
            <Icon icon={icfyTWITTER} className="text-2xl  " />
          </div>
        </div>

        <div className="rounded-lg w-full backdrop-blur  my-1">
          <div
            className={`  badge badge-xs py-3 my-2 ml-3  px-5 mr-5 badge-outline badge-info`}
          >
            <Icon icon={icfy?.person?.friend} className="mr-2 text-lg" />{" "}
            {state?.owner?.datas?.followers} Followers
          </div>
          <div
            className={`  badge badge-xs py-3 px-5 mr-5 badge-outline badge-success`}
          >
            <Icon icon={icfy.msg.chat} className="mr-2 text-lg" />{" "}
            {state?.owner?.datas?.pubs} Pubs
          </div>
        </div>

        <div className="w-full  rounded-lg backdrop-blur  flex flex-col  h-[55vh]  overflow-y-scroll hide-scrollbar">
          {state?.pubs?.length > 0 ? (
            state?.pubs?.map((pubID, index) => (
              <Pub
                _owner={state?.owner?.metadatas}
                id={pubID}
                styles={{ size: "10px", clamp: "none" }}
                key={v4()}
              />
            ))
          ) : (
            <p className="text-center text-white/40 my-auto">No pubs found</p>
          )}
        </div>
        {/* {isClicked === 0 ? (
            <>
              <MyTable list={isTables?.invites} head={["Job", "Worker"]} />
            </>
          ) : (
            <MyTable
              list={isTables?.features}
              head={HEAD_table_features}
              editBtns={MENUS_EDIT.feature}
            />
          )} */}
      </div>
    </div>
  );
};
