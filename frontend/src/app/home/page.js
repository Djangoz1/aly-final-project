"use client";
import Spline from "@splinetool/react-spline";
import { homePage } from "constants/spline";
import React from "react";
import { Scene } from "spline/Scene";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const splines = [
    {
      name: "msg-btn",
      url: "/community",
    },
    {
      name: "profile-btn",
      url: "/profile",
    },
    {
      name: "shop-btn",
      url: "/shop",
    },
    {
      name: "search-btn",
      url: "/search",
    },
    {
      name: "settings-btn",
      url: "/settings",
    },
    {
      name: "launchpad-btn",
      url: "/community/launchpad",
    },
    {
      name: "success-btn",
      url: "/success",
    },
    {
      name: "wadge-btn",
      url: "/wadge",
    },
  ];
  const handleClick = (e) => {
    splines?.filter((el) =>
      el.name === e.target.name ? router.push(el.url) : null
    );
  };
  return (
    <div className="h-screen w-screen">
      <Spline
        onMouseDown={handleClick}
        className="h-screen  w-screen"
        scene={homePage}
      />
    </div>
  );
};

export default Home;
