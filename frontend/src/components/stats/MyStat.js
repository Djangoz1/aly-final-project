import { Icon } from "@iconify/react";
import React from "react";

export const MyStat = ({ values, style }) => {
  const { title, description, value, icon } = values;
  return (
    <div
      className={`stat flex ${
        !style?.box ? `${style} backdrop-blur ` : style?.box
      }`}
    >
      <div className=" w-fit">
        <div className="stat-title w-fit">{title}</div>
        <div
          className={`stat-value ${
            style ? style?.value || style : " text-primary"
          } w-fit flex flex-col`}
        >
          {value}
        </div>
        <div className="stat-desc flex flex-col ">{description}</div>
      </div>
      <div className="stat-figure  ">
        <Icon
          icon={icon?.name || icon}
          className={`text-[40px] ${icon?.color || style?.color} `}
        />
      </div>
    </div>
  );
};
