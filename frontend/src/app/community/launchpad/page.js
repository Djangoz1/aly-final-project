"use client";

import React, { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { useRouter } from "next/navigation";

import { MySection } from "components/myComponents/MySection";

import { styles } from "styles/style";
import { Scene } from "spline/Scene";

import { spline } from "constants/spline";

import { HeroLaunchpad } from "sections/Launchpad/HeroLaunchpad";
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
        <Viewport particles={true} full={true} id={"hero"} index={0}>
          <HeroLaunchpad />
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
              <MyCardInfo
                styles={"w-[23%]"}
                color={2}
                header={{
                  icon: icfy.ux.flag,
                  title: "Launch Project",
                }}
                btn={{
                  component: (
                    <Link
                      className="btn btn-xs btn-outline c2"
                      href="/create/launchpad"
                    >
                      Create Launchpad
                    </Link>
                  ),
                }}
              />
              <MyCardInfo
                styles={"w-[23%]"}
                color={2}
                header={{
                  icon: icfy.ux.mediation,
                  title: "Manage Launchpad",
                }}
              />
              <MyCardInfo
                styles={"w-[23%]"}
                color={1}
                header={{
                  icon: icfy.bank.coin,
                  title: "Standard ERC20",
                }}
              />
              <MyCardInfo
                styles={"w-[23%]"}
                color={1}
                header={{
                  icon: icfy.bank.bag,
                  title: "Invest on Launchpad",
                }}
              />
            </div>
          </div>
        </Viewport>
      </MyLayoutApp>
    </>
  );
};

export default LaunchpadPage;
