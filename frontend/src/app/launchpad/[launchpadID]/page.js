"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import { stateLaunchpad } from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { CVOverview } from "sections/Profile/state/CVOverview";

import { LaunchpadProfile } from "sections/Launchpad/state/LaunchpadProfile";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { ethers } from "ethers";
import { fromTimestamp } from "utils/ux-tools";
import { STATUS } from "constants/status";
import Link from "next/link";

function App({ params }) {
  const { cv } = useAuthState();

  const tools = useToolsState();
  const { state, status } = useToolsState();

  let [isState, setIsState] = useState(null);

  const launchpadID = params.launchpadID;

  let fetch = async () => {
    let launchpad = await stateLaunchpad(launchpadID);

    let _state = {
      launchpad: {
        datas: launchpad.datas,
        launchpadID: launchpad.launchpadID,
        metadatas: launchpad.metadatas,
      },
      owner: launchpad.owner,
    };

    setIsState(_state);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [launchpadID, status]);
  console.log("state launchpad page", state);
  return (
    <MyLayoutApp
      particles={true}
      id={launchpadID}
      url={`/launchpad/${launchpadID}`}
      ownerProfile={
        <AssetProfile1
          target={"owner"}
          metadatas={state?.owner}
          cvID={state?.owner?.cvID}
        />
      }
      side={
        <div className="flex flex-col  ml-auto w-full  justify-end">
          <h6 className="text-white text-right mb-3">
            {state?.launchpad?.datas?.tokenName}
          </h6>
          <div className="flex  ml-auto  mb-5 w-2/3  flex-col">
            <div className="flex text-xs justify-end items-end">
              <Icon icon={icfy.bank.bag} className="text-2xl mr-3" />
              <span>{state?.launchpad?.datas?.allowance}</span>
            </div>
            <div className="flex text-xs justify-end items-end">
              <Icon icon={icfy.person.team} className="text-2xl mr-3" />

              <span>{parseInt(state?.launchpad?.datas?.totalUser)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end mb-1">
            <Icon icon={icfyETHER} className="text-white c2 text-[74px]" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/40">Récoltés</span>
              <p className="text-sm">
                <span>{state?.launchpad?.datas?.amountRaised}</span>
                <span className="text-white c2 text-sm ml-3">ETH</span>
              </p>
              <span className="text-xs text-white/40">Token price</span>
              <p className="text-sm">
                <span>{state?.launchpad?.datas?.tokenPrice}</span>
                <span className="text-white c2 text-sm ml-3">ETH</span>
              </p>
            </div>
          </div>

          <div
            className={`flex items-center  p-3 mt-3 ml-auto badge badge-outline badge-xs text-xs badge-${
              STATUS.launchpad?.[state?.launchpad?.datas?.status]?.color
            }`}
          >
            <Icon
              icon={STATUS.launchpad[state?.launchpad?.datas?.status]?.icon}
              className="text-lg mr-4"
            />
            {STATUS.launchpad[state?.launchpad?.datas?.status]?.status}
          </div>
          <Link
            href={"/edit/launchpad/" + launchpadID}
            className="btn btn-xs btn-outline"
          >
            Invest on token
          </Link>
        </div>
      }
      subMenus={[
        { title: "", tag: "1" },
        { title: "descriptions", tag: "description" },
        { title: "Rules", tag: "rules" },
        { title: "Overview", tag: "overview" },
      ]}
      target={""}
      initState={isState}
    >
      <Viewport
        img={state?.launchpad?.metadatas?.attributes?.[0]?.banniere}
        id={"1"}
        index={0}
      >
        <div className="mt-auto">
          <LaunchpadProfile />
        </div>
      </Viewport>

      <Viewport id={"cv"} index={1}>
        <div
          className="backdrop-blur  mr-4 w-full  h-[75vh] p-5 text-xs rounded-lg shadow overflow-scroll hide-scrollbar  text-justify whitespace-break-spaces"
          noBtn={true}
        >
          {state?.launchpad?.metadatas?.description}
        </div>
      </Viewport>
      <Viewport id={"missions"} index={2}>
        <div className="backdrop-blur w-full flex flex-col">
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Total participants</p>
            <span>{parseInt(state?.launchpad?.datas?.totalUser)}</span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Launchpad contract</p>
            <span>{state?.launchpad?.metadatas?.title}</span>
            <span className="text-[10px]">
              {state?.launchpad?.datas?.address}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Balance Token owner</p>
            <span>{state?.launchpad?.datas?.balanceOwner}</span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Allowance Contract</p>
            <span>{state?.launchpad?.datas?.allowance} Tokens</span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Balance Contract</p>
            <span>{state?.launchpad?.datas?.amountRaised} ETH</span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Round actuel</p>
            <span>
              {state?.launchpad?.datas?.currentTier + 1}/
              {state?.launchpad?.datas?.numberOfTier}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Token contract</p>
            <span>
              {state?.launchpad?.datas?.tokenName}{" "}
              {state?.launchpad?.datas?.tokenSymbol}
            </span>
            <span className="text-[10px]">
              {state?.launchpad?.datas?.tokenAddress}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">
              Capitalization <span className="text-[10px]">min / max</span>
            </p>
            <span>
              {state?.launchpad?.datas &&
                ethers?.utils?.formatEther(state?.launchpad?.datas?.minCap)}
              /
              {state?.launchpad?.datas &&
                ethers?.utils?.formatEther(
                  state?.launchpad?.datas?.maxCap
                )}{" "}
              ETH
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">
              Invest allowance <span className="text-[10px]">min / max</span>
            </p>
            <span>
              {state?.launchpad?.datas &&
                ethers?.utils.formatEther(state?.launchpad?.datas?.minInvest)}
              /
              {state?.launchpad?.datas &&
                ethers?.utils.formatEther(
                  state?.launchpad?.datas?.maxInvest
                )}{" "}
              ETH
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Started</p>
            <span>
              {fromTimestamp(parseInt(state?.launchpad?.datas?.saleStart))}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Ended</p>
            <span>
              {fromTimestamp(parseInt(state?.launchpad?.datas?.saleEnd))}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-white/40">Locked time</p>
            <span>{parseInt(state?.launchpad?.datas?.lockedTime)}</span>
          </div>
        </div>
      </Viewport>
      <Viewport id={"overview"} index={3}>
        <CVOverview />
      </Viewport>
    </MyLayoutApp>
  );
}

export default App;
