"use client";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { Layout } from "sections/Layout";

import { _getAllPubsState } from "utils/ui-tools/pubs-tools";
import {
  _getterPubsHub,
  _setterAccessControl,
  _setterPubsHub,
} from "utils/ui-tools/web3-tools";

import { MyTabs } from "components/myComponents/MyTabs";
import { sectionCommunity } from "constants/text";
import { Publications } from "sections/Publications";
import { Launchpad } from "sections/Launchpad";
import { useRouter } from "next/navigation";
import { MyModal } from "components/modal/MyModal";
import { CreationPub } from "components/Pub/CreationPub";

const Community = () => {
  const { cv, missionId } = useAuthState();

  const [isTabs, setIsTabs] = useState(sectionCommunity[0]);
  const router = useRouter();
  const handleClick = (status) => {
    router.push(status.link);
    setIsTabs(status);
  };
  return (
    <Layout>
      <div className="w-full flex flex-col">
        <div className="flex items-start justify-between">
          <MyTabs arr={sectionCommunity} setter={handleClick} value={isTabs} />
          <div className="w-1/6">
            <CreationPub />
          </div>
        </div>
        {isTabs.tab === "Publications" && <Publications />}
      </div>
    </Layout>
  );
};

export default Community;
