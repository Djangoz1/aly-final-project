"use client";
import JobDescriptionComponent from '../services/JobDescriptionComponent';
import { Header } from "sections/Layout/Header";
import {
  doAuthCV,
  doAuthMission,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Hero } from "sections/Hero";
import { Missions } from "sections/Missions";
import { Layout } from "sections/Layout";
import { ListStatsFeature } from "components/stats/lists/ListStatsFeature";
import { ADDRESSES } from "constants/web3";
import { HeroLaunchpad } from "sections/Hero/HeroLaunchpad";
import { MyCard } from "components/myComponents/MyCard";
import { Icon } from "@iconify/react";
import { icfySEARCH } from "icones";
import { inputStyle } from "styles/style";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  const spans = ["community", "confidence", "efficiency"];
  const [isSpan, setIsSpan] = useState(0);
  useEffect(() => {
    if (isConnected) {
      doAuthCV(dispatch, address);
    }
  }, [isConnected]);
  useEffect(() => {
    setTimeout(() => {
      setIsSpan(isSpan + 1 < spans.length ? isSpan + 1 : 0);
    }, 5000);
  }, [isSpan]);

  // useEffect(() => {
  //   if (cv) {
  //     doAuthMission(dispatch, cv);
  //   }
  // }, [cv]);

  return (
    <>
      <Layout>
        <>
          <Hero />

          <div className="w-[90%] h-screen flex flex-col justify-evenly mx-auto">
            <h6 className="text-white text-center text-[35px] font-prim font-bold">
              Wwwork with{" "}
              <span className="font-black text-primary">{spans[isSpan]}</span>
            </h6>
          </div>
          <Missions />
        </>
      </Layout>
    </>
  );
}
