import React from "react";
import { LinearGradient } from "react-text-gradients";

export const Hg = ({ children, style, style1 }) => {
  return (
    <LinearGradient
      className={style || "font-normal"}
      style={style1}
      gradient={["to right", "rgba(201,78,21,1), rgba(201,21,103,1)"]}
    >
      {children}
    </LinearGradient>
  );
};
export const Hg1 = ({ children, style }) => {
  return (
    <LinearGradient
      className={style || "font-light"}
      gradient={["to right", "rgba(11,228,161,0.92), rgba(11,144,228,0.92)"]}
    >
      {children}
    </LinearGradient>
  );
};
