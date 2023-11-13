"use client";

import React, { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { useRouter } from "next/navigation";

import { MySection } from "components/myComponents/MySection";

import { styles } from "styles/style";
import { Scene } from "spline/Scene";

import { ADDRESSES } from "constants/web3";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { MyAsset } from "components/myComponents/MyAsset";
import { useAuthState } from "context/auth";
import { v4 } from "uuid";
import { ethers } from "ethers";
import { fromTimestamp } from "utils/ux-tools";
import { stateLaunchpad } from "utils/ui-tools/state-tools";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { icfy, icfyROCKET } from "icones";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import Link from "next/link";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { LinearGradient } from "react-text-gradients";

const LaunchpadPage = () => {
  let [isList, setIsList] = useState(null);

  let { metadatas, cv } = useAuthState();
  let fetchLaunchpads = async () => {
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])
    );
    let arr = [];
    for (let index = 1; index <= length; index++) {
      arr.push(index);
    }
    setIsList(arr);
  };

  useEffect(() => {
    if (!isList) {
      fetchLaunchpads();
    }
  }, [cv]);

  return (
    <>
      <MyLayoutApp styles={"flex font2 flex-col "}>
        <Viewport full={true} id={"hero"} index={0}>
          <div className="mt-auto justify-end mb-10 flex flex-col">
            <LinearGradient
              className="text-xs w-fit leading-0 font2 uppercase"
              gradient={[
                "to right",
                "rgba(201,78,21,0.92), rgba(201,21,103,1)",
              ]}
            >
              Powered by community
            </LinearGradient>
            <h1
              className={
                styles.hero +
                " text-4xl font-bold text-white md:text-5xl w-fit "
              }
            >
              <LinearGradient
                className="font-ligth"
                gradient={["to left", "rgba(191,208,191,1), rgba(62,62,62,1)"]}
              >
                Growth your
                <br />
                <span className="font-semibold">startups</span>
                <br />
                right from
                <br />
                <span className="font-semibold">scratch</span>
              </LinearGradient>
            </h1>
          </div>
        </Viewport>
        <Viewport id={"services"} full={true} index={1}>
          <div className="  my-auto font2">
            <h2
              className={`text-center font-light text-white/20 text-[34px] mb-[6vh]`}
            >
              <Hg style={"font-light"}>Owner</Hg> |{" "}
              <Hg1 style={"font-light "}>Investor</Hg1>
            </h2>
            <div className="flex justify-evenly">
              <MyCardIc
                icon={icfy.ux.flag}
                title={"Launch Project"}
                url={"/create/launchpad"}
                btn={"Create Launchpad"}
              />
              <MyCardIc icon={icfy.ux.mediation} title={"Manage Launchpad"} />
              <MyCardIc icon={icfy.bank.coin} title={"Standard ERC20"} />
              <MyCardIc icon={icfy.bank.bag} title={"Invest on Launchpad"} />
            </div>
          </div>
        </Viewport>
      </MyLayoutApp>
    </>
  );
};

export default LaunchpadPage;
