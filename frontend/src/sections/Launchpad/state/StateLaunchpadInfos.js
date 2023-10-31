import { useAuthState } from "context/auth";
import {
  doStateLaunchpadTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet, _apiPost, _apiPostAt } from "utils/ui-tools/web3-tools";

import { ethers } from "ethers";
import { fromTimestamp } from "utils/ux-tools";

import { MyCardInfos } from "components/myComponents/card/MyCard";

import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { v4 } from "uuid";
import { MyBtnPost } from "components/btn/MyBtnPost";

export const StateLaunchpadInfos = () => {
  const { cv } = useAuthState();

  let dispatch = useToolsDispatch();
  const { state, status, pointer } = useToolsState();

  let info1 = [
    {
      title: "Total participants",
      value: parseInt(state?.launchpad?.datas?.totalUser),
    },
    {
      title: "Launchpad contract",
      value: state?.launchpad?.metadatas?.title,
    },
    {
      title: "Balance token owner",
      value: state?.launchpad?.datas?.balanceOwner,
    },
    {
      title: "Allowance contract",
      value: <>{state?.launchpad?.datas?.allowance} Tokens</>,
    },
    {
      title: "Balance contract",
      value: <>{state?.launchpad?.datas?.amountRaised} ETH</>,
    },
    {
      title: "Round actuel",
      value: (
        <>
          {state?.launchpad?.datas?.currentTier + 1}/
          {state?.launchpad?.datas?.numberOfTier}
        </>
      ),
    },
  ];
  let info2 = [
    {
      title: "Token contract",
      value: (
        <div className="flex flex-col">
          {state?.launchpad?.datas?.tokenName} (
          {state?.launchpad?.datas?.tokenSymbol})
          <p className="text-[8px] text-white/60">
            {state?.launchpad?.datas?.tokenAddress}
          </p>
        </div>
      ),
    },
    {
      title: (
        <>
          Capitalization <span className="text-[10px]">min / max</span>
        </>
      ),
      value: (
        <>
          {state?.launchpad?.datas &&
            parseInt(
              ethers?.utils?.formatEther(state?.launchpad?.datas?.minCap)
            ).toFixed(3)}
          /
          {state?.launchpad?.datas &&
            parseInt(
              ethers?.utils?.formatEther(state?.launchpad?.datas?.maxCap)
            ).toFixed(3)}{" "}
          ETH
        </>
      ),
    },
    {
      title: (
        <>
          Invest allowance <span className="text-[10px]">min / max</span>
        </>
      ),
      value: (
        <>
          {state?.launchpad?.datas &&
            parseInt(
              ethers?.utils.formatEther(state?.launchpad?.datas?.minInvest)
            ).toFixed(3)}
          /
          {state?.launchpad?.datas &&
            parseInt(
              ethers?.utils.formatEther(state?.launchpad?.datas?.maxInvest)
            ).toFixed(3)}{" "}
          ETH
        </>
      ),
    },
    {
      title: <>Started</>,
      value: <>{fromTimestamp(parseInt(state?.launchpad?.datas?.saleStart))}</>,
    },
    {
      title: <>Ended</>,
      value: <>{fromTimestamp(parseInt(state?.launchpad?.datas?.saleEnd))}</>,
    },
    {
      title: <>Locked time</>,
      value: <>{parseInt(state?.launchpad?.datas?.lockedTime)}</>,
    },
  ];

  let buyTokens = async (value) => {
    await _apiPost(
      "buyTokens",
      [parseInt(state?.launchpad?.launchpadID)],
      ethers.utils.parseEther(value)
    );
    await doStateLaunchpadTools(dispatch, state?.launchpad?.launchpadID);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {state?.launchpad?.datas?.tiersDatas?.map((el, index) => (
          <div
            className={`w-fit  mx-3  flex  py-2 mb-5 items-center  z-2  relative
                ${
                  index != state?.launchpad?.datas?.currentTier
                    ? index < state?.launchpad?.datas?.currentTier
                      ? "opacity-70"
                      : " opacity-50  "
                    : "opacity-100"
                } 
                 `}
            key={v4()}
          >
            <div className="absolute flex top-1 right-3 items-center">
              <Icon icon={icfy.person.team} className="mr-2 " />
              {parseInt(el?.users)}
            </div>
            <div
              className={`rounded-full ${
                index <= state?.launchpad?.datas?.currentTier
                  ? "shadow1"
                  : undefined
              }`}
            >
              <div
                className={`radial-progress backdrop-blur-xl border transition-all relative    
                        ${
                          index > state?.launchpad?.datas?.currentTier
                            ? "border-error/70 bg-error/20 text-error/20"
                            : "border-success/70  bg-success/20  c1"
                        } 
                      `}
                style={{
                  "--value":
                    el?.amountRaised > 0
                      ? el?.amountRaised == el?.maxTierCap
                        ? 100
                        : parseInt(el?.maxTierCap / el?.amountRaised) * 10
                      : 0,
                }}
              >
                <span className="flex justify-center m-0 py-2 c1 px-2  rounded-full w-full h-full items-center text-[10px]">
                  {index > state?.launchpad?.datas?.currentTier ? (
                    "Waiting"
                  ) : (
                    <div className="flex justify-center relative w-full  items-center">
                      <Icon
                        className="text-lg mr-1 absolute  -right-6  "
                        icon={icfyETHER}
                      />
                      <div className="flex justify-center items-end"></div>
                      <span className="countdown">
                        <span
                          style={{
                            "--value": parseInt(
                              parseFloat(
                                ethers.utils.formatEther(el?.amountRaised)
                              )
                                .toFixed(2)
                                .toString()
                                .split(".")[0]
                            ),
                          }}
                        ></span>
                      </span>
                      .
                      <span className="countdown">
                        <span
                          style={{
                            "--value": parseFloat(
                              ethers.utils.formatEther(el?.amountRaised)
                            )
                              .toFixed(2)
                              .toString()
                              .split(".")[1],
                          }}
                        ></span>
                      </span>
                    </div>
                  )}
                </span>
              </div>
            </div>

            <div className="ml-3">
              <h6 className="">Round {index + 1}</h6>
              <div className="flex mt-3 justify-between items-center ">
                <div className="text-[10px] flex-col flex ">
                  <span className="c4">Min :</span>
                  <p className="flex items-center">
                    {parseFloat(
                      ethers.utils.formatEther(el?.minTierCap)
                    ).toFixed(3)}
                    <Icon icon={icfyETHER} className="ml-2" />
                  </p>
                </div>
                <div className="text-[10px] ml-3 flex-col flex ">
                  <span className="c4">Max :</span>
                  <p className="flex items-center">
                    {parseFloat(
                      ethers.utils.formatEther(el?.maxTierCap)
                    ).toFixed(3)}
                    <Icon icon={icfyETHER} className="ml-2" />
                  </p>
                </div>
                <div className="text-[10px] ml-3 flex-col flex ">
                  <span className="c4">Price :</span>
                  <p className="flex items-center">
                    {parseFloat(
                      ethers.utils.formatEther(el?.tokenPrice)
                    ).toFixed(4)}
                    <Icon icon={icfyETHER} className="ml-2" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <MyCardInfos
          style={"w-full px-5 pb-3 ml-5 transition-all "}
          arr={info1}
        >
          <p className="text-[8px] mt-4 text-white/40">
            {state?.launchpad?.datas?.address}
          </p>
        </MyCardInfos>
        <MyCardInfos
          style={"w-full px-5 pb-3 ml-5 transition-all "}
          arr={info2}
        >
          <p className="text-[8px] mt-4 text-white/40">
            {state?.launchpad?.datas?.address}
          </p>
        </MyCardInfos>
      </div>
    </div>
  );
};
