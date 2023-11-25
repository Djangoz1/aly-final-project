import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { LogoIc } from "components/Logo";
import { Pub } from "components/Pub";
import { Avatar } from "components/profile/ProfileAvatar";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfy, icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect, useRef } from "react";
import { stateCV, stateDetailsCV, statePub } from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const MissionPubs = () => {
  let { state } = useToolsState();

  let ref = useRef(null);

  return (
    <>
      <div className="flex w-full   relative flex-col">
        <div className="flex     relative border border-1 border-white/10   flex-col ">
          <div className="relative  flex items-end justify-between    w-full h-[26vh]">
            <div className="overflow-hidden rounded-xl h-[26vh] absolute w-full">
              <ImagePin
                CID={state?.mission?.metadatas?.attributes?.[0]?.banniere}
                style={"w-full z-0 top-0 absolute opacity-80"}
              />
            </div>
            <div className="z-1 relative px-5 py-5  flex flex-col">
              <Avatar CID={state?.mission?.metadatas?.image} />
              <h6 className="text-white text-lg">
                {state?.mission?.metadatas?.title}
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
          <div
            className={`rounded-lg w-full  flex backdrop-blur-2xl items-center  my-2 `}
          >
            {/* <MyMenusTabs
              value={isTabs}
              setter={setIsTabs}
              arr={["All", "Posts", "Codes"]}
            /> */}

            <div
              className={`  badge badge-xs py-3  px-5 mr-5 whitespace-nowrap badge-outline badge-success`}
            >
              <Icon icon={icfy.msg.chat} className="mr-2 text-lg" />{" "}
              {state?.pubs?.length} Pubs
            </div>
          </div>
          <div
            ref={ref}
            className="w-full   rounded-lg backdrop-blur   flex flex-col     overflow-y-scroll hide-scrollbar"
          >
            {state?.pubs?.length > 0 ? (
              state?.pubs
                ?.reverse()
                ?.map((el) => (
                  <Pub
                    styles={{ clamp: "3", size: "10px" }}
                    _pub={el}
                    _owner={el?.owner?.metadatas}
                    key={v4()}
                  />
                ))
            ) : (
              <p className="text-center text-white/40 my-auto">No pubs found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
