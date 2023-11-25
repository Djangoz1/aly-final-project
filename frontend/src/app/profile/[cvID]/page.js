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
import { Avatar } from "components/profile/ProfileAvatar";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { controllers } from "utils/controllers";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyChart } from "components/myComponents/box/MyChart";

function App({ params }) {
  const { cv, metadatas } = useAuthState();

  const { state, status, pointer, refresh } = useToolsState();

  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutProfile controller={"features"} cvID={cvID} url={"/"}>
      <MyLayoutHeader
        style={"mb-10"}
        cvID={state?.profile?.cvID}
        username={state?.profile?.metadatas?.username}
        image={state?.profile?.metadatas?.avatar}
        target={"profile"}
        statusObj={{
          current: state?.profile?.metadatas?.visibility ? 0 : 1,
          to: state?.profile?.metadatas?.visibility ? 1 : 0,
        }}
        allowed={cv == state?.profile?.cvID}
        metadatas={state?.profile?.metadatas}
      >
        {cv == cvID ? (
          <LayoutForm
            stateInit={{
              allowed: true,
              placeholders: { domain: "What's your main skill ?" },
              form: {
                target: "domain",
                domain: state?.profile?.metadatas?.domain,
              },
            }}
          >
            <MySelect
              arr={ENUMS.domain.map((el) => el?.name)}
              target={"domain"}
              label={"Votre département d'entreprise"}
              setter={async (value) => {
                let metadatas = state?.profile?.metadatas;
                metadatas.domain = value?.index;
                await controllers.update.profile(metadatas);
              }}
            ></MySelect>
          </LayoutForm>
        ) : (
          <div className="flex w-full flex-wrap items-">
            <MySub style={"items-center flex"}>
              <Icon
                className="text-lg mr-2"
                icon={ENUMS?.domain[metadatas?.domain]?.icon}
              />
              {ENUMS?.domain[metadatas?.domain]?.name}
            </MySub>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <MyStatus
            style={" w-fit text-[8px]"}
            target={"token"}
            allowed={cv == cvID}
            toStatus={state?.profile?.datas?.acceptToken ? 1 : 0}
            status={state?.profile?.datas?.acceptToken ? 0 : 1}
          ></MyStatus>
        </div>
      </MyLayoutHeader>

      <div className="flex gap-3  w-full -translate-y-1/2">
        <MyChart price={state?.profile?.datas?.amount} />
        <MyChart price={state?.profile?.datas?.amount} title={"Total wadge"} />
        <MyChart price={state?.profile?.datas?.amount} title={"Total invest"} />
      </div>

      <div className="grid grid-cols-2 gap-5 pt-20 px-10">
        {[
          {
            title: "Enterprise",
            description: (
              <>
                <MyNum num={state?.profile?.datas?.missions?.length} />{" "}
                <Icon icon={icsystem.mission} className="ml-2 mr-4" />
                <MyNum num={state?.profile?.datas?.features?.length} />{" "}
                <Icon icon={icsystem.feature} className="ml-2 mr-4" />
                <MyNum num={state?.profile?.datas?.amount} />{" "}
                <Icon icon={icfyETHER} className="ml-2 mr-4" />
              </>
            ),
            url: `#section2`,
          },
          {
            title: "Worker",
            description: (
              <>
                <MyNum num={state?.profile?.datas?.arbitrators?.length} />{" "}
                <Icon icon={icfy.court.hammer} className="ml-2 mr-4" />
                <MyNum num={state?.profile?.datas?.proposals?.length} />{" "}
                <Icon icon={icsystem.feature} className="ml-2 mr-4" />
                <MyNum num={state?.profile?.details?.wadge || 0} />{" "}
                <Icon icon={icfyETHER} className="ml-2 mr-4" />
              </>
            ),
            url: `#section2`,
          },
          {
            title: "Launchpad",
            description: (
              <>
                <MyNum num={state?.profile?.datas?.launchpads?.length || 0} />{" "}
                <Icon icon={icsystem.launchpad} className="ml-2 mr-4" />
                <MyNum
                  num={state?.profile?.details?.launchpads?.totalRaised || 0}
                />{" "}
                <Icon icon={icfyETHER} className="ml-2 mr-4" />
              </>
            ),
            url: `#section2`,
          },

          {
            title: "Notifications",
            description: (
              <>
                <MyNum num={state?.profile?.datas?.invitation?.length || 0} />{" "}
                <Icon icon={icfySEND} className="ml-2 rotate-180 mr-4" />
                <MyNum num={state?.profile?.datas?.notifications || 0} />{" "}
                <Icon icon={icfySEND} className="ml-2 mr-4" />
              </>
            ),
            url: `#section2`,
          },
        ].map((el, i) =>
          el?.title ? (
            <MyCardFolder
              key={v4()}
              style={"min-w-full "}
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
    </LayoutProfile>
  );
}

export default App;
