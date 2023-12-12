"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateToolsLaunchpad,
  doStateToolsMission,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { icfy } from "icones";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { MENUS } from "constants/menus";

import { MyLayoutBtn } from "components/myComponents/btn/MyLayoutBtn";
import { StateLaunchpadForm } from "sections/Launchpad/state/StateLaunchpadForm";

export const LayoutLaunchpad = ({ launchpadID, url, children, controller }) => {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  const tools = useToolsState();
  console.log("tools laout", tools);

  let [isLoading, setIsLoading] = useState(null);

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let _state = await doStateToolsLaunchpad({
      dispatch,
      state,
      launchpadID,
      target: controller,
    });

    setIsLoading(false);
  };
  useEffect(() => {
    if (isLoading === null || status === "idle" || status === "reload") {
      fetch();
      console.log("Origin fetch is datas cv");
    }
  }, [launchpadID, status]);
  //   doStateProfileTools;

  if (state?.mission?.datas?.launchpad == 0) {
    MENUS.mission.page[1].sub[6] = undefined;
  }

  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      template={0}
      id={launchpadID}
      btn={<Button controller={controller}></Button>}
      refresh={() =>
        doStateToolsLaunchpad({
          dispatch,
          launchpadID,
          target: controller,
          state,
        })
      }
      owner={state?.owner?.metadatas}
      price={state?.profile?.datas?.amount}
      allowed={cv == state?.owner?.cvID}
      statusObj={{
        current: state?.launchpad?.datas?.status,
        // to: state?.mission?.datas?.status + 1,
      }}
      header={state?.profile?.metadatas?.username}
      target={"launchpad"}
      url={`/launchpad/${launchpadID}${url}`}
    >
      <div className="bgprim pb-20 min-h-screen w-full">{children}</div>
    </MyLayoutDashboard>
  );
};

let Button = ({ controller, target, launchpadID }) => {
  let { cv, datas, metadatas } = useAuthState();
  let dispatch = useToolsDispatch();
  let { state } = useToolsState();

  let follow = state?.mission?.details?.social?.followers?.filter(
    (el) => el?.followerID == metadatas?.id
  );

  return (
    <MyLayoutBtn
      btns={[
        {
          icon: icfy.msg.post,
          title: "Post",
          text: "Share a post on launchpad profile about what happening, feedback,issue, ...",
        },
        {
          icon: icfy.msg.opened,
          title: "Message",
          text: "Send a direct message to owner of launchpad",
        },

        state?.launchpad?.datas?.status === 1 &&
          state?.launchpad?.datas.saleStart < Math.floor(Date.now() / 1000) && {
            icon: icfy.bank.dollars,
            title: "Invest",
            text: "Invest and help project to launch via our protocoles and receive token ERC20",
          },
      ]}
      modals={[
        <CreatePub
          refresh={() =>
            doStateToolsMission({
              dispatch,
              state,
              launchpadID: state?.mission?.launchpadID,
              target: "pubs",
            })
          }
          style={"border-r-white/5 bg-white/10"}
        />,
        <></>,
        <StateLaunchpadForm />,
      ]}
    ></MyLayoutBtn>
  );
};
