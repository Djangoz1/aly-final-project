"use client";
import { Header } from "components/Header";
import { Hero } from "sections/Hero";
import {
  doAuthCV,
  doAuthFactoryCV,
  doAuthFactoryMission,
  doAuthSigner,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { useEffect } from "react";
import { doMissionsState, useMissionDispatch } from "context/authMissions";
import { Missions } from "sections/Missions";
export default function Home() {
  const { address, cv, factoryMission, factoryCv } = useAuthState();
  const dispatch = useAuthDispatch();
  const missionDispatch = useMissionDispatch();

  useEffect(() => {
    doAuthSigner(dispatch);
  }, [address]);

  useEffect(() => {
    if (!factoryCv) doAuthFactoryCV(dispatch);
    if (!factoryMission && factoryCv) doAuthFactoryMission(dispatch);
  }, [factoryCv, factoryMission]);

  useEffect(() => {
    if (factoryCv && address) doAuthCV(dispatch, factoryCv, address);
  }, [factoryCv, address]);

  useEffect(() => {
    if (cv) doMissionsState(missionDispatch, cv);
  }, [cv]);

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
