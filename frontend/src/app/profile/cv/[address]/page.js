"use client";

import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { FeatureDescription } from "sections/Features";
import {
  _getStateFeatures,
  _getStateOwnerByCv,
} from "utils/ui-tools/auth-tools";
import {
  _getterCV,
  _getterLaunchpadHub,
  _getterMISSION,
  _setterCV,
} from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";

import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { StatFeature } from "components/stats/StatFeature";
import { Layout } from "sections/Layout";
import { ListStatsFeature } from "components/stats/lists/ListStatsFeature";

import { InfoProfileCV } from "components/infos/InfoProfile";
import { MySection } from "components/myComponents/MySection";
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";
import { Pub } from "components/Pub";

export default ({ params }) => {
  const cvRefAddress = params.address;
  const [ownerObj, setOwnerObj] = useState(null);

  const { cv } = useAuthState();

  useEffect(() => {
    if (!ownerObj) {
      (async () => {
        let _ownerObj = await _getStateOwnerByCv(cvRefAddress);
        setOwnerObj(_ownerObj);
      })();
    }
  }, [cvRefAddress]);
  const handleSubmit = async (_missionAddr, _idFeature) => {
    await _setterCV(cv, "beAssignedWorker", [_missionAddr, _idFeature]);
  };

  const [isView, setIsView] = useState("missions");
  return (
    <Layout>
      <MySection styles={"flex-col"}>
        <div className="flex flex-col w-full">
          <InfoProfileCV address={cvRefAddress} infos={ownerObj} />
          <div className="divider my-5 text-primary">
            <button
              className={`btn btn-xs btn-primary ${
                isView !== "missions" && "btn-outline"
              }`}
              onClick={() => setIsView("missions")}
            >
              Missions
            </button>
            <button
              className={`btn btn-xs btn-primary ${
                isView !== "launchpads" && "btn-outline"
              }`}
              onClick={() => setIsView("launchpads")}
            >
              Launchpads
            </button>
            <button
              className={`btn btn-xs btn-primary ${
                isView !== "publications" && "btn-outline"
              }`}
              onClick={() => setIsView("publications")}
            >
              Publications
            </button>
          </div>
          <div className="flex flex-wrap mt-5">
            {isView === "missions" && (
              <ListStatsFeature
                _ownerObj={ownerObj}
                cvAddress={cvRefAddress}
                submit={handleSubmit}
              />
            )}
            {isView === "launchpads" &&
              ownerObj?.launchpads?.map((id) => (
                <LaunchpadCard id={parseInt(id)} key={uuidv4()} />
              ))}
            {isView === "publications" &&
              ownerObj?.pubs?.map((id) => (
                <Pub id={parseInt(id)} key={uuidv4()} />
              ))}
          </div>
        </div>
      </MySection>
    </Layout>
  );
};
