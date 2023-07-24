import React from "react";

export const MyProgressbar = ({ value, endedValue, title }) => {
  const calcPercent = () => {
    const percent = 100 / endedValue;
    const result = value * percent;
    return result;
  };
  return (
    <div className="flex flex-col items-center">
      <p className="text-black text-xs">
        {title}({calcPercent()}%){" "}
      </p>
      <div className="border border-primary shadow  h-[5vh] w-full p-1 rounded">
        <div
          className="bg-primary rounded-l-full h-full"
          style={{ width: `${calcPercent()}%` }}
        ></div>
      </div>
    </div>
  );
};
