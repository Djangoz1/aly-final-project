"use client";
import { ZERO_ADDRESS } from "@openzeppelin/test-helpers/src/constants";
import { Header } from "components/Header";
import { ObjStatsOwner } from "components/inputs/inputsCV/owner/stats/obj";
import {
  doAuthCV,
  doAuthFactoryCV,
  doAuthFactoryMission,
  doAuthSigner,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { doMissionsState, useMissionDispatch } from "context/authMissions";

import React, { useEffect, useState } from "react";
import { FeatureDescription } from "sections/Features";
import { _getStateOwnerByCv } from "utils/ui-tools/auth-tools";
import { _getFeatures } from "utils/ui-tools/mission-tools";
import { _joinFeature } from "utils/ui-tools/worker-tools";

export default ({ params }) => {
  const cvRefAddress = params.address;
  const [ownerObj, setOwnerObj] = useState(null);
  const { address, cv, factoryMission, factoryCv } = useAuthState();
  const dispatch = useAuthDispatch();
  const missionDispatch = useMissionDispatch();

  useEffect(() => {
    doAuthSigner(dispatch);
  }, [address]);

  useEffect(() => {
    if (!factoryCv) doAuthFactoryCV(dispatch);
    if (!factoryMission && factoryCv) doAuthFactoryMission(dispatch);
  }, [factoryCv, factoryMission]);

  useEffect(() => {
    if (factoryCv && address) doAuthCV(dispatch, factoryCv, address);
  }, [factoryCv, address]);

  useEffect(() => {
    if (cv) doMissionsState(missionDispatch, cv);
  }, [cv]);

  const getOwnerObj = async () => {
    let _ownerObj = await _getStateOwnerByCv(cvRefAddress);
    setOwnerObj(_ownerObj);
  };

  const getFeatures = async () => {
    const arr = [];
    for (let index = 0; index < ownerObj?.missions?.length; index++) {
      const element = await _getFeatures(ownerObj?.missions[index]);
      arr.push({ feature: element, mission: ownerObj?.missions?.[index] });
    }

    setFeaturesList(arr);
  };

  const [featuresList, setFeaturesList] = useState(null);
  useEffect(() => {
    if (!ownerObj) {
      getOwnerObj();
    }
  }, [cvRefAddress]);

  useEffect(() => {
    if (ownerObj?.missions) {
      getFeatures();
    }
  }, [ownerObj]);

  const handleSubmit = async (_missionAddr, _idFeature) => {
    await _joinFeature(cv.address, _missionAddr, _idFeature);
  };

  return (
    <>
      <Header />
      <div className="bg-zinc-900 w-[90%] p-5 mx-auto">
        <ObjStatsOwner obj={ownerObj} />

        {featuresList?.map((elem, index) => (
          <div className="flex" key={elem?.feature?.[0]?.description}>
            <FeatureDescription feature={elem?.feature?.[0]} />

            {elem?.feature?.[0]?.assignedWorker === ZERO_ADDRESS &&
              !elem?.feature?.[0]?.isInviteOnly && (
                <button
                  className="btn "
                  onClick={() => handleSubmit(elem?.mission, index)}
                >
                  Join Feature
                </button>
              )}
          </div>
        ))}
      </div>
      <div>[{cvRefAddress}]</div>
    </>
  );
};
