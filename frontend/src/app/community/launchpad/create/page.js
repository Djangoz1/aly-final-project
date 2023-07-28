"use client";
import { Icon } from "@iconify/react";
import { MySection } from "components/myComponents/MySection";
import { icfyRETURN } from "icones";
import Link from "next/link";
import React from "react";
import { CreationLaunchpad } from "sections/Launchpad/CreationLaunchpad";
import { Layout } from "sections/Layout";

const LaunchpadCreate = () => {
  return (
    <Layout>
      <MySection styles={" relative flex-col"}>
        <Link
          href={"/community/launchpad/"}
          className="btn btn-ghost text-black ml-auto top-O right-0"
        >
          <Icon icon={icfyRETURN} className="text-2xl text-error " />
        </Link>
        <CreationLaunchpad />
      </MySection>
    </Layout>
  );
};

export default LaunchpadCreate;
