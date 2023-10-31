"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateLaunchpadTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { icfy, icfyETHER, icfyTIME } from "icones";

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
          title: "Investors",
          description: (
            <>
              <span className="text-xs uppercase mr-2">Total users</span>
              {parseInt(state?.launchpad?.datas?.totalUser)}
            </>
          ),
          icon: icfy.person.team,
        },
        {
          title: "Token allowed left",
          description: (
            <>
              <span className="text-xs uppercase mr-2">Round</span>
              {state?.launchpad?.datas?.currentTier + 1}
            </>
          ),
          icon: icfy.bank.coin,
        },
        {
          title: "Allowance",
          description: (
            <>
              {state?.launchpad?.datas?.allowance}
              <span className="text-xs ml-2 uppercase">tokens</span>
            </>
          ),
          icon: icfy.bank.coin,
        },
        {
          title: "Fundraising goal",
          description: (
            <>
              {parseInt(
                ethers.utils.formatEther(
                  `${state?.launchpad?.datas?.maxCap || 0}`
                )
              ).toFixed(5)}
              <span className="text-xs ml-2">ETH</span>
            </>
          ),
          icon: icfy.bank.coin,
        },
        {
          title: "Token price",
          description: (
            <>
              {ethers?.utils?.formatEther(
                state?.launchpad?.datas?.tiersDatas?.[
                  state?.launchpad?.datas?.currentTier
                ]?.tokenPrice || 0
              )}
              <span className="text-xs ml-2">ETH</span>
            </>
          ),
          icon: icfyETHER,
        },
        {
          icon: icfyTIME,
          title:
            state?.launchpad?.datas?.status === 1 ? "Sale start" : "Sale end",
          description: (
            <MyCountdown
              style={"mt-2 c2"}
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
          ),
        },
        {
          icon: STATUS.launchpad[state?.launchpad?.datas?.status]?.icon,
        },
      ]}
      menus={[
        { title: "Rules", url: "#section0", icon: icfy.ux.admin },
        {
          title: "Description",
          url: "#section1",
          icon: icfy.ux.admin,
        },

        {
          title: "Form",
          url: "#section2",
          icon: icfy.ux.admin,
        },
      ]}
      id={launchpadID}
      target={"launchpad"}
    >
      {/* <Viewport full={true} id={"missions"} index={0}>
        <div ref={ref} className="h-full  w-[1000px]">
          <div className="flex w-full justify-between  mb-10">
            <MyCard styles={"min-w-[300px] overflow-hidden  "}>
              <div className="flex items-center justify-between w-full">
                {(state?.launchpad?.datas?.saleStart >
                  Math.floor(Date.now() / 1000) &&
                  state?.launchpad?.datas?.status == 1) ||
                state?.launchpad?.datas?.saleEnd >
                  Math.floor(Date.now() / 1000) ? (
                  <div className="absolute shadow2 px-3 pt-1  pb-1  rounded-bl-xl  -top-0 -right-0 flex flex-col items-end text-xs text-white/40">
                    {state?.launchpad?.datas?.status == 1 &&
                    state?.launchpad?.datas?.saleStart <
                      Math.floor(Date.now() / 1000)
                      ? "Ended"
                      : "Started"}
                    <MyCountdown
                      style={"mt-1"}
                      size={10}
                      startDate={Math.floor(Date.now() / 1000)}
                      timestamp={parseInt(
                        state?.launchpad?.datas?.status == 1 &&
                          state?.launchpad?.datas?.saleStart <
                            Math.floor(Date.now() / 1000)
                          ? state?.launchpad?.datas?.saleEnd
                          : state?.launchpad?.datas?.saleStart
                      )}
                    />
                  </div>
                ) : undefined}
              </div>
            </MyCard>
          </div>
        </div>
      </Viewport> */}

      {/* {isConnected && <Viewport id={"admin"} index={2}></Viewport>}
      <Viewport fixed={true} id={"description"} index={1}>
        <AssetLaunchpad
          
         
          btn={"Mint token"}
          state={{ ...state?.launchpad, owner: state?.owner }}
        > */}
      {pointer === 0 ? (
        <StateLaunchpadInfos />
      ) : pointer === 2 ? (
        <StateLaunchpadForm />
      ) : undefined}
      {/* </AssetLaunchpad>
      </Viewport> */}
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
