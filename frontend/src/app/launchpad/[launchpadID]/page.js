"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyTIME } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { v4 } from "uuid";

import { MyCardFolder } from "components/myComponents/card/MyCardFolder";

import { MySub } from "components/myComponents/text/MySub";
import { LayoutLaunchpad } from "sections/Layout/layouts/LayoutLaunchpad";
import { ethers } from "ethers";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MyChart } from "components/myComponents/box/MyChart";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCard } from "components/myComponents/card/MyCard";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyBadge } from "components/myComponents/box/MyList";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";
import { Avatar } from "components/profile/ProfileAvatar";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const launchpadID = params.launchpadID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutLaunchpad
      controller={"overview"}
      launchpadID={launchpadID}
      url={"/"}
    >
      <div className="flex w-full  ">
        <StateLaunchpadInfos />
        <MyLayoutDetails
          footers={[
            {
              title: "Owner",
              value: (
                <Avatar
                  designation={true}
                  metadatas={state?.owner?.metadatas}
                />
              ),
            },
          ]}
          arr={[
            {
              icon: icfyETHER,
              num: state?.launchpad?.datas?.amountRaised,
              title: "Amount raised",
            },
            {
              icon: icfy.person.team,
              title: "Total investors",
              num: state?.launchpad?.datas?.totalUser,
            },
            {
              icon: icfyTIME,
              title: "Sale start",
              value: (
                <MyCountdown
                  style={" "}
                  size={10}
                  startDate={Math.floor(Date.now() / 1000)}
                  timestamp={parseInt(
                    state?.launchpad?.datas?.status === 1
                      ? state?.launchpad?.datas?.saleEnd
                      : state?.launchpad?.datas?.saleStart
                  )}
                />
              ),
            },
          ]}
          objStatus={{
            target: "launchpad",
            status: state?.launchpad?.datas?.status,
          }}
          btns={[
            {
              btn: "Go to website",
              url: state?.launchpad?.metadatas?.website,
            },
          ]}
        />
      </div>
    </LayoutLaunchpad>
  );
}

export default App;
