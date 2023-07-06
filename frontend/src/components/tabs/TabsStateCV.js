import { stateCV } from "constants/text";
import React from "react";

export const TabsStateCV = ({ setIsWorker, isWorker }) => {
  return (
    <div className="tabs mb-5 flex   w-full justify-start">
      {stateCV.map((status, index) => (
        <button
          key={index}
          className={`tab tab-bordered text-black ${
            index === 0 && !isWorker
              ? "border-primary  "
              : index === 1 && isWorker
              ? "border-primary  "
              : ""
          }`}
          onClick={() =>
            index === 0
              ? setIsWorker(false)
              : index === 1
              ? setIsWorker(true)
              : null
          }
        >
          {status?.tab}
        </button>
      ))}
    </div>
  );
};
