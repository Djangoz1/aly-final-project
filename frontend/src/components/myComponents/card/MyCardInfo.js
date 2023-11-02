import React, { useState } from "react";
import { MyCard } from "./MyCard";
import { Icon } from "@iconify/react";
import { BtnGb1, BtnGb2, BtnGr1, BtnGr2 } from "../btn/MyGradientButton";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { Avatar } from "components/profile/ProfileAvatar";
import { ImagePin } from "components/Image/ImagePin";
import { MySub } from "../text/MySub";

export const MyCardInfo = ({
  header,
  children,
  noBtn,
  main,
  btn,
  styles,
  color,
}) => {
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
    <Hg className={"font-light c2 uppercase "}>{header?.title}</Hg>,
    <Hg1 className={"font-light c2 uppercase "}>{header?.title}</Hg1>,
    <Hg className={"font-light c2 uppercase"}>{header?.title}</Hg>,
  ];
  return (
    <div className={`p-0 ${styles || "w-fit"}`}>
      <div className="flex flex-col  bgprim rounded-b-lg   ">
        {header?.banniere && (
          <div className="h-[8vh]">
            <ImagePin
              CID={header?.banniere}
              style={"absolute -z-1 w-[112%] opacity-80 h-full"}
            />
          </div>
        )}

        {header?.icon && (
          <div
            className={`${
              header?.badge && " "
            }  absolute p-1 rounded-full top-0 bg-zinc-800 shadow1 backdrop-blur  right-0 -translate-x-1/2 -translate-y-1/2 text-[40px] `}
          >
            <Icon
              icon={header?.icon}
              // className={`text-${_colors?.[color]} mb-6 text-[90px]`}
              className={`c2  `}
            />
          </div>
        )}

        <div className="flex  justify-between items-end">
          {/* {header?.image && (
            <Avatar style={"w-12 mb-2 mask-hexagon"} CID={header?.image} />
          )} */}
          <div className="flex  w-full items-end">
            <div className="w-full     text-lg  ">
              <div className="w-full flex items-center uppercase font-bold c2 my-2  mx-1 relative z-10">
                {header?.title}
                <MySub style={"ml-2 c4 text-xs"}>
                  {main?.title || <>Lorem ipsum dolor </>}
                </MySub>
              </div>
              {/* <div className="w-full  relative z-10">{titles?.[color]}</div> */}
              {header?.component && (
                <MySub size={"24px"} style={" c3"}>
                  {header?.component}
                </MySub>
              )}
              <div
                className={`g1 relative  w-full py-[6px]  ${colors?.[color]}`}
              ></div>
            </div>
          </div>
        </div>
        {header?.image && (
          <ImagePin
            styleImg={"w-[68px] h-[68px] rounded-full"}
            style={` p-[2px] absolute absolute p-1 rounded-full -top-3 bg-zinc-800 shadow1 backdrop-blur  -right-4    `}
            CID={header?.image}
          />
        )}
      </div>
      <div className="text-xs  c1 h-full overflow-y-scroll  mb-auto   text-justify">
        {/* <MySub >{main?.title || <>Lorem ipsum dolor </>}</MySub> */}
        <div
          onClick={() => setIsClicked(!isClicked)}
          className={`bg3  h-full cursor-pointer text-sm c1  whitespace-break-spaces font2    py-10 ${
            isClicked ? "line-clamp-none" : "line-clamp-6"
          }`}
        >
          {main?.text ||
            `cursor-pointer Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem fuga
            quae suscipit ullam aliquam officia eligendi dolor temporibus!`}
        </div>
      </div>

      {!noBtn ? (
        <div className="mt-auto w-full flex">
          {btn?.component ? btn?.component : btns[color]}
        </div>
      ) : null}
      {children ? children : undefined}
    </div>
  );
};
