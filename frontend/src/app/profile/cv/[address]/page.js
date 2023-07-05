"use client";

import { Header } from "sections/Layout/Header";
import { ObjStatsOwner } from "components/inputs/inputsCV/owner/stats/obj";
import { ZERO_ADDRESS } from "constants/web3";

import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { FeatureDescription } from "sections/Features";
import {
  _getStateFeatures,
  _getStateOwnerByCv,
} from "utils/ui-tools/auth-tools";
import {
  _getterCV,
  _getterMISSION,
  _setterCV,
} from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";

import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { StatFeature } from "components/stats/StatFeature";
import { Layout } from "sections/Layout";
import { ListStatsFeature } from "components/stats/lists/ListStatsFeature";

export default ({ params }) => {
  const cvRefAddress = params.address;
  const [ownerObj, setOwnerObj] = useState(null);

  const { cv } = useAuthState();

  const getOwnerObj = async () => {
    let _ownerObj = await _getStateOwnerByCv(cvRefAddress);
    setOwnerObj(_ownerObj);
  };

  useEffect(() => {
    if (!ownerObj) {
      getOwnerObj();
    }
  }, [cvRefAddress]);
  const handleSubmit = async (_missionAddr, _idFeature) => {
    await _setterCV(cv, "beAssignedWorker", [_missionAddr, _idFeature]);
  };
  return (
    <Layout>
      <>
        <ObjStatsOwner obj={ownerObj} />
        <div className="flex flex-wrap mt-5">
          <ListStatsFeature cvAddress={cvRefAddress} submit={handleSubmit} />
        </div>
      </>
    </Layout>
  );
};
