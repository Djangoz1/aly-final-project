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
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { Viewport } from "./MyViewport";
import { v4 } from "uuid";
import { MyLayoutApp } from "./MyLayoutApp";
import { MyLoader } from "./MyLoader";

export const MyLayoutDashboard = ({
  id,
  setter,
  lists,
  side,
  price,
  color,
  statusObj,
  owner,
  allowed,
  target,
  header,
  refresh,
  menus,
  template,
  children,
  btn,
  isLoading,
}) => {
  let dispatch = useToolsDispatch();
  let { state, pointer } = useToolsState();

  let price1 = parseInt(price);
  let price2 = parseInt(parseFloat(price).toFixed(2).toString().split(".")[1]);
  let url = `/${target}/${id}`;

  return (
    <MyLayoutApp id={id} url={url} target={target}>
      {menus
        ?.filter((el) => el?.title)
        ?.map(
          (el, i) =>
            el?.title &&
            i < menus?.length - 1 && (
              <Viewport key={v4()} id={el?.title} index={i}>
                {console.log(menus)}
                {console.log(el)}
              </Viewport>
            )
        )}
      <Viewport
        fixed={true}
        key={v4()}
        id={menus?.[pointer]?.title}
        index={menus?.length - 1}
      >
        {!isLoading ? (
          [
            <MyCardList
              side={side ? <></> : undefined}
              color={color}
              setter={setter}
              icon={{ img: icsystem?.[target] }}
              style={"h-full w-full mx-5 my-5 mb-20"}
              price={
                <>
                  <span className="countdown">
                    <span
                      style={{
                        "--value": price1 || 0,
                      }}
                    ></span>
                    .
                    <span
                      style={{
                        "--value": price2 || 0,
                      }}
                    ></span>
                  </span>
                </>
              }
              url={url}
              btn={{
                title: btn?.title,
                info: btn?.info,
              }}
              head={{
                icon: icsystem?.[target],
                title: header || target,
                component: (
                  <div className="h-[8vh] min-w-[250px]">
                    <div className="absolute top-0 left-0 flex flex-col w-full">
                      <MyMenusTabs
                        style={"w-full"}
                        color={color || 1}
                        target={"title"}
                        arr={menus}
                        value={pointer}
                        setter={(index) => doStateFormPointer(dispatch, index)}
                      />

                      {side ? side : undefined}
                    </div>
                  </div>
                ),
              }}
              arr={lists}
            >
              <div className="flex flex-col  c1 w-full  max-h-[60vh]  mb-auto ">
                <div className="flex pb-3   w-full border justify-between bc1 border-b-2 border-t-0 border-x-0   items-start ">
                  <div className="flex items-center">
                    <Avatar CID={owner?.image} />

                    <div className="flex ml-3 flex-col">
                      <CVName metadata={owner} styles={"text-lg "} />
                      <p className="mb-0 text-xs">{owner?.description}</p>
                      <p className="font-light text-black text-xs">
                        Créer le
                        <span className="ml-2 font-semibold">
                          {fromTimestamp(
                            parseInt(owner?.attributes?.[0]?.createdAt)
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <MyStatus
                    allowed={allowed}
                    refresh={refresh}
                    status={statusObj?.current}
                    toStatus={statusObj?.to}
                    style={
                      "text-xs  bg-black/20 backdrop-blur-2xl  rounded   font-bold "
                    }
                    target={target}
                  ></MyStatus>
                </div>
                {children ? (
                  <div className="  rounded-0   hide-scrollbar overflow- h-full mb-2">
                    {children}
                  </div>
                ) : (
                  <>
                    <h6 className="font-bold uppercase  mb-4 underline">
                      Description
                    </h6>
                    <article className="text-xs  hover:text-black my-3 text-justify whitespace-break-spaces font-light">
                      {state?.[target]?.metadatas?.description}
                    </article>
                  </>
                )}
              </div>
            </MyCardList>,
            <div className="w-full flex flex-col  h-full">
              <div className="flex w-full relative">
                <MyMenusTabs
                  style={"w-full"}
                  color={color || 1}
                  target={"title"}
                  arr={menus}
                  value={pointer}
                  setter={(index) => doStateFormPointer(dispatch, index)}
                />
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
          ][template || 0]
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <MyLoader />
          </div>
        )}
      </Viewport>
    </MyLayoutApp>
  );
};
