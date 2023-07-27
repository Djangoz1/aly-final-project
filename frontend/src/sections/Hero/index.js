"use client";
import React, { useEffect, useState } from "react";
import { heroEntreprise, heroWorker, stateCV } from "constants/text";

import { Workflow } from "components/Workflow";

import Link from "next/link";

import { MyTabs } from "components/myComponents/MyTabs";
import { Scene } from "spline/Scene";
import { MyBottomSection, MySection } from "components/myComponents/MySection";
import { brainstorming } from "constants/spline";
import {
  _getterFactoryCV,
  _getterMissionsHub,
} from "utils/ui-tools/web3-tools";
import { LinearGradient } from "react-text-gradients";

export const Hero = () => {
  const heroStatus = [heroEntreprise, heroWorker];
  const [isTabs, setIsTabs] = useState(heroStatus[0]);
  console.log(isTabs);
  const [cvLength, setCvLength] = useState(null);
  const [missionLength, setMissionLength] = useState(null);
  useEffect(() => {
    getStats();
  }, []);

  const stats = [
    { title: "Jobs Proposition", value: missionLength },
    { title: "Jobs completed", value: "100" },
    { title: "Enterprises", value: cvLength },
    { title: "Total paid", value: "1000 USDT" },
  ];
  const getStats = async () => {
    if (!cvLength) {
      const _cvLength = parseInt(await _getterFactoryCV("getCvIds"));
      setCvLength(_cvLength);
    }
    if (!missionLength) {
      const _missionLength = parseInt(
        await _getterMissionsHub("getTokensLength")
      );

      setMissionLength(_missionLength);
    }
  };
  return (
    <div className="flex flex-col">
      <MySection>
        <div className="flex flex-col ">
          <MyTabs arr={heroStatus} setter={setIsTabs} value={isTabs} />

          <div className="flex justify-between items-center mb-5">
            <div className="w-[35vw]  mr-auto ">
              <div className="flex flex-col mb-5">
                <h4 className="text-white text-2xl font-black">
                  <LinearGradient gradient={["to left", "red , cyan"]}>
                    {isTabs?.title}
                  </LinearGradient>
                </h4>
                <h4 className="text-white/80 text-2xl font-black">
                  <LinearGradient gradient={["to right", "red , cyan"]}>
                    {isTabs?.subtitle}
                  </LinearGradient>
                </h4>
              </div>
              <p>{isTabs.description}</p>
              <div className="join mt-4">
                <div className="btn btn-primary">
                  <Link href={"profile/mission"}>Create a Mission</Link>
                </div>
              </div>
            </div>
            <div>
              <Scene url={brainstorming} />
            </div>
          </div>
          <Workflow steps={isTabs?.steps} />
        </div>
      </MySection>
      <MyBottomSection stats={stats} />
    </div>
  );
};
