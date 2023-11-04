import React from "react";

export const MyTitle = ({ children, style }) => {
  return (
    <div className={` uppercase font-[700] tracking-[.2px] ${style}`}>
      {children}
    </div>
  );
};
