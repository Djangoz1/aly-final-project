"use client";
import { ImagePin } from "components/Image/ImagePin";
import { LaunchpadDescription } from "components/Launchpad/LaunchpadDescription";
import { LaunchpadHistory } from "components/Launchpad/LaunchpadHistory";
import { LaunchpadIdentity } from "components/Launchpad/LaunchpadIdentity";
import { LaunchpadStats } from "components/Launchpad/LaunchpadStats";
import { MySection } from "components/myComponents/MySection";
import React, { useEffect, useState } from "react";
import { Layout } from "sections/Layout";
import { getLaunchpadDatas } from "utils/ui-tools/launchpad-tools";

const LaunchpadPage = ({ params }) => {
  const launchAddr = params.address;

  const [isDatas, setIsDatas] = useState(null);
  const getDatas = async () => {
    const datas = await getLaunchpadDatas(launchAddr);
    setIsDatas(datas);
  };
  useEffect(() => {
    if (launchAddr && !isDatas) getDatas();
  }, [launchAddr]);
  return (
    <Layout>
      <MySection>
        <div className="relative w-full">
          <div className="h-[30vh] overflow-hidden w-full absolute">
            <div className="h-[60vh] absolute z-0 w-full ">
              <ImagePin CID={isDatas?.metadata?.image} />
            </div>
          </div>
          <div className="flex justify-evenly flex-wrap mt-[10vh]">
            <div className="flex flex-col">
              <LaunchpadStats datas={isDatas} />
              <LaunchpadDescription datas={isDatas} />
            </div>
            <div className="flex flex-col">
              <LaunchpadIdentity datas={isDatas} />
              <LaunchpadHistory datas={isDatas} />
            </div>
          </div>
        </div>
      </MySection>
    </Layout>
  );
};

export default LaunchpadPage;
