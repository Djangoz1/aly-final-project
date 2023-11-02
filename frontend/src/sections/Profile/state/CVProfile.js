import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { Pub } from "components/Pub";

import { Avatar } from "components/profile/ProfileAvatar";

import { useToolsState } from "context/tools";

import {
  icfy,
  icfyCODE,
  icfyCODER,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfyTWITTER,
} from "icones";

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
import { BtnsSocial } from "components/btn/BtnsSocial";
import { CreatePub } from "sections/Pub/form/create/CreatePub";

export const CVProfile = ({}) => {
  let { state, pointer } = useToolsState();

  let [isTabs, setIsTabs] = useState(0);
  let [isAllowed, setIsAllowed] = useState(null);
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

  useEffect(() => {}, [isTabs]);
  const divRef = useRef(null);

  return (
    <>
      <div className="flex w-full h-full relative flex-col">
        <div className="flex   relative h-full   overflow-scroll hide-scrollbar  flex-wrap ">
          <div className="flex w-full h-full">
            <MyMenusTabs
              template={1}
              style={"  w-1/6 bg-white/5 backdrop-blur-[1px] "}
              color={8}
              target={"value"}
              value={isTabs}
              setter={setIsTabs}
              arr={[
                { value: "All", icon: icfy.ux.plus },
                { value: "Posts", icon: icfy.msg.opened },
                { value: "Codes", icon: icfyCODE },
                { value: "Publish", icon: icfy.msg.chat },
              ]}
            />

            {isTabs <= 2 ? (
              <motion.div className="w-full bgprim c3 rounded-b-lg  flex flex-col     overflow-y-scroll hide-scrollbar">
                {state?.pubs?.length > 0 ? (
                  state?.pubs?.map((pub, index) => (
                    <Pub
                      _owner={state?.profile?.metadatas}
                      id={pub}
                      bools={bools}
                      styles={{ size: "10px", clamp: "none" }}
                      key={v4()}
                    />
                  ))
                ) : (
                  <p className="text-center text-white/40 my-auto">
                    No pubs found
                  </p>
                )}
              </motion.div>
            ) : (
              <CreatePub
                style={"  c2  mb-4"}
                btn={<Icon icon={icfy?.msg?.chat} className="text-6xl m-2" />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
