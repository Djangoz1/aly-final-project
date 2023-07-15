import React from "react";

export const MissionTextInfo = ({ metadata }) => {
  return (
    <div className="stat bg-white w-full flex">
      <div className=" w-fit">
        <div className="stat-value text-primary w-fit flex flex-col">
          <span className="capitalize">{metadata?.title}</span>
        </div>
        <div className="stat-desc   flex flex-col ">
          <span>Description:</span>
          <span className="text-black whitespace-normal ">
            {metadata?.description}
          </span>
        </div>
      </div>
    </div>
  );
};
