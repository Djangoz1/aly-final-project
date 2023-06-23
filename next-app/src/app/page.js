"use client";
import { Header } from "components/Header";
import { Hero } from "components/Hero";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { useEffect } from "react";
export default function Home() {
  const { address, cvContract, status, error } = useAuthState();
  const dispatch = useAuthDispatch();
  useEffect(() => {
    doAuthCV(dispatch);
    // if (address) {
    // }
  }, []);
  return (
    <main>
      <Header />
      <section>
        <Hero />
      </section>
    </main>
  );
}
