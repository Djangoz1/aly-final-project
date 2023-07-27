import React from "react";

export const MySection = ({ children, styles }) => {
  return (
    <div
      className={`w-5/6 h-full min-h-[90vh] items-center flex mx-auto ${styles}`}
    >
      {children}
    </div>
  );
};

export const MyBottomSection = ({ stats }) => {
  return (
    <div className="bg-gradient-to-tr from-black via-neutral-900 to-gray-700 border border-y-1 border-x-0 border-black shadow shadow-2xl flex justify-center  w-screen p-[30px]">
      {stats?.map((e, i) => (
        <div
          className={`flex items-center justify-center p-5 border border-y-0 border-l-0 ${
            i !== stats?.length - 1
              ? "border-r-2 border-white/40"
              : "border-r-0"
          }`}
          style={{ width: `${80 / stats?.length}%` }}
        >
          <span className="text-white font-black text-2xl mr-3">
            {e?.value}
          </span>
          <p className="text-xs">{e?.title}</p>
        </div>
      ))}
    </div>
  );
};
