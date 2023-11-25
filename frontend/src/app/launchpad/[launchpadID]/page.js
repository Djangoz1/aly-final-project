"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyTIME } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

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

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const launchpadID = params.launchpadID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutLaunchpad
      controller={"overview"}
      launchpadID={launchpadID}
      refresh={() => doStateLaunchpadTools({ dispatch, launchpadID })}
      url={"/"}
    >
      <MyLayoutHeader
        target={"launchpad"}
        style={"mb-10"}
        statusObj={{ current: state?.launchpad?.datas?.status }}
        username={state?.owner?.metadatas?.username}
        metadatas={state?.owner?.metadatas}
      >
        <div className="flex absolute top-2 right-2 items-center">
          <Icon icon={icfyTIME} className="mr-2" />
          <MyCountdown
            style={"mt-2 "}
            size={10}
            startDate={Math.floor(Date.now() / 1000)}
            check={
              Math.floor(Date.now() / 1000) < state?.launchpad?.datas?.endDate
            }
            timestamp={parseInt(
              state?.launchpad?.datas?.status === 1
                ? state?.launchpad?.datas?.saleEnd
                : state?.launchpad?.datas?.saleStart
            )}
          />
        </div>
      </MyLayoutHeader>
      <div className="flex items-center gap-3 w-full -translate-y-1/2">
        <MyChart
          title={"Total raised"}
          price={state?.launchpad?.datas?.amountRaised}
        />
        <MyChart
          title={"Total investors"}
          price={state?.launchpad?.datas?.amountRaised}
        >
          <MyNum num={state?.launchpad?.datas?.totalUser} />
        </MyChart>
        <MyCard
          styles={"w-fit h-fit flex items-center gap-4 flex-col px-2 py-1"}
        >
          <Icon className="text-2xl" icon={icfyETHER} />
          <MySub style={"c4"}>Max cap</MySub>
          <MyNum
            num={ethers.utils.formatEther(
              `${state?.launchpad?.datas?.maxCap || 0}`
            )}
            toFix={0}
          />
        </MyCard>
        <MyCard
          styles={"w-fit h-fit flex items-center gap-4 flex-col px-2 py-1"}
        >
          <Icon className="text-2xl" icon={icfyETHER} />
          <MySub style={"c4"}>Max cap</MySub>
          <MyNum
            num={ethers.utils.formatEther(
              `${state?.launchpad?.datas?.minCap || 0}`
            )}
            toFix={0}
          />
        </MyCard>
      </div>

      <div className="px-5">
        <MyTitle style="mb-4 underline">Description</MyTitle>

        <article className="text-xs   my-3 text-justify whitespace-break-spaces font-light">
          {state?.launchpad?.metadatas?.description}
        </article>
      </div>

      <StateLaunchpadInfos />
    </LayoutLaunchpad>
  );
}

export default App;
