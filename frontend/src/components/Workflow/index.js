import { useAuthState } from "context/auth";

import React, { useEffect, useState } from "react";

export const Workflow = ({ steps }) => {
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
    <div className="flex relative  w-full flex-col ">
      <h4 className="text-black text-2xl font-black">Workflow</h4>
      <ul className="steps  w-full  steps-horizontal">
        {steps.map((step, index) => (
          <li
            className={`step text-black  ${
              workerStatus?.[index] ? "step-primary" : null
            }`}
            key={step}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};
