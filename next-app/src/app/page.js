"use client";
import { Header } from "components/Header";
import { Hero } from "components/Hero";
import {
  doAuthCV,
  doAuthFactoryCV,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { useEffect } from "react";
export default function Home() {
  const { address, cvContract, factoryCv, status, error } = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    doAuthFactoryCV(dispatch);
    // if (address) {
    // }
  }, []);

  useEffect(() => {
    if (factoryCv && address) {
      doAuthCV(dispatch, factoryCv, address);
    }
  }, [factoryCv, address]);
  console.log(error);
  // console.log(factoryCV)
  return (
    <main>
      <Header />
      <section>
        <Hero />
      </section>
    </main>
  );
}
