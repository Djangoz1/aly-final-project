import React from "react";

export const MyOverlay = ({ setter }) => {
  let close = () => {
    console.log("coucou");
    setter(false);
  };
  return (
    <div
      onClick={() => close()}
      className="fixed z-90 bg-black/5 w-screen h-screen top-0 left-0"
    />
  );
};
