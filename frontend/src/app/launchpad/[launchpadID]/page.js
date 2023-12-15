"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { icfy, icfyETHER, icfyTIME } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { LayoutLaunchpad } from "sections/Layout/layouts/LayoutLaunchpad";

import { MyCountdown } from "components/myComponents/MyCountdown";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";
import { MyLayoutDetails } from "components/myComponents/layout/MyLayoutDetails";
import { Avatar } from "components/profile/ProfileAvatar";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { ethers } from "ethers";

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
              title: "Invest",
              value: (
                <LayoutForm
                  stateInit={{
                    allowed: true,
                    form: { target: "invest", buy: 0 },
                    placeholders: { buy: "ETH value" },
                  }}
                >
                  <MyInput
                    target={"buy"}
                    label={false}
                    // max={ethers.utils.formatEther(
                    //   state?.launchpad?.datas?.maxInvest
                    // )}
                    setter={async (value) =>
                      await _apiPostPayable(
                        "buyTokens",
                        [parseInt(state?.launchpad?.launchpadID)],
                        ethers.utils.parseEther(value)._hex
                      )
                    }
                  />
                </LayoutForm>
              ),
            },
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
