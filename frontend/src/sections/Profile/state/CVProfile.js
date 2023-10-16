import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { Pub } from "components/Pub";

import { Avatar } from "components/profile/ProfileAvatar";

import { useToolsState } from "context/tools";

import { icfy, icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";

import React, { useEffect, useRef, useState } from "react";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";
import { v4 } from "uuid";

import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";

export const CVProfile = ({ cvID }) => {
  let { state, pointer } = useToolsState();

  let [isTabs, setIsTabs] = useState(0);

  const bools = (pub) => {
    if (
      isTabs === 0 ||
      (isTabs === 1 && !pub?.metadata?.attributes?.[0]?.code) ||
      (isTabs === 2 && pub?.metadata?.attributes?.[0]?.code)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const divRef = useRef(null);

  return (
    <div className="flex w-full  relative flex-col">
      <div className="flex  h-[80vh] relative border border-1 border-white/10 overflow-scroll hide-scrollbar  flex-wrap ">
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

        <motion.div
          ref={divRef}
          className={`rounded-lg w-full  flex backdrop-blur-2xl items-center  my-2 `}
        >
          <MyMenusTabs
            value={isTabs}
            setter={setIsTabs}
            arr={["All", "Posts", "Codes"]}
          />
          <div
            className={`  badge badge-xs py-3  ml-3  px-5 whitespace-nowrap mr-5 badge-outline badge-info`}
          >
            <Icon icon={icfy?.person?.friend} className="mr-2 text-lg" />{" "}
            {state?.owner?.datas?.followers} Followers
          </div>
          <div
            className={`  badge badge-xs py-3  px-5 mr-5 whitespace-nowrap badge-outline badge-success`}
          >
            <Icon icon={icfy.msg.chat} className="mr-2 text-lg" />{" "}
            {state?.owner?.datas?.pubs} Pubs
          </div>
        </motion.div>

        <motion.div className="w-full  rounded-lg backdrop-blur   flex flex-col     overflow-y-scroll hide-scrollbar">
          {state?.pubs?.length > 0 ? (
            state?.pubs?.map(
              (pub, index) =>
                bools(pub) && (
                  <Pub
                    _owner={state?.owner?.metadatas}
                    id={pub?.pubID}
                    _pub={pub}
                    styles={{ size: "10px", clamp: "none" }}
                    key={v4()}
                  />
                )
            )
          ) : (
            <p className="text-center text-white/40 my-auto">No pubs found</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
