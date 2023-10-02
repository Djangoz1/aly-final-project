import {
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";

export const MyMenus = ({ menus, styles, setter }) => {
  let dispatch = useFormDispatch();
  let { pointer } = useFormState();
  let handleClick = (title, index) => {
    doStateFormPointer(dispatch, index);
  };

  return (
    <div className={`flex ${styles?.box}`}>
      {menus?.map((el, index) => (
        <div
          onClick={() => handleClick(el?.title, index)}
          key={v4()}
          className={`${
            pointer === index
              ? "font-black text-white  border-y-0 bg-white/10"
              : ""
          } relative w-full font-light rounded-lg h-fit py-5 flex items-center text-xs   cursor-pointer ${
            styles?.el
          } `}
        >
          <div
            className={` g1  rounded-full h-1/2   absolute  left-0 -translate-x-1/2 -translate-y-1/2 top-1/2 ${
              pointer === index ? "gb1 py-5 px-[3px] " : "h-1/2 px-[1px] gr1"
            }`}
          ></div>
          {el?.i && <span className="mr-2">{el?.i}</span>}
          {el?.title}
        </div>
      ))}
    </div>
  );
};
