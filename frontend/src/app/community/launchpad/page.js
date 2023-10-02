"use client";

import { sectionCommunity } from "constants/text";
import React, { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { useRouter } from "next/navigation";

import { MySection } from "components/myComponents/MySection";

import { styles } from "styles/style";
import { Scene } from "spline/Scene";

import { spline } from "constants/spline";
import { CreateLaunchpad } from "sections/Launchpad/form/CreateLaunchpad";
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
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";

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
    <Layout>
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>

      <MySection styles={"flex font2 flex-col "}>
        <HeroLaunchpad />
        {isList?.map((el) => (
          <LaunchpadCard id={el} key={v4()} />
          // <MyAsset
          //   key={v4()}
          //   url={`/launchpad/${el?.datas?.id}`}
          //   banniere={el?.metadatas?.attributes?.[0]?.banniere}
          //   image={el?.metadatas?.image}
          //   title={el?.metadatas?.title}
          //   description={el?.metadatas?.description}
          //   details={[
          //     {
          //       title: "Fundraising goal",
          //       value: (
          //         <>
          //           {ethers.utils.formatEther(`${el?.datas?.maxCap}`)}
          //           <span className="text-white/40 ml-1">ETH</span>
          //         </>
          //       ),
          //     },
          //     {
          //       title: "Token price",
          //       value: (
          //         <>
          //           ~ {el?.datas?.tokenPrice}
          //           <span className="text-white/40 ml-1">ETH</span>
          //         </>
          //       ),
          //     },

          //     {
          //       value: "Token sale start",
          //       title: <>{fromTimestamp(parseInt(el?.datas?.saleStart))}</>,
          //     },
          //   ]}
          // />
        ))}
      </MySection>
    </Layout>
  );
};

export default LaunchpadPage;
