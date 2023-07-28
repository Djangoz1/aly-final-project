import React from "react";

export const MyCard = ({ children, styles }) => {
  return (
    <div
      className={`relative bg-black/40 p-4 ${styles} z-0 h-fit  rounded-xl border box-border border-white/10 shadow shadow-xl `}
    >
      {children}
    </div>
  );
};
