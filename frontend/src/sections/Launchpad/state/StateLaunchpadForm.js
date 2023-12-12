"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateLaunchpadTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { stateLaunchpad } from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyLOCK } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";

import {
  _apiGet,
  _apiPost,
  _apiPostAt,
  _apiPostPayable,
} from "utils/ui-tools/web3-tools";

import { ethers } from "ethers";

import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { useAccount } from "wagmi";
import { v4 } from "uuid";

export const StateLaunchpadForm = () => {
  const { cv } = useAuthState();
  let { isConnected } = useAccount();
  let dispatch = useToolsDispatch();
  const { state, status, pointer } = useToolsState();

  let buyTokens = async (value) => {
    await _apiPostPayable(
      "buyTokens",
      [parseInt(state?.launchpad?.launchpadID)],
      ethers.utils.parseEther(value)?._hex
    );
    await doStateLaunchpadTools(dispatch, state?.launchpad?.launchpadID);
  };

  return (
    <LayoutForm
      stateInit={{
        allowed: true,
        placeholders: {
          tokens: `Price ETH`,
        },
        form: {
          tokens: 0,

          target: "formLaunchpad",
        },
      }}
    >
      {cv &&
        state?.launchpad?.datas?.status === 1 &&
        state?.launchpad?.datas.saleStart < Math.floor(Date.now() / 1000) && (
          <div className=" flex px-5 py-2 flex-col">
            <div className=" uppercase flex items-center c1"></div>
            <div className="flex items-end w-full justify-between">
              <MyInput
                setter={buyTokens}
                icon={icfy.ux.shop}
                styles={" mt-2  w-fit"}
                type={"number"}
                label={"Buy Tokens"}
                target={"tokens"}
                min={parseFloat(
                  ethers?.utils?.formatEther(state?.launchpad?.datas?.minInvest)
                )}
                max={parseFloat(
                  ethers.utils.formatEther(state?.launchpad?.datas?.maxInvest)
                )}
                // result={{
                //   fixed: 3,
                //   text: "Tokens",
                //   value: parseFloat(
                //     ethers.utils.formatEther(
                //       state?.launchpad?.datas?.tiersDatas?.[
                //         state?.launchpad?.datas?.currentTier
                //       ]?.tokenPrice
                //     )
                //   ),
                // }}
              ></MyInput>
            </div>
          </div>
        )}
    </LayoutForm>
  );
};
