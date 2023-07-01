"use client";
// import { v4 as uuidv4 } from "uuid";

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

// import React, { useEffect, useState } from "react";
// import { FeatureDescription } from "sections/Features";
// import { _getStateOwnerByCv } from "utils/ui-tools/auth-tools";
// import { _getFeatures } from "utils/ui-tools/mission-tools";
// import { _joinFeature } from "utils/ui-tools/worker-tools";
// import { parseHex } from "helpers";
// import { ZERO_ADDRESS } from "constants/web3";

export default ({ params }) => {
  // const cvRefAddress = params.address;
  // const [ownerObj, setOwnerObj] = useState(null);
  // const { address, cv, factoryMission, factoryCv } = useAuthState();
  // const dispatch = useAuthDispatch();
  // const missionDispatch = useMissionDispatch();

  // useEffect(() => {
  //   doAuthSigner(dispatch);
  // }, [address]);

  // useEffect(() => {
  //   if (!factoryCv) doAuthFactoryCV(dispatch);
  //   if (!factoryMission && factoryCv) doAuthFactoryMission(dispatch);
  // }, [factoryCv, factoryMission]);

  // useEffect(() => {
  //   if (factoryCv && address) doAuthCV(dispatch, factoryCv, address);
  // }, [factoryCv, address]);

  // useEffect(() => {
  //   if (cv) doMissionsState(missionDispatch, cv);
  // }, [cv]);

  // const getOwnerObj = async () => {
  //   let _ownerObj = await _getStateOwnerByCv(cvRefAddress);
  //   setOwnerObj(_ownerObj);
  // };

  // const getFeatures = async () => {
  //   const arr = [];
  //   for (let index = 0; index < ownerObj?.missions?.length; index++) {
  //     const element = await _getFeatures(ownerObj?.missions[index]);
  //     arr.push({ feature: element, mission: ownerObj?.missions?.[index] });
  //   }

  //   setFeaturesList(arr);
  // };

  // const [featuresList, setFeaturesList] = useState(null);
  // useEffect(() => {
  //   if (!ownerObj) {
  //     getOwnerObj();
  //   }
  // }, [cvRefAddress]);

  // useEffect(() => {
  //   if (ownerObj?.missions) {
  //     getFeatures();
  //   }
  // }, [ownerObj]);

  // const handleSubmit = async (_missionAddr, _idFeature) => {
  //   await _joinFeature(cv.address, _missionAddr, _idFeature);
  // };

  return (
    <>
      CC
      {/* <Header />
      <div className="bg-zinc-900 w-[90%] p-5 mx-auto">
        <ObjStatsOwner obj={ownerObj} />

        {featuresList?.map((features, index) =>
          features?.feature?.map((elem) => (
            <div className="flex" key={uuidv4()}>
              <FeatureDescription feature={elem} />

              {elem?.assignedWorker === ZERO_ADDRESS && !elem?.isInviteOnly && (
                <button
                  className="btn "
                  onClick={() =>
                    handleSubmit(features?.mission, parseHex(elem?.id))
                  }
                >
                  Join Feature
                </button>
              )}
            </div>
          ))
        )}
      </div> */}
    </>
  );
};
