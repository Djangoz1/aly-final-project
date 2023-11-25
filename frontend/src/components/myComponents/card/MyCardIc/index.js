import React, { useState } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import { icfy, icfyROCKET } from "icones";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";
import { MyCard } from "../MyCard";
export const MyCardIc = ({
  children,
  clickable,
  template,
  icon,
  setter,
  title,
  style,
  url,
  btn,
}) => {
  let [childVisibility, setChildVisiblty] = useState(
    clickable ? null : "card_ic_hover"
  );

  return (
    <MyCard
      styles={`bg-gradient-to-bl  from-white/5 relative  to-transparent ${
        style || "w-full"
      }`}
      template={template}
    >
      <div
        onClick={() =>
          clickable &&
          setChildVisiblty(
            childVisibility !== "card_ic_clickable" ? "card_ic_clickable" : null
          )
        }
        className={`  w-full    flex ${
          [
            "flex-col card_ic max-w-[300px] shadow1 py-4 justify-center",
            "flex-row items-center opacity-50 hover:opacity-100  ",
          ]?.[template || 0]
        }  font2 ${childVisibility} ${clickable && "pointer"} `}
      >
        <div
          className={`_icon   ${["shadow2", "shadow2 p-2 rounded-full ml-3"]}`}
        >
          <span
            className={`absolute _hover h-full gb1  g1 pl-[1px] top-0 z-0 transition-all opacity-40 ${
              childVisibility ? "left-10" : "left-[90%]"
            }`}
          />

          {icon && !icon?.img && (
            <Icon
              className={`icon  ${
                ["h-[80px]  max-w-[80px]", "text-[34px] relative z-2"]?.[
                  template || 0
                ]
              }`}
              icon={icon}
              height={["38px"]?.[template || 0]}
              width={["38px"]?.[template || 0]}
            ></Icon>
          )}
          {icon && icon?.img && (
            <Avatar style="h-[38px] w-[38px]" CID={icon?.img} />
          )}
        </div>

        <div
          className={`flex  flex-col ${
            [
              "mx-auto items-center w-full",
              "w-full h-fit justify-center items-center ",
            ]?.[template || 0]
          }`}
        >
          <div
            className={`  ${
              [
                "w-full text-center title mt-[30px] m-0",
                `ml-3  uppercase font-semibold  flex  text-left m-0 w-full ${
                  childVisibility ? "mt-10" : ""
                }`,
              ]?.[template || 0]
            }`}
          >
            {title}
          </div>
          <div className="_text w-full flex flex-col">
            <div
              className={` ${["px-5", "mt-2 px-2"]?.[template || 0]} w-full ${
                childVisibility ? "pb-10" : ""
              }`}
            >
              {clickable
                ? childVisibility === "card_ic_clickable"
                  ? children
                  : null
                : children ||
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, exquas quae eveniet."}
            </div>
            {btn && (
              <MyMainBtn
                setter={setter}
                url={url}
                template={1}
                color={2}
                style={" flex mx-auto font2 mt-5 mb-2"}
              >
                {btn}
              </MyMainBtn>
            )}
          </div>
        </div>
      </div>
    </MyCard>
  );
};
