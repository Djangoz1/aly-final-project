import React from "react";

export const BtnGr1 = ({ children, setter, style }) => {
  return (
    <button
      className={
        "g1 gr1 text-white rounded-2xl btn border-none font2 font-normal freelance " +
        style
      }
    >
      {children}
    </button>
  );
};

export const BtnGb2 = ({ children, setter, style }) => {
  return (
    <BtnGb1 style={style + " p-[2px]"}>
      <div className="w-full bg-zinc-900  flex items-center justify-center rounded-full h-full">
        {children}
      </div>
    </BtnGb1>
  );
};
export const BtnGr2 = ({ children, setter, style }) => {
  return (
    <BtnGr1 style={style + " p-[2px]"}>
      <div className="w-full bg-zinc-900  flex items-center justify-center rounded-full h-full">
        {children}
      </div>
    </BtnGr1>
  );
};

export const BtnGb1 = ({ children, setter, style }) => {
  return (
    <button
      className={
        "g1 gb1 text-white rounded-2xl btn border-none font2 font-normal freelance " +
        style
      }
    >
      {children}
    </button>
  );
};
