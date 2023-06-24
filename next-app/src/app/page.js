"use client";
import { Header } from "components/Header";
import { Hero } from "sections/Hero";
import {
  doAuthCV,
  doAuthFactoryCV,
  doAuthFactoryMission,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { useEffect } from "react";
export default function Home() {
  const { address, cvContract, factoryMission, factoryCv, status, error } =
    useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    if (!factoryCv) {
      doAuthFactoryCV(dispatch);
    }
    if (!factoryMission && factoryCv) {
      doAuthFactoryMission(dispatch);
    }

    // if (address) {
    // }
  }, [factoryCv, factoryMission]);

  useEffect(() => {
    if (factoryCv && address) {
      doAuthCV(dispatch, factoryCv, address);
    }
  }, [factoryCv, address]);

  return (
    <main>
      <Header />
      <section>
        <Hero />
      </section>
    </main>
  );
}
