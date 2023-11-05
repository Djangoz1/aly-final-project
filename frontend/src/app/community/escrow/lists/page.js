"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
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
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
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
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyCardStat } from "components/myComponents/card/MyCardStat";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { MyNum } from "components/myComponents/text/MyNum";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let courts = [];
    let datas = {
      balance: 0n,
      famous: 0,
      disputes: await _apiGet("tokensLength", [ADDRESSES["disputesHub"]]),
      users: 0n,
    };

    let max = 0n;

    for (let index = 2; index < ENUMS.courts.length; index++) {
      let balance = await _apiGet("balanceOfCourt", [index]);
      datas.balance += balance;
      let arbitrators = await _apiGet("lengthOfCourt", [index]);
      if (arbitrators > max) {
        max = arbitrators;
        datas.famous = index - 2;
      }
      datas.users += arbitrators;

      courts.push({
        ...ENUMS.courts[index],
        courtID: index,
        balance: balance,
        arbitrators,
      });
    }

    // let _state = await doStateProfileTools({ dispatch, cvID });
    setIsState({ courts, datas });
    setIsLoading(false);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Origin fetch is datas cv", isState);
    }
  }, [cvID, status]);

  return (
    <MyLayoutDashboard
      initState={isState}
      isLoading={isLoading}
      template={1}
      id={cvID}
      btn={{
        title: "Invite worker",
        info: <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>,
      }}
      refresh={() => doStateProfileTools({ dispatch, cvID })}
      owner={state?.profile?.metadatas}
      price={state?.profile?.datas?.amount}
      allowed={cv == cvID}
      noMenu={true}
      header={state?.profile?.metadatas?.username}
      menus={[
        {
          title: "Lists",
          url: "#section0",
          icon: icfy.ux.admin,
        },
      ]}
      target={"profile"}
    >
      {console.log(state)}
      <div className="flex w-full">
        <div className="flex h-full flex-col">
          <div className="flex flex-col mb-auto">
            <MyTitle>Total balance</MyTitle>

            <MyNum
              toFix={4}
              style={"text-[1.8em] "}
              num={state?.datas?.balance}
            >
              <MySub style={"c4 mt-auto  ml-2"}>ETH</MySub>
            </MyNum>
            <MyTitle>Total arbitrators</MyTitle>

            <MyNum toFix={0} style={"text-[1.8em] "} num={state?.datas?.users}>
              <MySub style={"c4 mt-auto  ml-2"}>users</MySub>
            </MyNum>
            <MyTitle>Total disputes</MyTitle>

            <MyNum
              toFix={0}
              style={"text-[1.8em] "}
              num={state?.datas?.disputes}
            >
              <MySub style={"c4 mt-auto  ml-2"}>disputes</MySub>
            </MyNum>
          </div>
          <MyCardStat
            icon={state?.courts?.[state?.datas?.famous]?.badge}
            subtitle={"MVP"}
            url={`/court/${state?.courts?.[state?.datas?.famous]?.courtID}`}
            title={state?.courts?.[state?.datas?.famous]?.court}
            infoObj2={{
              title: "Arbitrators",
              value: parseInt(
                state?.courts?.[state?.datas?.famous]?.arbitrators
              ),
            }}
            infoObj1={{
              title: "Balance",
              value: parseInt(state?.courts?.[state?.datas?.famous]?.balance),
            }}
          />
        </div>

        <div className="grid w-fit ml-auto overflow-y-scroll grid-cols-3 gap-8 ">
          {state?.courts?.map((el, i) => (
            <MyCardFolder
              key={v4()}
              url={`/court/${i + 2}`}
              hoverable={true}
              image={`/courts/${el?.court}.png`}
              color={i}
              title={el.court}
            >
              <Icon icon={icfyETHER} className="mr-2" /> {parseInt(el?.balance)}
              <MySub style={"ml-2"}>ETH</MySub>
              <Icon icon={icfy.person.team} className="ml-4 mr-2" />{" "}
              {parseInt(el?.arbitrators)}
              <MySub style={"ml-2"}>arbitrators</MySub>
            </MyCardFolder>
          ))}
        </div>
      </div>
    </MyLayoutDashboard>
  );
}

export default App;
