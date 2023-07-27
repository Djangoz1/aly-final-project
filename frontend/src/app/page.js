"use client";
import { Header } from "sections/Layout/Header";
import {
  doAuthCV,
  doAuthMission,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Hero } from "sections/Hero";
import { Missions } from "sections/Missions";
import { Layout } from "sections/Layout";
import { ListStatsFeature } from "components/stats/lists/ListStatsFeature";
import { ADDRESSES } from "constants/web3";
import { HeroLaunchpad } from "sections/Hero/HeroLaunchpad";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (isConnected) {
      doAuthCV(dispatch, address);
    }
  }, [isConnected]);
  // useEffect(() => {
  //   if (cv) {
  //     doAuthMission(dispatch, cv);
  //   }
  // }, [cv]);

  return (
    <>
      <Layout>
        <>
          <HeroLaunchpad />
          <Hero />
          <Missions />
        </>
      </Layout>
    </>
  );
}
