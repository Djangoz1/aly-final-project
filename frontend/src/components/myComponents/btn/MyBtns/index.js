import React from "react";
import { v4 } from "uuid";

export const MyBtns = ({ arr, value, setter, children }) => {
  return (
    <>
      {children && (
        <button
          onClick={() => setter(null)}
          className={`btn btn-xs text-[9px] ${
            value !== null ? "btn-outline" : "border border-white/5"
          }`}
        >
          {children}
        </button>
      )}
      {arr.map((el, i) => (
        <button
          onClick={() => setter(i)}
          className={`btn btn-xs text-[9px] ${
            value !== i ? "btn-outline" : "border border-white/5"
          }`}
          key={v4()}
        >
          {el}
        </button>
      ))}
    </>
  );
};
