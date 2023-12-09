import React, { useState } from "react";
import { MyTitle } from "../text/MyTitle";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MyCard } from "./MyCard";

export const MyCardDropdown = ({
  title,
  style,
  styleClick,
  header,
  children,
  footer,
}) => {
  let [isClick, setIsClick] = useState(null);
  return (
    <MyCard
      template={3}
      styles={`hover:opacity-100 ${
        isClick && styleClick ? " " + styleClick : style || " w-full"
      } ${
        isClick ? "opacity-100" : "opacity-70"
      }  flex flex-col hover:opacity-100 border-2 overflow-hidden border-transparent   relative  z-100 c3`}
    >
      <div
        onClick={() => setIsClick(!isClick)}
        className={`w-full min-w-[300px]  border cursor-pointer bg-gradient-to-bl from-white/10 to-white/5 border-b-white/5 border-white/0 p-2 backdrop-blur`}
      >
        <div className="flex items-start justify-between">
          <MyTitle style=" text-sm w-fit whitespace-nowrap ">{title}</MyTitle>
          <div className="btn btn-ghost btn-xs  ml-5">
            <Icon
              className={isClick ? "rotate-180" : ""}
              icon={icfy.ux.arrow}
            />
          </div>
        </div>
        <div className="flex  mt-1 items-center">{header}</div>
      </div>
      {isClick ? (
        <div className="flex w-full min-w-fit my-3 px-1 flex-wrap gap-2 items-center">
          {children}
        </div>
      ) : (
        <></>
      )}

      {footer ? (
        <div className="flex mt-3 p-1 w-full items-center">{footer}</div>
      ) : (
        <></>
      )}
    </MyCard>
  );
};
