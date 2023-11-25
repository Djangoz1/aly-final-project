import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
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
import { icfy, icfyETHER, icfyTIME, icsystem } from "icones";
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

export const MyLayoutDashboard = ({
  id,
  setter,
  lists,
  side,
  price,
  color,
  statusObj,
  owner,
  url,
  allowed,
  target,
  header,
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
  let menus = noMenu
    ? undefined
    : _menus
    ? _menus
    : id
    ? menus_id(target, id)
    : MENUS[target].page;

  useEffect(() => {
    if (pointer === 0) {
      template = 0;
    }
  }, [pointer]);
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
      template={template}
      id={id}
      url={_url}
      target={target}
    >
      {template !== 2 &&
        template !== 0 &&
        menus
          ?.filter((el) => el?.title)
          ?.map(
            (el, i) =>
              el?.title !== undefined &&
              i < menus?.length - 1 && (
                <Viewport key={v4()} id={el?.title} index={i}></Viewport>
              )
          )}

      {template === 0 ? (
        <>
          <div className=" relative h-full flex w-full">
            <div className="  border-r-white/5  fixed left-0 bottom-0 flex  flex-col-reverse h-full w-[24%] bgprim">
              <div className="flex flex-col h-full overflow-y-scroll hide-scrollbar pb-20 w-full">
                {metadatas ? (
                  <MyLayoutHeader
                    cvID={cv}
                    username={metadatas?.username}
                    image={metadatas?.avatar}
                    target={"profile"}
                    statusObj={{
                      current: metadatas?.visibility ? 0 : 1,
                      to: metadatas?.visibility ? 1 : 0,
                    }}
                    allowed={true}
                    metadatas={metadatas}
                  >
                    <div className="flex w-full flex-wrap items-">
                      <MySub style={"items-center flex"}>
                        <Icon
                          className="text-lg mr-2"
                          icon={ENUMS?.domain[metadatas?.domain]?.icon}
                        />
                        {ENUMS?.domain[metadatas?.domain]?.name}
                      </MySub>
                    </div>
                  </MyLayoutHeader>
                ) : (
                  // <div className="flex bg-gradient-to-r pt-3 pb-10 from-white/5 to-transparent relative px-4 flex-col">
                  //   <div className="flex  mt-4 items-center">
                  //     <Avatar CID={metadatas?.image} />

                  //     <div className="flex ml-3 font-light c4 flex-col">
                  //       <CVName metadata={metadatas} styles={"text-lg c3"} />
                  //       <p className="mb-0 text-xs">{metadatas?.description}</p>
                  //       <p className="font-light  text-xs">
                  //         Créer le
                  //         <span className="ml-2 font-semibold">
                  //           {metadatas?.created}
                  //         </span>
                  //       </p>
                  //     </div>
                  //   </div>
                  //   <MyStatus
                  //     allowed={true}
                  //     refresh={refresh}
                  //     status={metadatas?.visibility ? 0 : 1}
                  //     toStatus={metadatas?.visibility ? 1 : 0}
                  //     padding={"px-2 py-1 "}
                  //     style={
                  //       "text-xs   mt-3 w-fit mb-2 h-fit rounded   font-bold "
                  //     }
                  //     target={"visibility"}
                  //   ></MyStatus>
                  //   <div className="flex w-full flex-wrap items-">
                  //     <MySub style={"items-center flex"}>
                  //       <Icon
                  //         className="text-lg mr-2"
                  //         icon={ENUMS?.domain[metadatas?.domain]?.icon}
                  //       />
                  //       {ENUMS?.domain[metadatas?.domain]?.name}
                  //     </MySub>
                  //   </div>
                  // </div>
                  <></>
                )}
                <MyMenus current={url} menus={menus} />
              </div>
              <div className=" relative">
                <Header />
              </div>
            </div>
            <div className="px-5 h-full w-[76%] ml-auto backdrop-blur">
              {isLoading === false ? children : <MyLoader template={1} />}
            </div>
            {btn ? <div className="fixed bottom-5 right-5">{btn}</div> : <></>}
          </div>
        </>
      ) : (
        <Viewport
          fixed={template !== 2 ? true : false}
          key={v4()}
          full={template === 2 ? true : undefined}
          background={template === 2 ? true : undefined}
          id={template === 2 ? 0 : menus?.[pointer]?.title}
          index={template === 2 ? 0 : menus?.length - 1}
        >
          {!isLoading ? (
            <>
              {
                [
                  /** Template 0  is managed differently */
                  <></>,
                  <MyDashboard
                    owner={owner}
                    target={target}
                    allowed={allowed}
                    side={side}
                    color={color}
                    menus={menus}
                    setter={setter}
                    statusObj={statusObj}
                    style={"h-full w-full overflow-hidden  my-5 mb-20"}
                    price={price}
                    btn={{
                      title: btn?.title,
                      info: btn?.info,
                      url: btn?.url,
                    }}

                    // arr={lists}
                  >
                    {pointer === 0 ? (
                      <div className="flex flex-col  c1 w-full  max-h-[60vh]  mb-auto ">
                        <div className="grid grid-cols-3 mt-10 grid-rows-2 gap-4">
                          {lists?.map((el, i) =>
                            el?.title ? (
                              <MyCardFolder
                                key={v4()}
                                image={el?.image || `/${el?.title}.png`}
                                title={el?.title}
                                url={el?.url}
                                color={i}
                              >
                                {el?.description}
                              </MyCardFolder>
                            ) : undefined
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col  c1 w-full  max-h-[60vh]  mb-auto ">
                        <div className="  rounded-0   hide-scrollbar overflow- h-full mb-2">
                          {children}
                        </div>
                      </div>
                    )}
                  </MyDashboard>,

                  <div className="w-full flex flex-col  h-full">
                    <div className="flex w-full relative">
                      {!noMenu ? (
                        <MyMenusTabs
                          style={"w-full"}
                          color={color || 1}
                          target={"title"}
                          arr={menus}
                          value={pointer}
                          setter={(index) => doPointerTools(dispatch, index)}
                        />
                      ) : undefined}
                      {statusObj ? (
                        <MyStatus
                          allowed={allowed}
                          refresh={refresh}
                          status={statusObj?.current}
                          toStatus={statusObj?.to}
                          style={
                            "text-xs  bg-black/20 backdrop-blur-2xl absolute top-0 right-0 rounded   font-bold "
                          }
                          target={target}
                        ></MyStatus>
                      ) : undefined}
                    </div>
                    <div className="h-full flex">
                      {side ? <div className="w-fit">{side} </div> : undefined}{" "}
                      {children}
                    </div>
                  </div>,
                  <div className="w-full h-full  ">{children} </div>,
                ][template || 0]
              }
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <MyLoader />
            </div>
          )}
        </Viewport>
      )}
    </MyLayoutApp>
  );
};
