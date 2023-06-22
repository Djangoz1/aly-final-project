"use client";
import React, { useState } from "react";
import { heroEntreprise, heroWorker } from "constants/text";

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
            <button className="btn mr-4 btn-primary">
              {isWorker ? heroWorker.button : heroEntreprise.button}
            </button>
            <button className="btn btn-outline btn-primary">
              {isWorker ? heroWorker.button2 : heroEntreprise.button2}
            </button>
          </div>
        </div>
        <div className="w-[21vw] h-fit flex flex-wrap">
          {isWorker
            ? heroWorker?.statistic?.map((stat) => (
                <div
                  key={stat.title}
                  className="w-[10vw] h-[10vh] flex flex-col bg-zinc-800 rounded shadow shadow-2xl m-1 items-center justify-center"
                >
                  <span className="text-white text-2xl">{stat.number}</span>
                  <p>{stat.title}</p>
                </div>
              ))
            : heroEntreprise?.statistic?.map((stat) => (
                <>
                  <div className="w-[10vw] h-[10vh] flex flex-col bg-zinc-800 rounded shadow shadow-2xl m-1 items-center justify-center">
                    <span className="text-white text-2xl">{stat.number}</span>
                    <p>{stat.title}</p>
                  </div>
                </>
              ))}
        </div>
        <div className="flex flex-col ml-auto">
          <h4 className="text-white text-2xl font-black">Workflow</h4>
          <ul className="steps steps-vertical">
            {isWorker
              ? heroWorker?.steps?.map((step) => (
                  <li className="step">{step}</li>
                ))
              : null}
            {!isWorker
              ? heroEntreprise?.steps?.map((step) => (
                  <li className="step">{step}</li>
                ))
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
};
