import { Icon } from "@iconify/react";
import { STATUS } from "constants/status";
import { icfy } from "icones";
import React from "react";

export const MyStatus = ({ status, target, style }) => {
  return (
    <div
      className={`badge badge-xs h-fit  badge-outline flex items-center text-xs badge-${
        STATUS?.[target]?.[status]?.color
      }  ${style || "py-1 px-5"}`}
    >
      <Icon icon={STATUS?.[target]?.[status]?.icon} className="text-lg mr-2" />
      {STATUS?.[target]?.[status]?.status}
    </div>
  );
};
