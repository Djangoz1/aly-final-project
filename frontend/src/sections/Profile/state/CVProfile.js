import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { Pub } from "components/Pub";

import { Avatar } from "components/profile/ProfileAvatar";

import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";

import {
  icfy,
  icfyCODE,
  icfyCODER,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfySEND,
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
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

export const CVProfile = ({}) => {
  let { state, pointer } = useToolsState();

  let setTabs = (index) => {
    doStateTools(
      dispatch,
      {
        ...state,
        indexers: { ...state?.indexers, profile: index },
      },
      pointer
    );
  };

  let dispatch = useToolsDispatch();
  const bools = (pub) => {
    if (
      state?.indexers?.profile === 0 ||
      state?.indexers?.profile === undefined ||
      (state?.indexers?.profile === 1 &&
        !pub?.metadata?.attributes?.[0]?.code) ||
      (state?.indexers?.profile === 2 && pub?.metadata?.attributes?.[0]?.code)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="flex w-full  bgprim relative">
        {state?.indexers?.profile <= 2 ||
        state?.indexers?.profile === undefined ? (
          <motion.div className="w-full  pb-20 c3 rounded-b-lg  flex relative flex-col     ">
            {state?.pubs?.length > 0 ? (
              state?.pubs?.map((pub, index) => (
                <Pub
                  _owner={state?.profile?.metadatas}
                  _pub={pub}
                  bools={bools}
                  styles={{ size: "10px", clamp: "none" }}
                  key={v4()}
                />
              ))
            ) : (
              <p className="text-center text-white/40 my-auto">No pubs found</p>
            )}
          </motion.div>
        ) : (
          <CreatePub
            style={"  c2  mb-4"}
            btn={<Icon icon={icfy?.msg?.chat} className="text-6xl m-2" />}
          />
        )}
      </div>
    </>
  );
};
