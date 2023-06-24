"use client";
import React, { useState } from "react";
import { heroEntreprise, heroWorker } from "constants/text";
import { useAuthState } from "context/auth";
import { _getCVsLength } from "utils/auth-tools";
import { Workflow } from "components/Workflow";
import { HeroStats } from "components/stats/HeroStats";
import { ModalCreateMission } from "components/modal/ModalCreateMission";

export const Hero = () => {
  const [isWorker, setIsWorker] = useState(false);
  const heroStatus = [heroEntreprise, heroWorker];

  return (
    <div className="flex flex-col w-[70%]  justify-center mx-auto">
      <div className="tabs mb-5 flex   w-full justify-start">
        {heroStatus.map((status, index) => (
          <button
            key={index}
            className={`tab tab-bordered ${
              index === 0 && !isWorker
                ? "border-primary text-white"
                : index === 1 && isWorker
                ? "border-primary text-white"
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
      <div className="flex justify-between">
        <div className="w-[35vw] ">
          <div className="flex flex-col mb-5">
            <h4 className="text-white text-2xl font-black">
              {isWorker ? heroWorker.title : heroEntreprise.title}
            </h4>
            <h4 className="text-white text-2xl font-black">
              {isWorker ? heroWorker.subtitle : heroEntreprise.subtitle}
            </h4>
          </div>
          <p>
            {isWorker ? heroWorker.description : heroEntreprise.description}
          </p>
          <div className="join mt-4">
            <ModalCreateMission />
            {/* <ModalCreateMission /> */}
          </div>
        </div>
        <HeroStats
          statistics={
            isWorker ? heroWorker.statistic : heroEntreprise.statistic
          }
        />
        <Workflow
          isWorker={isWorker}
          workerSteps={heroWorker?.steps}
          entrepriseSteps={heroEntreprise?.steps}
        />
      </div>
    </div>
  );
};
