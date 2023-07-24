import React from "react";

export const Timer = ({ units }) => {
  const { days, hours, minutes, seconds } = units();
  return (
    <div className="flex text-black">
      <div className="bg-black/5 border border-black/10 px-2 py-1 rounded shadow">
        <span className="countdown font-mono ">
          <span style={{ "--value": days }}></span>j
        </span>
      </div>
      <div className="bg-black/5 border border-black/10 px-2 py-1 rounded shadow">
        <span className="countdown font-mono ">
          <span style={{ "--value": hours }}></span>h
        </span>
      </div>
      <div className="bg-black/5 border border-black/10 px-2 py-1 rounded shadow">
        <span className="countdown font-mono ">
          <span style={{ "--value": minutes }}></span>m
        </span>
      </div>
    </div>
  );
};
