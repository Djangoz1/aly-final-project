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
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

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
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MyTable } from "components/myComponents/table/MyTable";
import {
  HEAD_table_missions,
  _table_missions,
} from "utils/states/tables/mission";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.missions && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.missions.length; index++) {
        const element = state?.missions[index];
        amount += element?.datas?.amount;
      }

      setIsAmount(amount);
    }
  }, [state?.missions]);

  //   let isTable = {
  //     btn: "Missions",
  //     table:,
  //     head: ,
  //     setState: stateMission,

  //     // btns: MENUS_EDIT.mission,
  //   };
  console.log(state);
  let dispatch = useToolsDispatch();
  let [selectedID, setSelectedID] = useState(null);
  return (
    <LayoutProfile
      controller={"missions"}
      cvID={cvID}
      target={"profile"}
      url={"/missions"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyCard template={1} styles={"h-full  rounded-t-none w-full "}>
          <div
            ref={ref}
            className="w-full h-full rounded-lg py-20 shadow backdrop-blur "
          >
            <MyTable
              list={_table_missions(state?.missions)}
              head={HEAD_table_missions}

              // btns={infos?.[state?.indexOverview]?.btns}
              // editBtns={infos?.[state?.indexOverview]?.editBtns}
            />
          </div>
        </MyCard>
        <div className="flex w-full">
          <MyScrolledXDiv>
            <>
              <MyFramerModal
                style={
                  "on_hover my-3 min-w-[430px] flex flex-col h-[150px] p-2 mr-2 bg-white/5  "
                }
                arr={state?.missions?.map((el) => (
                  <>
                    <h6 className="font-light text-sm ">
                      {el?.metadatas?.title}
                    </h6>

                    <div className="flex mb-3 items-center">
                      <Icon icon={icsystem.feature} className="text-lg mr-2" />
                      <MyNum num={el?.datas?.features?.length} />
                      <Icon
                        icon={icfy.bank.dollars}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.amount} />
                      <Icon
                        icon={icfy.person.team}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.workers} />
                    </div>
                    <div className="flex mt-auto w-full items-center">
                      {el?.datas?.launchpad > 0 ? (
                        <MyMainBtn
                          template={2}
                          style={"text-xs"}
                          icon={icsystem.launchpad}
                        >
                          Launchpad
                        </MyMainBtn>
                      ) : (
                        <></>
                      )}
                      <MyStatus
                        status={el?.datas?.status}
                        style={" w-full text-xs"}
                        target={"mission"}
                      />
                    </div>
                  </>
                ))}
                selectedId={selectedID}
                setSelectedId={setSelectedID}
              >
                <div className="w-full h-full ">
                  <MissionProfile
                    missionID={state?.missions?.[selectedID]?.missionID}
                  />
                </div>
              </MyFramerModal>
            </>
          </MyScrolledXDiv>
          <div className="bg-zinc-900 flex items-center p-4 ">
            <Icon icon={icfyETHER} className="text-[64px]" />
            <div className="flex flex-col">
              <MyNum style={"text-xl"} num={isAmount} />
              <MySub size={8}>Total depense</MySub>
            </div>
          </div>
        </div>
      </div>

      {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
    </LayoutProfile>
  );
}

export default App;
