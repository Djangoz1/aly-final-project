import React, { useState } from "react";
import { MyCard } from "./MyCard";
import { Icon } from "@iconify/react";
import { BtnGb1, BtnGb2, BtnGr1, BtnGr2 } from "../btn/MyGradientButton";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { Avatar } from "components/profile/ProfileAvatar";
import { ImagePin } from "components/Image/ImagePin";

export const MyCardInfo = ({ header, noBtn, main, btn, styles, color }) => {
  let colors = ["", "gb2", "gr2"];
  let _colors = ["primary", "info", "error"];

  let [isClicked, setIsClicked] = useState(null);
  let btns = [
    <BtnGr2 style={"w-full btn-sm " + btn?.style}>
      {btn?.title || "More"}
    </BtnGr2>,
    <div className={"btn  btn-outline btn-xs c2  " + btn?.style}>
      {btn?.title || "More"}
    </div>,
    <BtnGb1 style={"w-full btn-sm " + btn?.style}>
      {btn?.title || "More"}
    </BtnGb1>,
    <BtnGr1 style={"w-full btn-sm " + btn?.style}>
      {btn?.title || "More"}
    </BtnGr1>,
  ];

  let titles = [
    <p className={"font-light c2 uppercase "}>{header?.title}</p>,
    <p className={"font-light c2 uppercase "}>{header?.title}</p>,

    <p className={"font-light c2 uppercase"}>{header?.title}</p>,
  ];
  return (
    <MyCard styles={styles || "w-fit"}>
      <div className="flex flex-col  overflow-hidden rounded-t-lg  relative ">
        {header?.banniere && (
          <div className="h-[8vh]">
            <ImagePin
              CID={header?.banniere}
              style={"absolute -z-1 w-[112%] opacity-80 h-full"}
            />
          </div>
        )}
        {header?.icon && (
          <Icon
            icon={header?.icon}
            className={`text-${_colors?.[color]} mb-6 text-[90px]`}
          />
        )}
        <div className="flex justify-between items-end">
          {/* {header?.image && (
            <Avatar style={"w-12 mb-2 mask-hexagon"} CID={header?.image} />
          )} */}
          <div className="flex w-full items-end">
            {header?.image && (
              <Avatar
                style={"w-[68px] mb-2   mask-hexagon"}
                CID={header?.image}
              />
            )}
            <div className="w-full pl-2   mb-2 text-lg  ">
              <div className="w-full  relative z-10">{titles?.[color]}</div>
              {header?.component && (
                <p className="text-xs">{header?.component}</p>
              )}
              <div
                className={`g1 relative  w-full py-[1px] mb-2 ${colors?.[color]}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs w-5/6  text-justify">
        <div className="text-white/10 uppercase mb-2">
          {main?.title || <>Lorem ipsum dolor </>}
        </div>
        <div
          onClick={() => setIsClicked(!isClicked)}
          className={`cursor-pointer ${
            isClicked ? "line-clamp-none" : "line-clamp-6"
          }`}
        >
          {main?.text ||
            `cursor-pointer Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem fuga
            quae suscipit ullam aliquam officia eligendi dolor temporibus!`}
        </div>
      </div>

      {!noBtn ? (
        <>
          <div className="mt-2" />

          {btn?.component ? btn?.component : btns[color]}
        </>
      ) : null}
    </MyCard>
  );
};
