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
import {
  doIndexTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import Link from "next/link";
import { MyProgress } from "../layout/MyProgress";
import { ENUMS } from "constants/enums";
import { Icon } from "@iconify/react";
import { icfy, icfyARROWD, icfyGITHUB, icsystem } from "icones";
import { Avatar } from "components/profile/ProfileAvatar";
import { MyMainBtn1 } from "../btn/MyMainBtn";

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

export const MyMenusTabs = ({
  setter,
  style,
  value,
  template,
  children,
  arr,
  styleOrigin,
  target,
  color,
}) => {
  let { pointer } = useToolsState();
  let colors = [
    { color: "c1", hover: "text-black/60", border: "bc1", bg: "bg-sky-700/30" },
    { color: "c2", border: "bc2", hover: "text-white/60", bg: "bg-success/40" },
    { color: "c3", hover: "text-black/60", border: "bc1", bg: "bg-sky-700/30" },
    {
      color: "c3",
      border: "bc2",
      hover: "c1 ",
      bg: "bg-warning/30",
    },
    {
      color: "c1",
      border: "bc3",
      hover: "text-white/60",
      bg: "gb1 g1",
      bg1: "bg2",
    },
  ];
  return (
    <div
      className={`c4    border-gray-200/30 ${
        [" border-b ", "  border-r  "]?.[template || 0]
      } ${style}`}
    >
      <div
        className={`-mb-px flex  hidden-scrollbar   ${
          ["overflow-x-scroll ", "overflow-y-scroll flex-col h-full w-fit "]?.[
            template || 0
          ]
        }  ${styleOrigin}`}
      >
        {children ? (
          <Link
            onClick={() => setter(null)}
            key={v4()}
            href={"#section" + pointer}
            as={"#section" + pointer}
            className={`inline-flex  ${
              ["items-center  rounded-tr-lg", "items-end rounded-b-lg"]?.[
                template || 0
              ]
            } gap-2 border-b-4  px-3 py-4 text-sm font-medium   ${
              value === null
                ? ` ${colors[color || 0].bg} c ${colors[color || 0]}`
                : ` border-transparent hover:border-gray-300 hover:${
                    colors[color || 0].hover
                  }`
            }`}
          >
            <Icon icon={icfy.ux.plus} className="text-lg" />

            {children}
          </Link>
        ) : undefined}
        {arr?.map((el, i) => (
          <Link
            onClick={() => setter(i)}
            key={v4()}
            href={el?.url || "#section" + pointer}
            as={el?.url || "#section" + pointer}
            className={` relative  min-w-[70px]     rounded-t-lg overflow-hidden  border-b-4  px-3   text-sm    
            ${
              [
                "items-center gap-2 inline-flex justify-center h-full text-center py-4 rounded-tr-lg",
                `flex items-center justify-between min-h-[100px] py-2 text-left rounded-b-lg shadowh _hover ${
                  i == value && "shadow1"
                }`,
              ]?.[template || 0]
            }
            
            ${
              value === i
                ? ` font-bold ${colors[color || 0]?.border} ${
                    colors[color || 0]?.color
                  }  `
                : `c4 border-transparent  font-medium hover:border-gray-300 hover:text-gray-600 hover:bg-black/5`
            }`}
          >
            {
              <>
                <span
                  className={`h-full w-full  top-0 right-0 -z-1 absolute  ${
                    value === i && colors?.[color]?.bg1
                      ? colors[color]?.bg1
                      : "bg-black/50"
                  }`}
                />
                <span
                  className={`h-full  ${
                    [
                      "top-0 rounded-tr-full left-0",
                      "-top-10 -right-10 mask mask-hexagon ",
                    ]?.[template || 0]
                  }   absolute transition-all ${
                    value === i ? "w-full" : " w-0"
                  }  ${colors[color || 0]?.bg}`}
                />
              </>
            }
            {el?.icon ? (
              <Icon
                icon={el?.icon}
                className={
                  [
                    "text-lg",
                    `text-2xl absolute right-2 top-2 ${
                      i != value && "opacity-0"
                    }`,
                  ]?.[template || 0]
                }
              />
            ) : undefined}
            <span className="flex items-center my-auto relative">
              {target ? el?.[target] : el}
            </span>
          </Link>
        ))}
      </div>
    </div>

    // <div className="tabs flex-nowrap  overflow-x-scroll hide-scrollbar transition-all  mb-3">
    //   {children && (
    //     <button
    //       onClick={() => setter(null)}
    //       className={`px-4 py-2 text-xs    mr-3 rounded-lg   ${
    //         value === null
    //           ? "tab-active shadow2  text-white"
    //           : "shadow1 text-white/40 backdrop-blur"
    //       }`}
    //     >
    //       {children}
    //     </button>
    //   )}
    //   {arr?.map(
    //     (el, i) =>
    //       el && (
    //         <button

    //         >
    //         </button>
    //       )
    //   )}
    // </div>
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
      {arr?.map(
        (el, index) =>
          el?.title && (
            <Link
              key={v4()}
              href={`${el?.tag ? "#section" + index : el?.href}`}
              className={`flex  items-center cursor-pointer transition-all rounded-lg mt-3 uppercase text-xs   py-2 font2 justify-between       w-full px-0 
           ${
             index === pointer
               ? "    c2 shadow2"
               : !el?.href
               ? " text-sm shadow1  backdrop-blur "
               : " text-xs shadow1  "
           }

           hover:text-white hover:opacity-100 
          `}
            >
              {/* {index === pointer && (
                <div className={"g1 gb2 pt-[1px] mb-1  w-full  relative"} />
              )} */}
              <div className="mx-4">{el?.title}</div>
              {index === pointer && (
                <div className=" g1 gb2 py-[1px] w-12  flex justify-end" />
              )}
            </Link>
          )
      )}
    </div>
  );
};

export const MyMenusDropdown = ({ children, funcs, isFolders }) => {
  const [isIndexes, setIsIndexes] = useState([null, null, null]);
  let dispatch = useToolsDispatch();
  let { state } = useToolsState();

  let refresh = () => {
    setIsIndexes([null, null, null]);
    let _state = state;
    _state.front = {
      target: null,
      props: null,
    };
    doStateTools(dispatch, _state);
  };

  let handleChangeIndex = async ({ element, i, pointer }) => {
    let _indexes = isIndexes.slice(); // Créez une copie du tableau

    if (funcs && funcs?.[element?.name?.toLowerCase()]) {
      funcs?.[element?.name?.toLowerCase()]();
    }
    if (_indexes[pointer] === i) {
      _indexes[pointer] = null;
    } else {
      _indexes[pointer] = i;
    }
    if (pointer != _indexes.length - 1) {
      for (let index = pointer + 1; index < _indexes.length; index++) {
        _indexes[index] = null;
      }
    }

    setIsIndexes(_indexes);

    if (
      element?.props &&
      element?.target &&
      (state?.front?.target !== element?.target ||
        state?.front?.props !== element?.props)
    ) {
      let _state = state;
      _state.front = {
        target: element?.target,
        props: element?.props,
      };
      doStateTools(dispatch, _state);
    }
  };

  const renderChild = (element, pointer) => {
    const childElements = element?.arr || [];

    return (
      <div className="box-border h-fit border flex-auto ml-1 border-l-1 border-r-0 border-y-0  border-white/10">
        {childElements.map((el2, i) => (
          <div key={v4()} className="  flex flex-col">
            <div
              onClick={() =>
                handleChangeIndex({ element: el2, i, pointer: pointer })
              }
              className={`flex cursor-pointer items-center py-3 ${
                isIndexes[pointer] === i
                  ? "bg-white/5 text-white"
                  : "hover:bg-white/10 text-white/40"
              }`}
            >
              {el2.icon && (
                <Icon
                  icon={el2.icon}
                  className={`mr-4 ml-2 text-lg ${
                    el2.color && "text-" + el2.color
                  }`}
                />
              )}
              {el2.img && <Avatar CID={el2.img} style="mr-2 ml-2 w-6" />}
              <p className="w-fit capitalize">{el2.name}</p>
              {el2.arr && (
                <Icon
                  icon={icfyARROWD}
                  className={`ml-auto  mr-3 text-xs ${
                    isIndexes[pointer] !== i ? "rotate-180 " : "rotate-0"
                  }`}
                />
              )}
              {el2.component && (
                <div className="ml-auto  mr-3 ">{el2.component}</div>
              )}
            </div>
            {isIndexes[pointer] === i && renderChild(el2, pointer + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {children && (
        <button
          onClick={refresh}
          className={`w-full py-3 px2 border-b-1 border border-x-0 border-t-0   ${
            isIndexes[0] === null
              ? " text-white border-white/40"
              : "text-white/50 border-white/5"
          }`}
        >
          {children}
        </button>
      )}
      {isFolders &&
        Object?.keys(isFolders)?.map((key, i) => (
          <div
            className={`flex flex-col  text-xs  box-border mb-4 w-full ${
              isIndexes[0] === i ? " bg-white/5 shadow1" : ""
            }`}
            key={v4()}
          >
            <div
              className="flex mx-0 cursor-pointer py-3 items-center capitalize transition-all box-border w-full"
              onClick={() =>
                !isFolders[key]?.blockDrop &&
                handleChangeIndex({ element: isFolders[key], pointer: 0, i })
              }
            >
              <Icon
                icon={isFolders[key]?.icon}
                className={"mr-4 ml-2 text-lg text-" + isFolders[key].color}
              />
              {isFolders[key].name}
              {!isFolders[key]?.blockDrop && (
                <Icon
                  icon={icfyARROWD}
                  className={`ml-auto mr-2 ${
                    isIndexes[0] === i && "rotate-180"
                  }`}
                />
              )}
            </div>

            {isIndexes[0] === i && renderChild(isFolders[key], 1)}
          </div>
        ))}
    </div>
  );
};
