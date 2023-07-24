import React from "react";

export const MyTabs = ({ arr, setter, value }) => {
  return (
    <div className="tabs mb-5 flex   w-full justify-start">
      {arr.map((status, index) => (
        <button
          key={index}
          className={`tab tab-bordered text-black ${
            status.tab === value.tab ? "border-primary  " : "  "
          }`}
          onClick={() => setter(status)}
        >
          {status?.tab}
        </button>
      ))}
    </div>
  );
};
