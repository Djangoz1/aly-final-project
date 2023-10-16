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
import { doIndexTools, useToolsDispatch, useToolsState } from "context/tools";
import Link from "next/link";
import { MyProgress } from "../layout/MyProgress";
import { ENUMS } from "constants/enums";
import { Icon } from "@iconify/react";
import { icfy, icfyARROWD } from "icones";
import { Avatar } from "components/profile/ProfileAvatar";

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

export const MyMenusTabs = ({ setter, value, children, arr, target }) => {
  return (
    <div className="tabs ">
      {children && (
        <button
          onClick={() => setter(null)}
          className={`tab-lifted  tab    ${
            value === null ? "tab-active text-white" : ""
          }`}
        >
          {children}
        </button>
      )}
      {arr?.map(
        (el, i) =>
          el && (
            <button
              onClick={() => setter(i)}
              key={v4()}
              className={`tab-lifted  tab    ${
                value === i ? "tab-active c2" : ""
              }`}
            >
              {target ? el?.[target] : el}
            </button>
          )
      )}
    </div>
  );
};

export const MyMenusDropdown = ({ setter, value, children, arr, target }) => {
  let { state, index } = useToolsState();
  let [isFolders, setIsFolders] = useState(null);

  let [isOpen, setIsOpen] = useState(0);

  useEffect(() => {
    if (!isFolders && state?.features?.length > 0) {
      let arr = ENUMS.domain;

      for (let index = 0; index < state?.features?.length; index++) {
        const feature = state?.features?.[index];
        feature.index = index;
        if (
          !arr[feature?.metadatas?.attributes?.[0]?.domain].features?.length
        ) {
          arr[feature?.metadatas?.attributes?.[0]?.domain].features = [];
        }
        if (feature?.metadatas?.attributes?.[0]?.domain >= 0) {
          arr[feature?.metadatas?.attributes?.[0]?.domain].features.push(
            feature
          );
        }
      }
      setIsFolders(arr.filter((el) => el?.features?.length > 0));
    }
  }, [state?.features]);

  let dispatch = useToolsDispatch();

  // console.log("foldes", isFolders);
  // console.log("dropdown", state);
  return (
    <div className="flex flex-col ">
      {isFolders?.map((el, i) => (
        <div
          className={`flex flex-col p-3 text-xs box-border w-full ${
            isOpen === i && "bg-white/5"
          }`}
          key={v4()}
        >
          <div
            className="flex cursor-pointer items-center capitalize transition-all box-border w-full"
            onClick={() => setIsOpen(isOpen === i ? null : i)}
          >
            <Icon
              icon={el?.icon}
              className={"mr-2 text-lg text-" + el?.color}
            />{" "}
            {el?.name}
            <Icon
              icon={icfyARROWD}
              className={`ml-auto mr-2 ${isOpen !== i && "rotate-180"}`}
            />
          </div>

          {i === isOpen && (
            <div className="box-border h-fit  border flex-auto ml-2 border-l-1 border-r-0 border-y-0 py-2 border-white/40">
              {el?.features?.map((feature) => (
                <div
                  onClick={() => doIndexTools(dispatch, feature?.index)}
                  className={`flex px-2 cursor-pointer items-center py-1 ${
                    state?.features?.[index]?.featureID === feature?.featureID
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/40"
                  }`}
                  key={v4()}
                >
                  <Icon
                    icon={ENUMS.courts[feature?.datas?.specification].badge}
                    className="mr-1 text-lg"
                  />
                  {feature?.metadatas?.title}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* {children && (
        <button
          onClick={() => setter(null)}
          className={`tab-lifted  tab    ${
            value === null ? "tab-active text-white" : ""
          }`}
        >
          {children}
        </button>
      )}
      {arr?.map((el, i) => (
        <div
          onClick={() => setter(i)}
          key={v4()}
          className={`tab-lifted  tab    ${value === i ? "tab-active c2" : ""}`}
        >
          {target ? el?.[target] : el}
        </div>
      ))} */}
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
    <div className="z-100 font2 transition-all  backdrop-blur-xl items-start mt-2  flex flex-col">
      {arr?.map((el, index) => (
        <Link
          key={v4()}
          href={`${el?.tag ? "#section" + index : el?.href}`}
          className={`flex items-center uppercase text-xs  flex-col py-2 font2  backdrop-blur       w-full  
           ${
             index === pointer
               ? "   bg-white/5"
               : !el?.href
               ? " text-sm  opacity-50 "
               : " text-xs opacity-30 "
           }

           hover:text-white hover:opacity-100 
          `}
        >
          {/* {index === pointer && (
            <div className={"g1 gb2 pt-[1px] mb-1  w-full  relative"} />
          )} */}
          {el?.title}
          {/* {index === pointer && (
            <div
              className={"g1 gb2 rotate-180 pt-[1px] mt-1 w-full  relative"}
            />
          )} */}

          {/* {index === pointer && (
            // <div className="bg2 px-[2px] rounded-full py-2 w-fit ml-5 h-full  "></div>
          )} */}
        </Link>
      ))}
      <MyProgress style="progress g1 gb2  py-[1px] " />
    </div>
  );
};
