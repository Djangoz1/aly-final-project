"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyETHER,
  icfyMAIL,
  icfySEARCH,
  icfySEND,
  icsystem,
} from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { CVProfile } from "sections/Profile/state/CVProfile";
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
import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { MyForm } from "components/myComponents/form/MyForm";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { controllers } from "utils/controllers";
import { ChatBubble } from "components/ChatBubble";

function App({ params }) {
  const { cv, metadatas } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();
  let refresh = async () => {
    doStateToolsProfile({ dispatch, state, cvID, target: "messages" });
    setIsMessages(
      await controllers.get.message.list({
        userID: metadatas.id,
        expand: "receiverID",
        receiverID: state?.messages?.followers?.[selectedID]?.followID,
      })
    );
  };
  let [selectedID, setSelectedID] = useState(null);

  let [isMessages, setIsMessages] = useState(null);

  return (
    <LayoutProfile
      controller={"messages"}
      cvID={cvID}
      target={"profile"}
      url={"/messages"}
    >
      <LayoutForm
        stateInit={{
          allowed: true,
          placeholders: {
            search: "Search ...",
            message: "What's your message ?",
          },
          form: {
            target: "message",
            search: null,
            message: null,
          },
        }}
      >
        <div className="flex w-full">
          <div className="min-h-screen w-full px-2  border-x border-white/5 flex flex-col">
            {isMessages?.reverse()?.map((el) => (
              <ChatBubble
                color={4}
                style={"text-xs"}
                footer={el?.created}
                name={
                  el?.senderID === metadatas?.id
                    ? metadatas?.username
                    : "L'autre (to do)"
                }
                key={v4()}
                image={""}
              >
                {el?.message}
              </ChatBubble>
            ))}
            <MyInput
              label={false}
              setter={async (value) => {
                console.log(state?.messages?.followers?.[selectedID]?.followID);
                await controllers.create.message({
                  senderID: metadatas?.id,
                  receiverID:
                    state?.messages?.followers?.[selectedID]?.followID,
                  message: value,
                });
                refresh();
              }}
              styles={"w-full mb-3 mt-auto"}
              target={"message"}
            ></MyInput>
          </div>
          <div className="ml-auto mt-3 w-2/6">
            <MyInput
              icon={icfySEARCH}
              label={false}
              target={"search"}
            ></MyInput>

            {state?.messages?.followers?.map((el, i) => (
              <button
                onClick={async () => {
                  console.log("wsh", i);
                  setSelectedID(selectedID === i ? null : i);
                  setIsMessages(
                    await controllers.get.message.list({
                      userID: metadatas.id,
                      receiverID: state?.messages?.followers?.[i]?.followID,
                      expand: "receiverID",
                    })
                  );
                }}
                className={` px-4 w-full  py-3  border-white/5 border border-x-white/0 ${
                  selectedID === i
                    ? "bg3 c1"
                    : "bg-white/5 hover:bg-white/10 c4 hover:text-white"
                }`}
              >
                <ProfileAvatar metadatas={el?.["@expand"]?.followID} />
              </button>
            ))}
          </div>
        </div>
      </LayoutForm>
    </LayoutProfile>
  );
}

export default App;
