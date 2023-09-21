import React, { useState } from "react";

export const MyMenus = ({ menus, styles, setter }) => {
  let [isTouch, setIsTouch] = useState(menus[0].title);
  let handleClick = (title, index) => {
    setIsTouch(title);
    if (setter) setter(index);
  };
  return (
    <div className={`flex ${styles?.box}`}>
      {menus?.map((el, index) => (
        <div
          onClick={() => handleClick(el?.title, index)}
          className={`${
            el?.title === isTouch
              ? "bg-black/70 text-white font-bold border-y-white"
              : "border-y-white/10"
          } w-full font-light h-fit py-5 flex items-center border text-sm  border-x-0 cursor-pointer ${
            styles?.el
          } `}
        >
          {el?.i && <span className="mr-2">{el?.i}</span>}
          {el?.title}
        </div>
      ))}
    </div>
  );
};
