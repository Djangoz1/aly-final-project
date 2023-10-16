import React from "react";

export const MyOverlay = ({ setter, style }) => {
  let close = () => {
    setter(false);
  };
  return (
    <div
      onClick={() => close()}
      className={`fixed z-90    w-screen h-screen top-0 left-0 ${
        style || "backdrop-blur-[1px] bg-black/5"
      }`}
    />
  );
};
