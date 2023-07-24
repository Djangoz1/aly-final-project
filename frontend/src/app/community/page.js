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

import { MyTabs } from "components/tabs/MyTabs";
import { sectionCommunity } from "constants/text";
import { Publications } from "sections/Publications";
import { Launchpad } from "sections/Launchpad";

const Community = () => {
  const { cv, missionId } = useAuthState();

  const [isTabs, setIsTabs] = useState(sectionCommunity[0]);

  return (
    <Layout>
      <div className="w-full flex flex-col">
        <MyTabs arr={sectionCommunity} setter={setIsTabs} value={isTabs} />
        {isTabs.tab === "Publications" && <Publications />}
        {isTabs.tab === "Launchpad" && <Launchpad />}
      </div>
    </Layout>
  );
};

export default Community;
