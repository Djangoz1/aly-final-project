"use client";

import { icfy, icfyLOCK, icfySEARCH, icfyUNLOCK, icsystem } from "icones";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { useAccount } from "wagmi";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { ENUMS } from "constants/enums";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";

import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import {
  doPointerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";

import { useAuthState } from "context/auth";
import { controllers } from "utils/controllers";

import { AssetLaunchpad } from "components/assets/AssetLaunchpad";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { LaunchpadName } from "components/links/LaunchpadName";
import { CVName } from "components/links/CVName";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyBadge } from "components/myComponents/box/MyList";
import { MyCountdown, MyTimer } from "components/myComponents/MyCountdown";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
export default function PageSearch({ params }) {
  let [isLoading, setIsLoading] = useState(null);
  let { metadatas } = useAuthState();
  let { state, pointer } = useToolsState();
  let dispatch = useToolsDispatch();

  let loadState = async () =>
    doStateTools(dispatch, {
      lists: await controllers.get.launchpad.list({ filter: "" }),
    });
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadState();
      setIsLoading(false);
    })();
  }, []);

  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      color={2}
      refresh={loadState}
      target={"search"}
      owner={metadatas}
      url={"/search/launchpads"}
      template={0}
    >
      <Page />
    </MyLayoutDashboard>
  );
}

let Page = () => {
  let { pointer, state } = useToolsState();
  let [isExtend, setIsExtend] = useState(null);
  let dispatch = useToolsDispatch();

  let [isCourt, setIsCourt] = useState(0);
  let [isDomain, setIsDomain] = useState(null);
  let [isInvite, setIsInvite] = useState(0);
  let [isStarted, setIsStarted] = useState(0);

  let setterMenu = (index) => {
    // setIsPointer(index);
    doPointerTools(dispatch, index);
    setIsCourt(0);
    setIsInvite(0);
    setIsStarted(0);
    setIsDomain(0);
  };
  return (
    <>
      <div className="flex relative mt-20 w-full">
        <div className="flex  c1 absolute -translate-y-full -top-5 right-5 items-center">
          <LayoutForm
            stateInit={{
              placeholders: { search: "Search ..." },
              allowed: true,
              form: { target: "search", search: null },
            }}
          >
            <MyInput label={false} target={"search"} icon={icfySEARCH} />
          </LayoutForm>
        </div>

        <div className="flex w-full gap-4 flex-col">
          {state?.lists?.map((el, index) => (
            <div
              key={v4()}
              className="px-4 py-3 hover:bg-white/10 backdrop-blur hover:border-white/15 border border-white/5 rounded-xl bg-white/5 rouded-lg shadow flex items-center justify-between w-full"
            >
              <div className="flex flex-col flex-auto h-full  gap-2">
                <div className="flex justify-between w-full">
                  <MyTitle>{el?.metadatas?.title}</MyTitle>
                  <div className="flex gap-2 justify-end">
                    {el?.datas?.status !== 3 ? (
                      <div className="c4 flex items-center gap-4">
                        <MySub size={8}>
                          {el?.datas?.status === 1 ? "End" : "Started"}
                        </MySub>
                        <MyCountdown
                          style={"text-error"}
                          size={8}
                          timestamp={parseInt(
                            el?.datas?.status === 1
                              ? el?.datas?.saleEnd
                              : el?.datas?.saleStart
                          )}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    <MyMainBtn color={2} style={"btn-xs"} icon={icfy.ux.star} />
                  </div>
                </div>
                <div className="flex c4 gap-2   items-center">
                  {el?.metadatas?.company ? (
                    <div className="flex gap-2 items-center">
                      <div className="p-2 rounded bg-white/5 ">
                        <Icon icon={icsystem.mission} />
                      </div>
                      <div className="flex flex-col">
                        <MySub size={8}>Company</MySub>
                        <p
                          className={
                            "c3 whitespace-nowrap max-w-[100px] truncate hover:max-w-fit text-xs"
                          }
                        >
                          {el?.metadatas?.company}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex items-center c4 gap-2">
                    <div className="p-2 rounded bg-white/5 ">
                      <Icon icon={icfy.ux.admin} />
                    </div>
                    <div className="flex flex-col">
                      <MySub size={8}>Owner</MySub>
                      <CVName styles={"c3 text-xs"} metadata={el?.owner} />
                    </div>
                  </div>
                </div>
                {el?.metadatas?.description ? (
                  <p className="text-[9px] w-full text-white/70 font-light py-4">
                    {el?.metadatas?.description}
                  </p>
                ) : (
                  <></>
                )}
                <div className="mt-auto flex items-center w-full gap-2">
                  <MyStatus status={el?.datas?.status} target={"launchpad"} />
                  <MyBadge color={1}>
                    {ENUMS.domain[el?.metadatas?.domain]?.name}
                  </MyBadge>
                  <div className="flex gap-3 ml-auto items-center">
                    <div className="flex items-center gap-2 c4">
                      <MySub size={8}>Total users</MySub>
                      <MyNum style={"c3"} num={el?.datas?.totalUser}></MyNum>
                    </div>
                    <div className="flex items-center c4 gap-2">
                      <MySub size={8}>Amount raised</MySub>
                      <MyNum style={"c3"} num={el?.datas?.amountRaised}>
                        <span className="c4 ml-1 text-xs">ETH</span>
                      </MyNum>
                    </div>

                    <MyMainBtn
                      url={"/launchpad/" + el?.launchpadID}
                      style={"btn-sm"}
                    >
                      View more
                    </MyMainBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <ListProfiles /> */}
      </div>
    </>
  );
};
