import { Icon } from "@iconify/react";
import { CVName } from "components/links/CVName";
import { MyAsset } from "components/myComponents/MyAsset";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { BtnGb1 } from "components/myComponents/btn/MyGradientButton";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import { icfy, icfyETHER, icfySEARCH, icfyTIME, icsystem } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateLaunchpad } from "utils/ui-tools/state-tools";
import { fromTimestamp } from "utils/ux-tools";
import { Avatar } from "components/profile/ProfileAvatar";
import { MyTabs } from "components/myComponents/MyTabs";
import { doStateFormPointer } from "context/form";
import {
  doPointerTools,
  doStateLaunchpadTools,
  doStateToolsRefresh,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyMenus, MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { Viewport } from "./MyViewport";
import { v4 } from "uuid";
import { MyLayoutApp } from "./MyLayoutApp";
import { MyLoader } from "./MyLoader";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { MyCardFolder } from "../card/MyCardFolder";
import { MySub } from "../text/MySub";
import { MyDashboard } from "./MyDashboad";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MENUS, menus_id } from "constants/menus";
import { Logo } from "components/Logo";
import { MyHeader } from "../MyHeader";
import { Header } from "sections/Layout/Header";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { MyLayoutHeader } from "./MyLayoutHeader";
import { useAccount } from "wagmi";
import { MyHeaderDashboard } from "sections/Layout/headers/MyHeaderDashboard";

export const MyLayoutDashboard = ({
  id,

  color,

  url,

  target,

  noMenu,
  refresh,
  _menus,
  template,
  initState,
  children,
  btn,
  isLoading,
}) => {
  let dispatch = useToolsDispatch();
  let authDispatch = useAuthDispatch();
  let { state, pointer } = useToolsState();
  let { metadatas, cv } = useAuthState();
  let { address } = useAccount();
  console.log("MyLayoutDashboard state", state);
  let menus = noMenu
    ? undefined
    : _menus
    ? _menus
    : id
    ? menus_id(target, id)
    : MENUS[target].page;

  useEffect(() => {
    if (refresh)
      doStateToolsRefresh({
        dispatch,
        func: () => {
          refresh();
          doAuthCV(authDispatch, address);
        },
      });
  }, []);

  let _url = url;

  return (
    <MyLayoutApp
      initState={initState}
      id={id}
      url={_url}
      background={false}
      target={target}
    >
      <>
        <div className="w-[16vw] pr-2     flex divide-y divide-white/10 flex-col h-screen fixed pt-3 top-[9vh] left-0 ">
          <MyMenus menus={menus} />
        </div>
        <>
          <div className="    relative  rounded-lg  2xl:w-[87%] w-[81%] flex flex-col-reverse ml-auto mr-5  ">
            {isLoading === false ? children : <MyLoader template={1} />}
          </div>

          {btn ? <div className="fixed bottom-5 right-5">{btn}</div> : <></>}
        </>
      </>
    </MyLayoutApp>
  );
};
