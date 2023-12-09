"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyCODE,
  icfyETHER,
  icfyMAIL,
  icfySEND,
  icfyTIME,
  icsystem,
} from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Form/forms/edit/EditProfile";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
  MyMenusTabs,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { doStateFormPointer } from "context/form";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { STATUS } from "constants/status";

import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { MySub } from "components/myComponents/text/MySub";
import { LayoutLaunchpad } from "sections/Layout/layouts/LayoutLaunchpad";
import { ethers } from "ethers";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";
import { StateLaunchpadForm } from "sections/Launchpad/state/StateLaunchpadForm";
import { Logo } from "components/Logo";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const launchpadID = params.launchpadID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutLaunchpad
      controller={"overview"}
      launchpadID={launchpadID}
      refresh={() => doStateLaunchpadTools({ dispatch, launchpadID })}
      url={"/informations"}
    >
      <>
        <h6 className="font-bold uppercase  mb-4 underline">Description</h6>

        <article className="text-xs   my-3 text-justify whitespace-break-spaces font-light">
          {state?.launchpad?.metadatas?.description}
        </article>
      </>

      <StateLaunchpadInfos />
    </LayoutLaunchpad>
  );
}

export default App;
