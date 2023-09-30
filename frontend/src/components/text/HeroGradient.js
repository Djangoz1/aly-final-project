import React from "react";
import { LinearGradient } from "react-text-gradients";

export const Hg = ({ children }) => {
  return (
    <LinearGradient
      className="font-normal"
      gradient={["to right", "rgba(201,78,21,1), rgba(201,21,103,1)"]}
    >
      {children}
    </LinearGradient>
  );
};
