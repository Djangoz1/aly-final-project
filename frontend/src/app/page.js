"use client";
import { Header } from "components/Header";
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
// import {
//   doAuthCV,
//   doAuthFactoryCV,
//   doAuthFactoryMission,
//   doAuthSigner,
//   useAuthDispatch,
//   useAuthState,
// } from "context/auth";
// import { useEffect } from "react";
// import { doMissionsState, useMissionDispatch } from "context/authMissions";
// import { Missions } from "sections/Missions";
// import { _getAllCVs } from "utils/ui-tools/cv-tools";
export default function Home() {
  const { address, isConnected } = useAccount();
  const { cv, missions } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (isConnected) {
      doAuthCV(dispatch, address);
    }
  }, [isConnected]);
  useEffect(() => {
    if (cv) {
      doAuthMission(dispatch, cv);
    }
  }, [cv]);

  // const { address, cv, factoryMission, factoryCv } = useAuthState();
  // const dispatch = useAuthDispatch();
  // const missionDispatch = useMissionDispatch();

  // useEffect(() => {
  //   doAuthSigner(dispatch);
  // }, [address]);

  // useEffect(() => {
  //   if (!factoryCv) doAuthFactoryCV(dispatch);
  //   if (!factoryMission && factoryCv) doAuthFactoryMission(dispatch);
  // }, [factoryCv, factoryMission]);

  // useEffect(() => {
  //   if (factoryCv && address) doAuthCV(dispatch, factoryCv, address);
  // }, [factoryCv, address]);

  // useEffect(() => {
  //   if (cv) doMissionsState(missionDispatch, cv);
  // }, [cv]);

  return (
    <main>
      <Header />
      <section>
        <Hero />
        <Missions />
      </section>
    </main>
  );
}
