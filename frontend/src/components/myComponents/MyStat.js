import { Icon } from "@iconify/react";
import React from "react";

export const MyStat = ({ styles, values, color }) => {
  const { icon, icText, title, value, desc } = values;
  const _color = color || "text-secondary";
  return (
    <div className={`stat relative   ${styles || ""}`}>
      <div className="stat-title text-xs">{title}</div>
      <div className={`stat-figure `}>
        {icon && <Icon icon={icon} className={`text-[35px] ${_color}`} />}
        {icText && <span className={`text-xs ${_color}`}>{icText}</span>}
      </div>
      <div
        className={`stat-value text-lg flex items-center  my-auto ${_color}`}
      >
        {value}
      </div>
      <div className={`stat-desc mt-auto text-[9px]`}>{desc}</div>
    </div>
  );
};
