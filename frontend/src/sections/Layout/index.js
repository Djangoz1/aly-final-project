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
import { MissionProvider } from "context/hub/mission";
import { ImagePin } from "components/Image/ImagePin";

export const Layout = ({ children, banniere }) => {
  const { address } = useAccount();
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (address) {
      doAuthCV(dispatch, address);
    }
  }, [address]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () =>
    sidebarOpen ? setSidebarOpen(false) : setSidebarOpen(true);
  return (
    <div
      className={`min-h-screen relative z-50  h-fit box-border overflow-x-hidden transition-all flex-col flex ml-auto`}
      style={{ width: sidebarOpen ? "82vw" : "94vw" }}
    >
      <Header setter={toggleSidebar} isOpen={sidebarOpen} />
      {banniere && (
        <div className="h-[44vh] absolute top-0 left-0 -z-50  w-full overflow-y-hidden">
          <ImagePin CID={banniere} style="relative opacity-80   w-full" />
        </div>
      )}
      <div
        className={`  flex flex-col  box-border mb-[8vh]  justify-center relative`}
      >
        {children}
      </div>
      {/* <div className="h-full   z-100 flex-auto relative px-5 py-2 bg-gray-100 my-5 rounded-2xl shadow-lg border border-black/5 w-[90%] mx-auto "> */}
      {/* </div> */}

      <Footer />
    </div>
  );
};
