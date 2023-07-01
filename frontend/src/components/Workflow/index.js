import { useAuthState } from "context/auth";
import { useMissionState } from "context/authMissions";
import React, { useEffect, useState } from "react";

export const Workflow = ({ isWorker, workerSteps, entrepriseSteps }) => {
  const { cv, missions } = useAuthState();
  const [isRegistred, setRegistred] = useState(false);
  const [isProposeJob, setIsProposeJob] = useState(false);

  const registred = () => (cv ? setRegistred(true) : setRegistred(false));
  const proposeJob = () =>
    missions?.length > 0 ? setIsProposeJob(true) : setIsProposeJob(false);
  const workerStatus = [isRegistred, isProposeJob];

  useEffect(() => {
    if (!isRegistred) registred();
  }, [cv]);

  useEffect(() => {
    if (!isProposeJob) proposeJob();
  }, [missions]);

  return (
    <div className="flex relative -z-10 flex-col ml-auto">
      <h4 className="text-white text-2xl font-black">Workflow</h4>
      <ul className="steps  steps-vertical">
        {isWorker
          ? workerSteps.map((step, index) => (
              <li
                className={`step  ${
                  workerStatus?.[index] ? "step-primary" : null
                }`}
                key={step}
              >
                {step}
              </li>
            ))
          : null}
        {!isWorker
          ? entrepriseSteps?.map((step, index) => (
              <li
                className={`step ${
                  workerStatus?.[index] ? "step-primary" : null
                }`}
                key={step}
              >
                {step}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};
