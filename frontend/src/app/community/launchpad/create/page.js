"use client";
import { Icon } from "@iconify/react";
import { icfyRETURN } from "icones";
import Link from "next/link";
import React from "react";
import { CreationLaunchpad } from "sections/Launchpad/CreationLaunchpad";
import { Layout } from "sections/Layout";

const LaunchpadCreate = () => {
  return (
    <Layout>
      <Link
        href={"/community/launchpad/"}
        className="btn btn-ghost text-black absolute right-0"
      >
        <Icon icon={icfyRETURN} className="text-2xl " />
      </Link>
      <CreationLaunchpad />
    </Layout>
  );
};

export default LaunchpadCreate;
