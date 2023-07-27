import React from "react";
import Spline from "@splinetool/react-spline";

export const Scene = ({ url, styles }) => {
  return <Spline className={`w-fit ${styles || ""}`} scene={url} />;
};
