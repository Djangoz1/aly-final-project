"use client";
import React, { useState } from "react";
import { heroEntreprise, heroWorker } from "constants/text";

import { Workflow } from "components/Workflow";
import { HeroStats } from "components/stats/HeroStats";

import Link from "next/link";

export const Hero = () => {
  const [isWorker, setIsWorker] = useState(false);
  const heroStatus = [heroEntreprise, heroWorker];

  return (
    <div className="flex flex-col   justify-center mx-auto">
      <div className="tabs mb-5 flex   w-full justify-start">
        {heroStatus.map((status, index) => (
          <button
            key={index}
            className={`tab tab-bordered text-black ${
              index === 0 && !isWorker
                ? "border-primary  "
                : index === 1 && isWorker
                ? "border-primary  "
                : ""
            }`}
            onClick={() =>
              index === 0
                ? setIsWorker(false)
                : index === 1
                ? setIsWorker(true)
                : null
            }
          >
            {status?.tab}
          </button>
        ))}
      </div>
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
