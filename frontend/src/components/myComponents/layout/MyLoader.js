import React from "react";
import "./style.css";
export const MyLoader = ({ template, style }) => {
  return [
    <div className="pl shadow2 backdrop-blur">
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__text">Loading…</div>
    </div>,
    <div className={"gearbox " + style}>
      <div className="overlay"></div>
      <div className="gear one">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear two">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear three">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear four large">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>,
  ]?.[template || 0];
};
