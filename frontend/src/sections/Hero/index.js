"use client";
import React, { useState } from "react";
import { heroEntreprise, heroWorker, stateCV } from "constants/text";

import { Workflow } from "components/Workflow";
import { HeroStats } from "components/stats/HeroStats";

import Link from "next/link";
import { TabsStateCV } from "components/tabs/TabsStateCV";

export const Hero = () => {
  const [isWorker, setIsWorker] = useState(false);
  const heroStatus = [heroEntreprise, heroWorker];

  return (
    <div className="flex flex-col   justify-center mx-auto">
      <TabsStateCV setIsWorker={setIsWorker} isWorker={isWorker} />
      <div className="flex justify-between mb-5">
        <div className="w-[35vw] ">
          <div className="flex flex-col mb-5">
            <h4 className="text-black text-2xl font-black">
              {isWorker ? heroWorker.title : heroEntreprise.title}
            </h4>
            <h4 className="text-black text-2xl font-black">
              {isWorker ? heroWorker.subtitle : heroEntreprise.subtitle}
            </h4>
          </div>
          <p>
            {isWorker ? heroWorker.description : heroEntreprise.description}
          </p>
          <div className="join mt-4">
            <div className="btn btn-primary">
              <Link href={"profile/mission"}>Create a Mission</Link>
            </div>
          </div>
        </div>
        <HeroStats
          statistics={
            isWorker ? heroWorker.statistic : heroEntreprise.statistic
          }
        />
      </div>
      <Workflow
        isWorker={isWorker}
        workerSteps={heroWorker?.steps}
        entrepriseSteps={heroEntreprise?.steps}
      />
    </div>
  );
};
