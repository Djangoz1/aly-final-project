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

import { _apiGet, _apiPost, _apiPostAt } from "utils/ui-tools/web3-tools";
import { CVOverview } from "sections/Profile/state/CVOverview";

import {
  AssetProfile1,
  AssetProfileCard,
} from "components/assets/AssetProfile";
import { ethers } from "ethers";
import { fromTimestamp } from "utils/ux-tools";
import { STATUS } from "constants/status";
import Link from "next/link";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyForm } from "components/myComponents/form/MyForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";
import { useFormState } from "context/form";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { v4 } from "uuid";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { useInView } from "framer-motion";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { AssetLaunchpad } from "components/assets/AssetLaunchpad";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";

export const StateLaunchpadForm = () => {
  const { cv } = useAuthState();
  let { isConnected } = useAccount();
  let dispatch = useToolsDispatch();
  const { state, status, pointer } = useToolsState();

  let buyTokens = async (value) => {
    await _apiPost(
      "buyTokens",
      [parseInt(state?.launchpad?.launchpadID)],
      ethers.utils.parseEther(value)
    );
    await doStateLaunchpadTools(dispatch, state?.launchpad?.launchpadID);
  };
  const handleSubmit = async (tokens) => {
    await _apiPostAt({
      args: [state?.launchpad?.datas?.address, tokens * 10 ** 18],
      targetContract: "erc20",
      func: "approve",
      address: state?.launchpad?.datas?.tokenAddress,
    });
    await _apiPost("lockTokens", [
      state?.launchpad?.launchpadID,
      tokens * 10 ** 18,
    ]);
    await doStateLaunchpadTools(dispatch, state?.launchpad?.launchpadID);
  };
  return (
    <LayoutForm
      stateInit={{
        allowed: true,
        placeholders: {
          tokensLock: "Number of tokens to lock",
          tokens: `Price: ${
            state?.launchpad?.datas?.tiersDatas &&
            ethers?.utils?.formatEther(
              state?.launchpad?.datas?.tiersDatas?.[
                state?.launchpad?.datas?.currentTier
              ]?.tokenPrice
            )
          } ETH`,
        },
        form: {
          tokens: 0,
          tokensLock: 0,
          target: "formLaunchpad",
        },
      }}
    >
      {cv &&
        state?.launchpad?.datas?.status === 1 &&
        state?.launchpad?.datas.saleStart < Math.floor(Date.now() / 1000) && (
          <div className=" flex flex-col">
            <div className=" uppercase flex items-center c1">
              Round{" "}
              <span className=" ml-1">
                {state?.launchpad?.datas?.currentTier + 1}
              </span>
              <span className="text-xs ml-10 c4 flex items-center">
                <Icon icon={icfyETHER} className="text-sm" />
                <span className="">
                  {parseFloat(
                    ethers.utils.formatEther(
                      state?.launchpad?.datas?.tiersDatas?.[
                        state?.launchpad?.datas?.currentTier
                      ]?.tokenPrice
                    )
                  )}{" "}
                  ETH
                </span>
              </span>
            </div>
            <div className="flex items-end w-full justify-between">
              <MyInput
                setter={buyTokens}
                icon={icfy.ux.shop}
                styles={" mt-2  w-fit"}
                type={"number"}
                label={"Buy Tokens"}
                target={"tokens"}
                // min={parseFloat(
                //   ethers.utils.formatEther(state?.launchpad?.datas?.minInvest)
                // )}
                max={parseFloat(
                  ethers.utils.formatEther(state?.launchpad?.datas?.maxInvest)
                )}
                result={{
                  fixed: 3,
                  text: "Tokens",
                  value: parseFloat(
                    ethers.utils.formatEther(
                      state?.launchpad?.datas?.tiersDatas?.[
                        state?.launchpad?.datas?.currentTier
                      ]?.tokenPrice
                    )
                  ),
                }}
              ></MyInput>
            </div>
          </div>
        )}

      {cv == state?.owner?.cvID && (
        <MyInput
          styles={"mt-1 w-fit"}
          type={"number"}
          icon={icfyLOCK}
          setter={handleSubmit}
          max={state?.launchpad?.datas?.balanceOwner}
          target={"tokensLock"}
          label={"Token to lock"}
        />
      )}
    </LayoutForm>
  );
};
