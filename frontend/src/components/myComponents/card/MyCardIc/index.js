import React, { useState } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import { icfy, icfyROCKET } from "icones";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";
export const MyCardIc = ({
  children,
  clickable,
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
    <div
      onClick={() =>
        clickable &&
        setChildVisiblty(
          childVisibility !== "card_ic_clickable" ? "card_ic_clickable" : null
        )
      }
      className={`card_ic py-4 shadow1  flex flex-col  font2 ${childVisibility} ${
        clickable && "pointer"
      } ${style || ""}`}
    >
      <div className="_icon shadow2 ">
        {icon && !icon?.img && (
          <Icon className="icon" icon={icon} height="38px" width="38px"></Icon>
        )}
        {icon && icon?.img && (
          <Avatar style="h-[38px] w-[38px]" CID={icon?.img} />
        )}
      </div>
      <div className="flex mx-auto items-center flex-col">
        <div className="title flex flex-col">{title}</div>
        <div className="_text flex flex-col">
          <div className="w-full">
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
              style={"ml-auto  font2 mt-5 mb-2"}
            >
              {btn}
            </MyMainBtn>
          )}
        </div>
      </div>
    </div>
  );
};
