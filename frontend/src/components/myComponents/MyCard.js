import React from "react";

export const MyCard = ({ children, styles }) => {
  return (
    <div
      className={`relative bg-black/80 p-4 ${styles} h-fit  rounded-xl border border-white/10 shadow shadow-xl `}
    >
      {children}
    </div>
  );
};
