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
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { MyCardFolder } from "../card/MyCardFolder";
import { MySub } from "../text/MySub";
import { MyDashboard } from "../card/MyDashboad";
import { AssetProfile1 } from "components/assets/AssetProfile";

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
  menus = [
    {
      title: "Overview",
      url: "#section0",
      icon: icfy.ux.checkList,
    },
    ...menus,
  ];
  useEffect(() => {
    if (pointer === 0) {
      template = 0;
    }
  }, [pointer]);

  let url = `/${target}/${id}`;

  return (
    <MyLayoutApp id={id} url={url} target={target}>
      {menus
        ?.filter((el) => el?.title)
        ?.map(
          (el, i) =>
            el?.title !== undefined &&
            i < menus?.length - 1 && (
              <Viewport key={v4()} id={el?.title} index={i}></Viewport>
            )
        )}

      <Viewport
        fixed={true}
        key={v4()}
        id={menus?.[pointer]?.title}
        index={menus?.length - 1}
      >
        {!isLoading ? (
          <>
            {
              [
                <MyDashboard
                  owner={owner}
                  target={target}
                  allowed={allowed}
                  side={side}
                  color={color}
                  menus={menus}
                  setter={setter}
                  statusObj={statusObj}
                  style={"h-full w-full overflow-hidden mx-5 my-5 mb-20"}
                  price={price}
                  btn={{
                    title: btn?.title,
                    info: btn?.info,
                  }}

                  // arr={lists}
                >
                  {pointer === 0 ? (
                    <div className="flex flex-col  c1 w-full  max-h-[60vh]  mb-auto ">
                      <div className="grid grid-cols-3 mt-10 grid-rows-2 gap-4">
                        {lists?.map((el, i) => (
                          <MyCardFolder
                            key={v4()}
                            image={el?.image || `/${el?.title}.png`}
                            title={el?.title}
                            url={el?.url}
                            color={i}
                          >
                            {el?.description}
                          </MyCardFolder>
                        ))}
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
                    <MyMenusTabs
                      style={"w-full"}
                      color={color || 1}
                      target={"title"}
                      arr={menus}
                      value={pointer}
                      setter={(index) => doPointerTools(dispatch, index)}
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
            }
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <MyLoader />
          </div>
        )}
      </Viewport>
    </MyLayoutApp>
  );
};
