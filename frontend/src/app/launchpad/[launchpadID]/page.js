"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";

import { LayoutMission } from "sections/works/Missions/LayoutMission";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import {
  MyCard,
  MyCard1,
  MyCardList,
} from "components/myComponents/card/MyCard";
import { icfy, icfyETHER, icfyROCKET } from "icones";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doStateCV } from "context/hub/cv";

import { MyCalendar } from "components/myComponents/MyCalendar";
import { MENUS_EDIT } from "constants/menus";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { useAccount } from "wagmi";
import { LayoutLaunchpad } from "sections/Launchpad/LayoutLaunchpad";
import { useLaunchpadState } from "context/hub/launchpad";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Hg } from "components/text/HeroGradient";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import useSpline from "@splinetool/r3f-spline";
import { OrthographicCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Spline from "@splinetool/react-spline";
import { FormProvider, useFormState } from "context/form";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
export default function PageLaunchpad({ params }) {
  const launchpadID = params.launchpadID;
  let { address } = useAccount();
  let state = useMissionState();

  return (
    <LayoutLaunchpad id={launchpadID}>
      <Page />
    </LayoutLaunchpad>
  );
}

let Page = () => {
  let state = useLaunchpadState();

  let submitInvest = async (form) => {
    console.log("form", form);
    let value = ethers.utils.parseEther(form?.value)._hex;
    let hash = await _apiPost(
      "buyTokens",
      [parseInt(state.launchpadID)],
      value
    );
    console.log(hash);
  };

  let tier = state?.datas?.tiersDatas?.[state?.datas?.currentTier];
  return (
    <div className="flex">
      <div className="w-3/4 mr-12">
        <MyCard1
          color={2}
          head={{
            component: (
              <>
                <div className="flex items-center">
                  <span className="text-white  text-xs flex flex-col items-center mr-3">
                    <Icon icon={icfyETHER} className="text-4xl text-white" />{" "}
                    <Hg>Price</Hg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-2xl text-white items-center flex ">
                      {ethers.utils.formatEther(`${tier?.tokenPrice || 0}`)}
                      <Hg style="text-lg ml-2">ETH</Hg>{" "}
                      <span className="text-xs ml-2 text-white/20">
                        {" "}
                        per Tokens
                      </span>
                    </span>
                    <div
                      className={`badge badge-sm badge-outline py-2 px-4 badge-${
                        STATUS.launchpad[state?.datas?.status]?.color
                      }`}
                    >
                      <Icon
                        icon={STATUS.launchpad[state?.datas?.status]?.icon}
                        className="mr-4  text-sm"
                      />
                      {STATUS.launchpad[state?.datas?.status]?.status}
                    </div>
                  </div>
                </div>
                <div className="flex ml-auto items-center text-xs ">
                  <MyCountdown timestamp={parseInt(state?.datas?.saleEnd)} />
                  <Icon
                    icon={icfy.ux.calendar}
                    className="ml-4 text-4xl text-white"
                  />
                </div>
              </>
            ),
          }}
        >
          <p className="w-full text-xs mt-5  whitespace-break-spaces text-justify">
            {state?.metadatas?.description}
          </p>
        </MyCard1>
      </div>
      <div className="w-1/4">
        <MyCard1
          color={2}
          head={{
            icon: icfy.bank.coin,
            title: (
              <div className="flex flex-col">
                <div className="flex items-center">
                  {state?.datas?.tokenName}
                  <span className="text-xs ml-3">
                    ({state?.datas?.tokenSymbol})
                  </span>
                </div>
              </div>
            ),
          }}
          menus={["Owner", "Token"]}
          styles={"mb-5"}
          components={[
            <div className="flex  w-full flex-col">
              <ProfileAvatar
                component={
                  <p className="text-[10px] ">
                    {state?.owner?.attributes?.[0]?.identity?.email}
                  </p>
                }
                metadatas={state?.owner}
                cvID={state?.datas?.owner}
              />

              <h6 className="text-xs w-full border-t-1 mt-4 pt-2 border border-x-0 border-b-0 border-white/10  text-white/40">
                Balance owner
              </h6>
              <p className="text-lg">
                {state?.datas?.balanceOwner}
                <span className="text-xs  ml-2">Tokens</span>
              </p>
              <h6 className="text-xs w-full mt-2  text-white/40">
                Balance contract
              </h6>

              <p className="text-lg">
                {state?.datas?.amountRaised}
                <span className="text-xs ml-2">ETH</span>
              </p>
              <span className="mt-2 text-white/40 text-[8px]">
                {state?.datas?.tokenAddress}
              </span>
            </div>,
            <div className="flex flex-col w-full">
              <h6 className="text-xs text-white/40">Tokens pool</h6>
              <p className="text-lg">{state?.datas?.allowance}</p>
              <h6 className="text-xs text-white/40">Tokens price</h6>
              <p className="text-lg flex  items-center">
                {state?.datas?.tokenPrice} <Icon icon={icfyETHER} />
              </p>
              <h6 className="text-xs text-white/40">Locked time</h6>
              <p className="text-lg flex  items-center">
                {parseInt(state?.datas?.lockedTime)} day(s)
              </p>

              <MyFormModal
                submit={submitInvest}
                components={[
                  <MyInput
                    min={ethers.utils.formatEther(state?.datas?.minInvest || 0)}
                    max={ethers.utils.formatEther(state?.datas?.maxInvest || 0)}
                    step={0.1}
                    type={"number"}
                    target={"value"}
                  />,
                ]}
                styles={{
                  modal: "w-[30vw] h-fit",
                  btn: "ml-auto gb2 mt-2 w-fit btn-xs",
                }}
                arr={[
                  {
                    title: (
                      <span className={"flex"}>
                        <Icon icon={icfyROCKET} className="text-error mr-4" />{" "}
                        Invest on launchpad
                      </span>
                    ),
                    description: (
                      <>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        In harum beatae earum, placeat repellendus sequi
                        reprehenderit libero necessitatibus magni voluptate sint
                        aut! Labore aut sint suscipit fugit reiciendis. Aliquam,
                        explicabo!
                      </>
                    ),
                  },
                ]}
                stateInit={{
                  form: {
                    value: null,
                  },
                  placeholders: {
                    value: "300 ETH",
                  },
                }}
                btn={"Participate"}
              />
            </div>,
          ]}
        ></MyCard1>
        <MyCardList
          color={2}
          head={{ title: "Informations", icon: icfyROCKET }}
          arr={[
            { title: "Owner", value: <CVName metadata={state?.owner} /> },
            {
              title: "Min invest",
              value: ethers?.utils?.formatEther?.(state?.datas?.minCap || 0),
            },
            {
              title: "Max invest",
              value: ethers?.utils?.formatEther?.(state?.datas?.maxCap || 0),
            },
            { title: "Nombre de rounds", value: state?.datas?.numberOfTier },
            {
              title: (
                <span className=" text-white/40 absolute bottom-0 text-[8px]">
                  {state?.datas?.address}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
