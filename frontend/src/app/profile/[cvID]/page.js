"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { controllers } from "utils/controllers";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyChart } from "components/myComponents/box/MyChart";
import { CVInfos } from "sections/Profile/state/CVInfos";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";

function App({ params }) {
  const { cv, metadatas } = useAuthState();

  const { state, status, pointer, refresh } = useToolsState();

  const cvID = params.cvID;

  return (
    <LayoutProfile controller={"overview"} cvID={cvID} url={"/"}>
      <MyLayoutHeader
        cvID={state?.profile?.cvID}
        username={state?.profile?.metadatas?.username}
        image={state?.profile?.metadatas?.avatar}
        target={"profile"}
        // statusObj={{
        //   current: state?.profile?.metadatas?.visibility ? 0 : 1,
        //   to: state?.profile?.metadatas?.visibility ? 1 : 0,
        // }}
        allowed={cv == state?.profile?.cvID}
        metadatas={state?.profile?.metadatas}
      ></MyLayoutHeader>
      <div className="w-full border-y border-white/5 flex">
        <CVInfos />
        <MyLayoutDetails
          style={"border-l"}
          arr={[
            {
              value: (
                <MyStatus
                  style={" w-fit text-[8px]"}
                  target={"token"}
                  padding={"px-2 py-1"}
                  allowed={cv == cvID}
                  toStatus={state?.profile?.datas?.acceptToken ? 1 : 0}
                  status={state?.profile?.datas?.acceptToken ? 0 : 1}
                ></MyStatus>
              ),
              icon: icfy.bank.coin,
            },
            {
              title: "Domain",
              value:
                cv == cvID ? (
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
                      styles={"w-full"}
                      label={false}
                      setter={async (value) => {
                        let metadatas = state?.profile?.metadatas;
                        metadatas.domain = value?.index;
                        await controllers.update.profile(metadatas);
                      }}
                    ></MySelect>
                  </LayoutForm>
                ) : (
                  <MySub style={"items-center flex"}>
                    {ENUMS?.domain[state?.profile?.metadatas?.domain]?.name}
                  </MySub>
                ),
              icon: ENUMS.domain[state?.profile?.metadatas?.domain]?.icon,
            },
            {
              title: "Total wadge",
              num: state?.profile?.datas?.amount,
              icon: icfyETHER,
            },
            state?.profile?.datas?.missions?.length && {
              title: "Total depense",
              num: state?.profile?.datas?.amount,
              icon: icfyETHER,
            },
            {
              title: "Total invest",
              num: state?.profile?.datas?.amount,
              icon: icfyETHER,
            },
            state?.profile?.datas?.missions?.length && {
              title: "Missions",
              num: state?.profile?.datas?.missions?.length,
              icon: icsystem.mission,
            },
            state?.profile?.datas?.missions?.length && {
              title: "Features",
              num: state?.profile?.datas?.features?.length,
              icon: icsystem.feature,
            },
            {
              title: "Jobs",
              num: state?.profile?.datas?.proposals?.length,
              icon: icsystem.feature,
            },
            state?.profile?.datas?.launchpads?.length && {
              title: "Launchpads",
              num: state?.profile?.datas?.launchpads?.length,
              icon: icsystem.launchpad,
            },
            state?.profile?.datas?.proposals?.length && {
              title: "Arbitrators",
              num: state?.profile?.datas?.arbitrators?.length,
              icon: icsystem.escrow,
            },
            (state?.profile?.datas?.proposals?.length ||
              state?.profile?.datas?.features?.length) && {
              title: "Disputes",
              num: state?.profile?.details?.escrows?.disputes,
              icon: icsystem.escrow,
            },
            {
              title: "Followers",
              num: state?.profile?.details?.social?.followers,
              icon: icfy.person.friend,
            },
            {
              title: "Posts",
              num: state?.profile?.details?.social?.pubs,
              icon: icfy.msg.post,
            },
          ]}
          objStatus={{
            target: "profile",
            status: state?.profile?.metadatas?.visibility ? 0 : 1,
          }}
        />
      </div>
    </LayoutProfile>
  );
}

export default App;
