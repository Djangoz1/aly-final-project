"use client";
import { Icon } from "@iconify/react";
import { Header } from "components/Header";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreationMission, ListMission } from "components/inputs/inputsMission";
import {
  doAuthCV,
  doAuthFactoryCV,
  doAuthFactoryMission,
  doAuthSigner,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import {
  doMissionsState,
  useMissionDispatch,
  useMissionState,
} from "context/authMissions";
import React, { useEffect, useState } from "react";
import { CreationFeatures } from "sections/Features";

const Mission = () => {
  const { address, cv, factoryMission, factoryCv } = useAuthState();
  const dispatch = useAuthDispatch();

  const { missions, mission } = useMissionState();
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

  useEffect(() => {
    if (mission !== null) {
      setIsMission(true);
    } else {
      setIsMission(false);
    }
  }, [mission]);

  const [isMission, setIsMission] = useState(false);
  return (
    <div>
      <Header />
      <div className="fixed left-1/2 z-100 bg-zinc-900 -translate-x-1/2 -translate-y-1/2 top-1/2 p-5 w-[90vw] h-[85vh]">
        <h3 className="font-bold text-lg">
          {cv ? (
            <>
              Hi , <CVName /> !
            </>
          ) : (
            "Hi, you should registred before continue"
          )}{" "}
        </h3>

        <ListMission />
        {isMission ? <CreationFeatures /> : <CreationMission />}
      </div>
    </div>
  );
};

export default Mission;
