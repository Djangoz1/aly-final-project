"use client";
import { Footer } from "sections/Layout/Footer";
import { Header } from "sections/Layout/Header";
import {
  doAuthCV,
  doAuthMission,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Layout = ({ children }) => {
  const { address } = useAccount();
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (address) {
      doAuthCV(dispatch, address);
    }
  }, [address]);

  useEffect(() => {
    if (cv) {
      console.log("ilmm");
      doAuthMission(dispatch, cv);
    }
  }, [cv]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () =>
    sidebarOpen ? setSidebarOpen(false) : setSidebarOpen(true);
  return (
    <div
      className={`page   min-h-screen relative  h-fit box-border overflow-x-hidden transition-all flex-col flex ml-auto`}
      style={{ width: sidebarOpen ? "82vw" : "94vw" }}
    >
      <Header setter={toggleSidebar} isOpen={sidebarOpen} />
      <div className="  flex flex-col  box-border mb-[8vh] relative justify-center">
        {children}
      </div>
      {/* <div className="h-full   z-100 flex-auto relative px-5 py-2 bg-gray-100 my-5 rounded-2xl shadow-lg border border-black/5 w-[90%] mx-auto "> */}
      {/* </div> */}

      <Footer />
    </div>
  );
};
