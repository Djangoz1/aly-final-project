import { Icon } from "@iconify/react";
import React from "react";

export const MyStat = ({ styles, values, color }) => {
  const { icon, title, value, desc } = values;
  const _color = color || "text-secondary";
  return (
    <div className={`stat relative   ${styles || ""}`}>
      <div className="stat-title text-xs">{title}</div>
      <div className={`stat-figure `}>
        <Icon icon={icon} className={`text-[35px] ${_color}`} />
      </div>
      <div className={`stat-value text-lg  my-auto ${_color}`}>{value}</div>
      <div className={`stat-desc  mt-auto text-[9px]`}>{desc}</div>
    </div>
  );
};
