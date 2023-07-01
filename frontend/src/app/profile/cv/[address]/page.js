"use client";

import { Header } from "components/Header";
import { ObjStatsOwner } from "components/inputs/inputsCV/owner/stats/obj";
import { ZERO_ADDRESS } from "constants/web3";

import { v4 as uuidv4 } from "uuid";

// import { Header } from "components/Header";
// import { ObjStatsOwner } from "components/inputs/inputsCV/owner/stats/obj";
// import {
//   doAuthCV,
//   doAuthFactoryCV,
//   doAuthFactoryMission,
//   doAuthSigner,
//   useAuthDispatch,
//   useAuthState,
// } from "context/auth";
// import { doMissionsState, useMissionDispatch } from "context/authMissions";

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
// import { FeatureDescription } from "sections/Features";
// import { _getStateOwnerByCv } from "utils/ui-tools/auth-tools";
// import { _getFeatures } from "utils/ui-tools/mission-tools";
import { _joinFeature } from "utils/ui-tools/worker-tools";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
// import { parseHex } from "helpers";
// import { ZERO_ADDRESS } from "constants/web3";

export default ({ params }) => {
  const cvRefAddress = params.address;
  const [ownerObj, setOwnerObj] = useState(null);
  const { address } = useAccount();
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (address) {
      doAuthCV(dispatch, address);
    }
  }, [address]);

  const getOwnerObj = async () => {
    let _ownerObj = await _getStateOwnerByCv(cvRefAddress);
    setOwnerObj(_ownerObj);
  };

  const getFeatures = async () => {
    const arr = [];
    for (let index = 0; index < ownerObj?.missions?.length; index++) {
      const features = await _getStateFeatures(ownerObj?.missions[index]);
      arr.push({ mission: ownerObj?.missions[index], feature: features });
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
    await _setterCV(cv, "beAssignedWorker", [_missionAddr, _idFeature]);
    getFeatures();
  };

  return (
    <>
      <Header />
      <div className="bg-zinc-900 w-[90%] p-5 mx-auto">
        <ObjStatsOwner obj={ownerObj} />

        {featuresList?.map((features, index) =>
          features?.feature?.map((elem) => (
            <div className="flex" key={uuidv4()}>
              <FeatureDescription feature={elem} />
              {console.log("fdfd", features?.mission, parseInt(elem?.id))}
              {elem?.assignedWorker === ZERO_ADDRESS && !elem?.isInviteOnly && (
                <button
                  className="btn "
                  onClick={() =>
                    handleSubmit(features?.mission, parseInt(elem?.id))
                  }
                >
                  Join Feature
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};
