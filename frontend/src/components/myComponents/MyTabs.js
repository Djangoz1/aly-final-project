import React from "react";

export const MyTabs = ({ arr, setter, value }) => {
  return (
    <div className="tabs  flex   w-full justify-start">
      {arr.map((status, index) => (
        <button
          key={index}
          className={`tab tab-bordered  ${
            status.tab === value.tab ? "border-primary text-white " : "  "
          }`}
          onClick={() => setter(status)}
        >
          {status?.tab}
        </button>
      ))}
    </div>
  );
};
