"use client";

import { CVName } from "components/inputs/inputsCV/CVName";

import { useAuthState } from "context/auth";
import {
  doMissionsState,
  useMissionDispatch,
  useMissionState,
} from "context/authMissions";
import React, { useEffect, useState } from "react";
import { CreationFeature, CreationFeatures } from "sections/Features";
import { CreationMission, ListMission } from "components/inputs/inputsMission";
import { _getName } from "utils/ui-tools/auth-tools";
import { _getContractMissionByCv } from "utils/ui-tools/mission-tools";

export const ModalCreateMission = () => {
  const [open, setOpen] = useState(false);
  const { cv } = useAuthState();
  const { mission, missions } = useMissionState();
  const dispatch = useMissionDispatch();

  useEffect(() => {
    if (cv) {
      doMissionsState(dispatch, cv);
    }
  }, [cv]);

  useEffect(() => {
    if (mission) {
      setIsMission(true);
    } else {
      setIsMission(false);
    }
  }, [mission]);

  const [isMission, setIsMission] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Create a Mission
      </button>
      {open && (
        <>
          <div
            className="w-screen top-0 left-0 h-screen fixed opacity-70 bg-black"
            onClick={() => setOpen(false)}
          ></div>
          <div className="fixed left-1/2 z-100 bg-zinc-900 -translate-x-1/2 -translate-y-1/2 top-1/2 p-5 w-[90vw] h-[85vh]">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {cv ? (
                <>
                  Hi , <CVName /> !
                </>
              ) : (
                "Hi, you should registred before continue"
              )}{" "}
            </h3>
            {missions && <ListMission />}
            {isMission ? <CreationFeatures /> : <CreationMission />}
          </div>
        </>
      )}
    </>
  );
};
