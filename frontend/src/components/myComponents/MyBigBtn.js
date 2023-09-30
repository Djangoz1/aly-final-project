import { Icon } from "@iconify/react";
import React from "react";
import { themes } from "styles/style";

export const MyBigBtn = ({ title, value, icon, style }) => {
  return (
    <div
      className={`${style}  w-full flex justify-between shadow-xl p-4 rounded`}
    >
      <div className="flex items-start capitalize flex-col">
        <p className="text-white font1 text-shadow text-[24px]">
          {value || "0"}
        </p>
        {title && (
          <p className="text-white font1 text-shadow text-lg">{title}</p>
        )}
      </div>
      <Icon icon={icon} className="text-white text-[50px]" />
    </div>
  );
};
