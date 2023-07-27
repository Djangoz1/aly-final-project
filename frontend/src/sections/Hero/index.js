"use client";
import React, { useState } from "react";
import { heroEntreprise, heroWorker, stateCV } from "constants/text";

import { Workflow } from "components/Workflow";
import { HeroStats } from "components/stats/HeroStats";

import Link from "next/link";

import { MyTabs } from "components/myComponents/MyTabs";
import { Rocket } from "spline/Rocket";

export const Hero = () => {
  const heroStatus = [heroEntreprise, heroWorker];
  const [isTabs, setIsTabs] = useState(heroStatus[0]);
  console.log(isTabs);
  return (
    <div className="flex flex-col   justify-center mx-auto">
      <MyTabs arr={heroStatus} setter={setIsTabs} value={isTabs} />

      <div className="flex justify-between mb-5">
        <div className="w-[35vw] ">
          <div className="flex flex-col mb-5">
            <h4 className="text-white text-2xl font-black">{isTabs?.title}</h4>
            <h4 className="text-white/80 text-2xl font-black">
              {isTabs?.subtitle}
            </h4>
          </div>
          <p>{isTabs.description}</p>
          <div className="join mt-4">
            <div className="btn btn-primary">
              <Link href={"profile/mission"}>Create a Mission</Link>
            </div>
          </div>
        </div>
        <HeroStats statistics={isTabs?.statistic} />
      </div>
      <Workflow steps={isTabs?.steps} />
    </div>
  );
};
