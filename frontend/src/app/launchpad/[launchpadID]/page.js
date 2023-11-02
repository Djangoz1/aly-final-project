"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateLaunchpadTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { icfy, icfyETHER, icfyTIME, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

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
import { doStateFormPointer, useFormState } from "context/form";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { v4 } from "uuid";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { useInView } from "framer-motion";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { AssetLaunchpad } from "components/assets/AssetLaunchpad";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";
import { StateLaunchpadForm } from "sections/Launchpad/state/StateLaunchpadForm";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { Icon } from "@iconify/react";
import { MySub } from "components/myComponents/text/MySub";

function App({ params }) {
  const { cv } = useAuthState();
  let { isConnected } = useAccount();
  let dispatch = useToolsDispatch();
  const { state, status, pointer } = useToolsState();
  let ref = useRef();
  let ref1 = useRef();

  let isInView1 = useInView(ref1);
  const launchpadID = params.launchpadID;
  let router = useRouter();
  useEffect(() => {
    if (state?.launchpad?.launchpadID != launchpadID || status === "reload") {
      doStateLaunchpadTools(dispatch, launchpadID);
      console.log("Anormal !!!! fetch is datas page");
    }
  }, [launchpadID, status]);

  console.log("state launchpad page", state);

  return (
    <MyLayoutDashboard
      template={[0, 1, 1, 0]?.[pointer]}
      price={state?.launchpad?.datas?.amountRaised || 0}
      owner={state?.owner}
      btn={{
        title: "Mint token",

        info: (
          <>
            Nombres de rounds:
            <span className="c1 text-lg font-semibold ml-2">
              {state?.launchpad?.datas?.numberOfTier}
            </span>
          </>
        ),
      }}
      statusObj={{
        to:
          state?.launchpad?.datas?.status == 0 ||
          (state?.launchpad?.datas?.status == 1 &&
            state?.launchpad?.datas?.saleStart > Math.floor(Date.now() / 1000))
            ? 1
            : 3,
        current: state?.launchpad?.datas?.status,
      }}
      allowed={
        cv == state?.owner?.cvID &&
        state?.launchpad?.datas?.currentTier ==
          state?.launchpad?.datas?.tiersDatas?.length - 1 &&
        (state?.launchpad?.datas?.tiersDatas?.[
          state?.launchpad?.datas?.currentTier
        ]?.amountRaised >=
          state?.launchpad?.datas?.tiersDatas?.[
            state?.launchpad?.datas?.currentTier
          ]?.minTierCap ||
          state?.launchpad?.datas?.saleEnd >= Math.floor(Date.now() / 1000)) &&
        (state?.launchpad?.datas?.status == 0 ||
          (state?.launchpad?.datas?.status == 1 &&
            state?.launchpad?.datas?.saleStart >
              Math.floor(Date.now() / 1000)) ||
          state?.launchpad?.datas?.currentTier ==
            state?.launchpad?.datas?.tiersDatas?.length - 1)
      }
      lists={[
        {
          title: "Contract",
          description: (
            <div className="flex flex-col">
              <div className="flex items-center">
                <MySub style={"mr-3"}>allowed</MySub>
                {state?.launchpad?.datas?.allowance}
                <Icon icon={icfy.bank.bag} className="ml-2 mr-4" />
              </div>

              <div className="flex items-center">
                <MySub style={"mr-3"}>Raised</MySub>
                {state?.launchpad?.datas?.amountRaised}
                <Icon icon={icfyETHER} className="ml-2 mr-4" />
              </div>
            </div>
          ),
          icon: icfy.bank.coin,
        },
        {
          title: "Owner",
          description: (
            <div className="flex flex-col">
              <div className="flex items-center">
                <MySub style={"mr-1"}>{state?.owner?.username}</MySub>

                <Icon icon={icfy.person.team} className="ml-2 mr-4" />
              </div>
              <div className="flex items-center">
                <MySub style={"mr-3"}>balance</MySub>
                {state?.launchpad?.datas?.balanceOwner}
                <Icon icon={icfy.bank.bag} className="ml-2 mr-4" />
              </div>
            </div>
          ),
          icon: icfy.bank.coin,
        },

        {
          title: "Investors",
          description: (
            <div className="flex flex-col">
              <div className="flex items-center">
                <MySub style={"mr-2"}>Total users</MySub>
                {parseInt(state?.launchpad?.datas?.totalUser)}
              </div>
              <div className="flex items-center mt-1">
                <MySub style={" mr-1"}>Nombres de rounds</MySub>
                {parseInt(state?.launchpad?.datas?.tiersDatas?.length)}
                <MySub style={"ml-2 mr-1"}>Round actuel</MySub>
                {parseInt(state?.launchpad?.datas?.currentTier)}
              </div>
            </div>
          ),
          icon: icfy.person.team,
        },
        {
          title: "Tokens",
          description: (
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <MySub style={"mr-3"}>current price</MySub>
                {ethers?.utils?.formatEther(
                  state?.launchpad?.datas?.tiersDatas?.[
                    state?.launchpad?.datas?.currentTier
                  ]?.tokenPrice || 0
                )}
                <Icon icon={icfy.bank.dollars} className="ml-2 mr-4" />
                {/* <Icon icon={icsystem.feature} className="ml-2 mr-4" /> */}
                <span className="text-xs uppercase mr-2">Round</span>
                {state?.launchpad?.datas?.currentTier + 1}
              </div>
              <div className="flex items-center">
                <Icon icon={icfyETHER} className="mr-2" />
                <MySub style={"mr-4 "}>
                  max cap{" "}
                  {parseInt(
                    ethers.utils.formatEther(
                      `${state?.launchpad?.datas?.maxCap || 0}`
                    )
                  ).toFixed(5)}
                </MySub>
                <MySub style={" "}>
                  min{" "}
                  {parseInt(
                    ethers.utils.formatEther(
                      `${state?.launchpad?.datas?.minCap || 0}`
                    )
                  ).toFixed(5)}
                </MySub>
              </div>
            </div>
          ),
          icon: icfy.bank.coin,
        },

        {
          image: "/time.png",
          title:
            state?.launchpad?.datas?.status === 1 ? "Sale start" : "Sale end",
          description: (
            <div className="flex flex-col">
              <div className="flex items-center">
                <Icon icon={icfyTIME} className="mr-2" />
                <MyCountdown
                  style={"mt-2 "}
                  size={10}
                  startDate={Math.floor(Date.now() / 1000)}
                  check={
                    Math.floor(Date.now() / 1000) <
                    state?.launchpad?.datas?.endDate
                  }
                  timestamp={parseInt(
                    state?.launchpad?.datas?.status === 1
                      ? state?.launchpad?.datas?.saleEnd
                      : state?.launchpad?.datas?.saleStart
                  )}
                />
              </div>
            </div>
          ),
        },
      ]}
      menus={[
        { title: "Rules", url: "#section1", icon: icfy.ux.admin },
        {
          title: "Description",
          url: "#section2",
          icon: icfy.ux.admin,
        },

        {
          title: "Form",
          url: "#section3",
          icon: icfy.ux.admin,
        },
      ]}
      id={launchpadID}
      target={"launchpad"}
    >
      {
        [
          undefined,
          <StateLaunchpadInfos />,

          <>
            <>
              <h6 className="font-bold uppercase  mb-4 underline">
                Description
              </h6>
              <article className="text-xs  hover:text-black my-3 text-justify whitespace-break-spaces font-light">
                {state?.launchpad?.metadatas?.description}
              </article>
            </>
          </>,
          <StateLaunchpadForm />,
          <StateLaunchpadInfos />,
          <StateLaunchpadInfos />,
        ]?.[pointer]
      }
    </MyLayoutDashboard>
  );
}

const LockToken = () => {
  let { address } = useAccount();
  const { form } = useFormState();
  const { state } = useToolsState();
  const router = useRouter();
  let dispatch = useToolsDispatch();
  const handleSubmit = async () => {
    await _apiPostAt({
      args: [state?.launchpad?.datas?.address, form.tokens * 10 ** 18],
      targetContract: "erc20",
      func: "approve",
      address: state?.launchpad?.datas?.tokenAddress,
    });
    await _apiPost("lockTokens", [
      state?.launchpad?.launchpadID,
      form.tokens * 10 ** 18,
    ]);
    await doStateLaunchpadTools(dispatch, state?.launchpad?.launchpadID);
  };
  console.log("fooorm", form);
  return (
    <MyCard>
      <MyInput
        type={"number"}
        max={state?.launchpad?.datas?.balanceOwner}
        target={"tokens"}
        label={"Number of token"}
      />
      <MyMainBtn style={"mt-4"} setter={handleSubmit}>
        Lock tokens
      </MyMainBtn>
    </MyCard>
  );
};

export default App;
