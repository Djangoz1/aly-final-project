import React from "react";

export const Timer = ({ units }) => {
  const { days, hours, minutes, seconds } = units();
  return (
    <span className="countdown font-mono ">
      <span style={{ "--value": days }}></span>j
      <span style={{ "--value": hours }}></span>h
      <span style={{ "--value": minutes }}></span>m
    </span>
  );
};
