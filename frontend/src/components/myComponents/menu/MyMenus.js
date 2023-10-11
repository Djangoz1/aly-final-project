import {
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";

import {
  motion,
  useAnimation,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";

import { useMissionState } from "context/hub/mission";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useToolsState } from "context/tools";
import Link from "next/link";

export const MyMenus = ({ menus, styles, setter }) => {
  let dispatch = useFormDispatch();
  let { pointer } = useFormState();
  let handleClick = (title, index) => {
    doStateFormPointer(dispatch, index);
  };

  return (
    <div className={`flex tabs-boxed ${styles?.box}`}>
      {menus?.map((el, index) => (
        <div
          onClick={() => handleClick(el?.title, index)}
          key={v4()}
          className={`${
            pointer === index ? "font-black text-white bg1  border-y-0 " : ""
          } relative w-full font-light tab tab-xs  hover:bg-white/10 rounded-lg h-fit py-2 flex items-center text-[10px]   cursor-pointer ${
            styles?.el
          } `}
        >
          <div
            className={` g1  rounded-full    w-1/4 absolute  left-1/2 -translate-x-1/2 translate-y-1/2 bottom-0 ${
              pointer === index && "gb1  py-[1px] "
            }`}
          ></div>
          {el?.i && <span className="mr-2">{el?.i}</span>}
          {el?.title}
        </div>
      ))}
    </div>
  );
};

export const MyMenus2 = ({ arr }) => {
  let { state, url } = useToolsState();

  return (
    <div className=" z-100 h-fit  font2 items-end  flex flex-col">
      {arr?.map((el, index) => (
        <Link
          key={v4()}
          href={el?.url}
          className={`
            flex  flex-row items-center relative w-fit my-2 h-fit 
              ${
                url === el?.url
                  ? "text-lg font-black "
                  : " cursor-pointer opacity-50 "
              }`}
        >
          {el?.title}
          {url === el?.url && (
            <div className="g1 gr1 px-[2px] rounded-full py-5 w-fit ml- h-full  "></div>
          )}
        </Link>
      ))}
    </div>
  );
};
export const MyMenus1 = ({ arr, target0, target1 }) => {
  let { state, pointer, target } = useToolsState();

  return (
    <div className="z-100 font2 transition-all items-end  flex flex-col">
      {arr?.map((el, index) => (
        <Link
          key={v4()}
          href={`${el?.tag ? "#section" + index : el?.href}`}
          className={`flex items-center my-2 
           ${
             index === pointer
               ? "  font-black "
               : !el?.href
               ? " text-sm  opacity-50 "
               : " text-xs opacity-30 "
           }

           hover:text-white hover:opacity-100 hover:text-[18px]
          `}
        >
          {el?.title}
          {/* {index === pointer && (
            // <div className="bg2 px-[2px] rounded-full py-2 w-fit ml-5 h-full  "></div>
          )} */}
        </Link>
      ))}
    </div>
  );
};
