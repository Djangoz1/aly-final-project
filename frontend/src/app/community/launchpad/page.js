"use client";
import { MyTabs } from "components/myComponents/MyTabs";
import { sectionCommunity } from "constants/text";
import React, { useState } from "react";
import { Launchpad } from "sections/Launchpad";
import { Layout } from "sections/Layout";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { icfySEARCH } from "icones";

const LaunchpadPage = () => {
  const [isTabs, setIsTabs] = useState(sectionCommunity[1]);
  const router = useRouter();
  const handleClick = (status) => {
    router.push(status.link);
    setIsTabs(status);
  };
  return (
    <Layout>
      <div className="flex ">
        <MyTabs arr={sectionCommunity} setter={handleClick} value={isTabs} />
        <div class="relative flex items-center my-3 w-1/2">
          <span class="absolute">
            <Icon icon={icfySEARCH} className="text-2xl ml-2" />
          </span>

          <input
            type="text"
            placeholder="Search launchpad with name, symbol or address"
            className="block w-full text-xs py-2 text-gray-700  placeholder-white-400/70  bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
      </div>

      <Launchpad />
    </Layout>
  );
};

export default LaunchpadPage;
