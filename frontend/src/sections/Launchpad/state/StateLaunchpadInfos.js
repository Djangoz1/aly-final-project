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
      title: <>Capitalization min</>,
      num:
        state?.launchpad?.datas &&
        parseInt(
          ethers?.utils?.formatEther(state?.launchpad?.datas?.minCap)
        ).toFixed(3),
      value: " ETH",
    },
    {
      title: <>Capitalization max</>,
      num:
        state?.launchpad?.datas &&
        parseInt(
          ethers?.utils?.formatEther(state?.launchpad?.datas?.maxCap)
        ).toFixed(3),
      value: " ETH",
    },
    {
      title: <>Min invest</>,
      num:
        state?.launchpad?.datas &&
        parseInt(
          ethers?.utils.formatEther(state?.launchpad?.datas?.minInvest)
        ).toFixed(3),
      value: " ETH",
    },
    {
      title: <>Max invest</>,
      num:
        state?.launchpad?.datas &&
        parseInt(
          ethers?.utils.formatEther(state?.launchpad?.datas?.maxInvest)
        ).toFixed(3),
      value: " ETH",
    },
    {
      title: "Total participants",
      num: parseInt(state?.launchpad?.datas?.totalUser),
    },
    {
      title: "Launchpad contract",
      value: state?.launchpad?.metadatas?.title,
    },

    {
      title: "Balance contract",
      num: state?.launchpad?.datas?.amountRaised,
      value: " ETH",
    },
    {
      title: <>Started</>,
      value: <>{fromTimestamp(parseInt(state?.launchpad?.datas?.saleStart))}</>,
    },
    {
      title: <>Ended</>,
      value: <>{fromTimestamp(parseInt(state?.launchpad?.datas?.saleEnd))}</>,
    },
  ];

  return (
    <MyCardInfos style={"w-full px-5 pb-3  transition-all "} arr={info1}>
      <p className="text-[8px] mt-4 text-white/40">
        {state?.launchpad?.datas?.address}
      </p>
    </MyCardInfos>
  );
};
