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
              ? "cta-button project-owner  font-bold border-y-0"
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
