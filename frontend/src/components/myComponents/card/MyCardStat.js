import React from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import { icfyBLENDER } from "icones";
import Link from "next/link";
export const MyCardStat = ({
  title,
  subtitle,
  style,
  value,
  icon,
  url,
  infoObj1,
  infoObj2,
}) => {
  return (
    <Link href={url || "#"} className={"card-stat " + style}>
      <div className="my_card_stat">
        <p className="title">{title}</p>
        <p className="subtitle">{subtitle}</p>

        <Icon icon={icon} className="text-[44px]" />
        <p className="value">{value}</p>
        <div className="valueContainer">
          <div className="min">
            <p className="minHeading">{infoObj1?.title}</p>
            <p className="minTemp">{infoObj1?.value}</p>
          </div>
          <div className="max">
            <p className="maxHeading">{infoObj2?.title}</p>
            <p className="maxTemp">{infoObj2?.value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
