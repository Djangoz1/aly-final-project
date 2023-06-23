import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";

export const Workflow = ({ isWorker, workerSteps, entrepriseSteps }) => {
  const { cv } = useAuthState();
  const [isRegistred, setRegistred] = useState(false);
  const registred = () => (cv ? setRegistred(true) : setRegistred(false));
  const workerStatus = [isRegistred];

  useEffect(() => {
    if (!isRegistred) {
      registred();
    }
  }, [cv]);
  console.log(isRegistred);
  return (
    <div className="flex flex-col ml-auto">
      <h4 className="text-white text-2xl font-black">Workflow</h4>
      <ul className="steps steps-vertical">
        {isWorker
          ? workerSteps.map((step, index) => (
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
