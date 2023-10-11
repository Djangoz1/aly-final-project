import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { MyCountdown } from "../MyCountdown";
import { v4 } from "uuid";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { MyCard1 } from "./MyCard";

export const MyCardList = ({ head, icon, arr, btn, color }) => {
  let colors = ["", "gb1", "gr1"];
  let _colors = ["text-primary", "text-info", "text-error"];

  return (
    <MyCard1 head={head} icon={icon} color={color} btn={btn}>
      {arr?.map((el, i) => (
        <>
          <div
            key={v4()}
            className={`flex flex-col w-1/2 mb-2    rounded-lg ${
              i % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            <div className="text-xs text-white/40 mb-1">{el?.title}</div>
            <div className="text-xs">{el?.value}</div>
          </div>
        </>
      ))}
    </MyCard1>
  );
};
