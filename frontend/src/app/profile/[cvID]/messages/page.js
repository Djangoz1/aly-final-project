"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { icfy, icfySEARCH } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { controllers } from "utils/controllers";
import { ChatBubble } from "components/ChatBubble";
import { MyCard } from "components/myComponents/card/MyCard";
import { parseTimestamp } from "helpers";
import { NoItems } from "components/myComponents/layout/NoItems";

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
  function filterUniqueById(messages) {
    let lists = [];
    return messages?.filter((message) => {
      if (message?.senderID !== state?.profile?.metadatas?.id) {
        if (!lists.includes(message?.senderID)) {
          lists.push(message?.senderID);
          return true;
        }
      } else if (message?.senderID === state?.profile?.metadatas?.id) {
        if (!lists?.includes(message?.receiverID)) {
          lists.push(message?.receiverID);
          return true;
        }
      } else {
        return false;
      }
    });
  }

  console.log(
    "je voeux testre",
    state?.messages?.lists?.filter(
      (el) =>
        (el?.senderID === metadatas?.id &&
          el?.receiverID ===
            filterUniqueById(state?.messages?.lists)?.[selectedID]
              ?.receiverID) ||
        (el?.receiverID === metadatas?.id &&
          el?.senderID ===
            filterUniqueById(state?.messages?.lists)?.[selectedID]?.senderID)
    )
  );
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
        <div className="w-full h-screen flex relative">
          <MyCard
            template={3}
            styles=" flex h-full  min-w-fit w-[20vw] flex-col overflow-y-scroll  transition-transform duration-500 ease-out   rounded-none"
          >
            {/* <!-- Main Navigation --> */}
            <div className="grow space-y-2  pt-2">
              <MyInput
                target={"search"}
                label={false}
                icon={icfySEARCH}
                styles={"w-full"}
              />
              {filterUniqueById(state?.messages?.lists)?.map((el, i) => (
                <a
                  key={v4()}
                  onClick={() => setSelectedID(i)}
                  href="javascript:void(0)"
                  className={`flex items-center px-3 gap-3 ${
                    selectedID === i
                      ? " border-lime-500 bg3  c1"
                      : "c4 hover:bg-white/20"
                  } px-3 relative py-4 shadow-sm w-full ltr:rounded-l ltr:border-l-4  rtl:rounded-r rtl:border-r-4`}
                >
                  <div className="relative flex-none">
                    <Avatar
                      style={"h-11 w-11"}
                      CID={
                        el?.["@expand"]?.receiverID?.avatar ||
                        el?.["@expand"]?.senderID?.avatar
                      }
                      metadatas={
                        el?.["@expand"]?.receiverID || el?.["@expand"]?.senderID
                      }
                    />
                    <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></span>
                  </div>
                  <div className="grow">
                    <p className="mb-0.5 line-clamp-1 text-sm font-bold ">
                      {el?.["@expand"]?.["receiverID" || "senderID"]?.username}
                    </p>
                    <p className="line-clamp-1 text-xs font-medium text-slate-500">
                      {el?.["@expand"]?.["receiverID" || "senderID"]?.email}
                    </p>
                  </div>

                  <p className="absolute top-2 right-2 text-[10px] font-medium text-slate-400">
                    {parseTimestamp(el?.created)}
                  </p>
                </a>
              ))}
            </div>
            {/* <!-- END Main Navigation --> */}
          </MyCard>
          {/* <!-- Page Sidebar --> */}
          {state?.messages?.lists?.length > 0 ? (
            <div
              x-data="{ mobileSidebarOpen: false }"
              className="flex-auto bgprim  relative"
            >
              {/* <!-- Page Container --> */}
              <div
                id="page-container"
                className="relative space-y-6 px-4 pt-24 lg:p-8 pb-40  w-full overflow-y-auto  h-screen"
              >
                {/* <!-- Page Content --> */}

                <div className=" mx-auto xl:max-w-7xl">
                  {/* <!-- Datetime Header --> */}
                  <div className="my-3 flex items-center">
                    <span
                      aria-hidden="true"
                      className="h-0.5 grow rounded bg-slate-50/5"
                    ></span>
                    <span className="rounded-full bg-slate-100/5 px-3 py-1 text-xs font-semibold text-slate-500">
                      Monday 14:26
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-0.5 grow rounded bg-slate-50/5"
                    ></span>
                  </div>
                  {/* <!-- END Datetime Header --> */}

                  {/* <!-- Messages Received --> */}
                  <div className="flex w-full  flex-col items-start ">
                    {state?.messages?.lists
                      ?.filter(
                        (el) =>
                          (el?.senderID === metadatas?.id &&
                            el?.receiverID ===
                              filterUniqueById(state?.messages?.lists)?.[
                                selectedID
                              ]?.receiverID) ||
                          (el?.receiverID === metadatas?.id &&
                            el?.senderID ===
                              filterUniqueById(state?.messages?.lists)?.[
                                selectedID
                              ]?.senderID)
                      )
                      ?.map((el) => (
                        <div
                          key={v4()}
                          className={` w-full flex ${
                            el?.senderID === metadatas?.id ? "" : " justify-end"
                          } `}
                        >
                          <div
                            CID={false}
                            color={el?.senderID === metadatas?.id ? 0 : 4}
                            className={`rounded-lg px-5 max-w-1/3 py-3 mb-2  ${
                              el?.senderID === metadatas?.id
                                ? "bg-neutral"
                                : "  bg-info"
                            } `}
                          >
                            {el?.message}
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* <!-- END  Messages Received --> */}

                  {/* <!-- END Datetime Header --> */}
                </div>
              </div>
              <footer className="absolute bg-white/20 rounded-lg bottom-[10vh] end-3 start-3 ">
                <MyInput
                  label={false}
                  setter={async (value) => {
                    await controllers.create.message({
                      senderID: metadatas?.id,
                      receiverID:
                        filterUniqueById(state?.messages?.lists)?.[selectedID]
                          ?.receiverID === metadatas?.id
                          ? filterUniqueById(state?.messages?.lists)?.[
                              selectedID
                            ]?.senderID
                          : filterUniqueById(state?.messages?.lists)?.[
                              selectedID
                            ]?.receiverID,
                      message: value,
                    });
                  }}
                  styles={"w-full  mt-auto"}
                  target={"message"}
                ></MyInput>
              </footer>
              {/* <!-- END Page Container --> */}
            </div>
          ) : (
            <NoItems
              target={"messages"}
              style={"h-3/4 "}
              icon={icfy.msg.casual}
            />
          )}
        </div>
      </LayoutForm>
    </LayoutProfile>
  );
}

export default App;
