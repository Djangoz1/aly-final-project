import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";

import { MyCardList } from "components/myComponents/card/MyCardList";

import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";

import { icfy, icsystem } from "icones";

import { fromTimestamp } from "utils/ux-tools";
import { Avatar } from "components/profile/ProfileAvatar";

import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { _apiPost } from "utils/ui-tools/web3-tools";

import { MySub } from "../text/MySub";

export const MyDashboard = ({
  setter,
  side,
  price,
  color,
  statusObj,
  owner,
  allowed,
  target,
  refresh,
  menus,
  children,
  btn,
}) => {
  let dispatch = useToolsDispatch();
  let { state, pointer } = useToolsState();

  let price1 = parseInt(price);
  let price2 = parseInt(parseFloat(price).toFixed(2).toString().split(".")[1]);

  return (
    <>
      <MyCardList
        side={side ? <></> : undefined}
        color={color}
        setter={setter}
        icon={{ img: icsystem?.[target] }}
        style={"h-full w-full rounded-xl  overflow-hidden mx-5 my-5 mb-20"}
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
        url={btn?.url}
        btn={{
          title: btn?.title,
          info: btn?.info,
        }}
        head={{
          icon: icsystem?.[target],
          title:
            (
              <div className="flex bg-gradient-to-r py-10 from-white/5 to-transparent relative pl-5 pr-20 flex-col">
                <div className="flex  items-center">
                  <Avatar CID={owner?.image} />

                  <div className="flex ml-3 font-light c4 flex-col">
                    <CVName metadata={owner} styles={"text-lg c3"} />
                    <p className="mb-0 text-xs">{owner?.description}</p>
                    <p className="font-light  text-xs">
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
                  padding={"px-2 py-1 "}
                  style={"text-xs   mt-3 w-fit mb-2 h-fit rounded   font-bold "}
                  target={target}
                ></MyStatus>
                <div className="flex w-full flex-wrap items-">
                  <MySub style={"items-center flex"}>
                    <Icon
                      className="text-lg mr-2"
                      icon={ENUMS?.domain[owner?.attributes?.[0]?.domain]?.icon}
                    />
                    {ENUMS?.domain[owner?.attributes?.[0]?.domain]?.name}
                  </MySub>
                </div>
              </div>
            ) || target,
          component: (
            <div className="  flex overflow-scroll hide-scrollbar flex-col h-full w-full">
              <MyMenusTabs
                template={1}
                style={"w-full "}
                color={color || 8}
                target={"title"}
                arr={menus}
                value={pointer}
                setter={(index) => doPointerTools(dispatch, index)}
              />

              {side ? side : undefined}
            </div>
          ),
        }}
        // arr={lists}
      >
        {children}
      </MyCardList>
    </>
  );
};
