import React from "react";

export const MyFormInfo = ({ title, description }) => {
  return (
    <div className="border border-1 my-2 border-white/10 rounded-lg pt-1 p-3">
      <div className="cursor-pointer text-white flex w-fit label">{title}</div>
      <div className="font-light text-xs relative flex flex-col text-justify ">
        {description}
      </div>
    </div>
  );
};
