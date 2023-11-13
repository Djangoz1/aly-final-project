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

  console.log("state cvProfile", state);
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
              value={state?.indexers?.profile || 0}
              setter={(i) => setTabs(i)}
              arr={[
                { value: "All", icon: icfy.ux.plus },
                { value: "Posts", icon: icfy.msg.opened },
                { value: "Codes", icon: icfyCODE },
                { value: "Publish", icon: icfy.msg.chat },
              ]}
            />

            {state?.indexers?.profile <= 2 ||
            state?.indexers?.profile === undefined ? (
              <motion.div className="w-full bgprim c3 rounded-b-lg  flex relative flex-col     overflow-y-scroll hide-scrollbar">
                <MyMainBtn
                  setter={() => setTabs(3)}
                  padding={"px-4 py-1"}
                  template={1}
                  url={"#section1"}
                  icon={icfySEND}
                  style={"top-2 absolute btn-xs right-2"}
                  color={1}
                >
                  Publish
                </MyMainBtn>
                {/* //!Moock local. To delete */}
                <Pub
                  _owner={{ username: "Django" }}
                  _pub={{
                    metadata: {
                      description: (
                        <>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Error odit repudiandae, itaque ducimus accusamus
                          quasi corrupti quisquam quia optio soluta et libero
                          perferendis nemo vitae deleniti sapiente adipisci eos.
                          Recusandae.
                        </>
                      ),
                    },
                  }}
                  id={1}
                  styles={{ size: "10px", clamp: "none" }}
                  key={v4()}
                />
                {/* //!Moock local. To delete */}
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
