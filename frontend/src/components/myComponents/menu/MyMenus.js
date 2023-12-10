import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { icfy, icfyARROWD, icfyGITHUB, icsystem } from "icones";
import { Avatar } from "components/profile/ProfileAvatar";
import { MySub } from "../text/MySub";

export const MyMenus = ({ menus, current }) => {
  let { url } = useToolsState();

  return (
    <div className={`flex px-5 box-border flex-col`}>
      {menus?.map(
        (el, index) =>
          el?.title && (
            <div key={v4()} className={"flex my-4 flex-col"}>
              <div className="flex mb-1 items-center">
                <MySub style={"whitespace-nowrap c4"}>{el?.title}</MySub>
                <div className="w-full ml-2 border border-white/5" />
              </div>
              {el?.sub?.map(
                (subElem) =>
                  subElem?.title && (
                    <Link
                      href={`${subElem?.url ? `${subElem?.url}` : "#"}`}
                      className={`flex indicator items-center font-light hover:text-white rounded-lg hover:bg-white/5 text-xs p-2  w-full relative ${
                        current == subElem?.url ? "bg-white/10 c3" : "c4"
                      }`}
                      key={v4()}
                    >
                      <Icon icon={subElem?.icon} className="text-[24px] mr-3" />{" "}
                      {subElem?.title}
                      {current == subElem?.url ? (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pl-1 py-3 translate-x-1/2 rounded-full gb1 g1" />
                      ) : (
                        <></>
                      )}
                    </Link>
                  )
              )}
            </div>
          )
      )}
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
      border: "bc1",
      hover: "text-white/60",
      bg: "gb1 g1",
      bg1: "bg2",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "bg-warning/30",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "g1 gb1",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "g1 gb2",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "g1 gb3",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "g1 gr1",
    },
    {
      color: "c1",
      border: "bc2",
      hover: "c1 ",
      bg: "g1 gr2",
    },
  ];
  return (
    <div
      className={`c4    border-gray-200/30 ${
        [" border-b ", "  border-r  "]?.[template || 0]
      } ${style}`}
    >
      <div
        className={`-mb-px flex   hidden-scrollbar   ${
          [
            "overflow-x-scroll ",
            "overflow-y-scroll flex-col h-full w-full ",
            " w-fit",
          ]?.[template || 0]
        }  ${styleOrigin}`}
      >
        {children ? (
          <Link
            onClick={() => setter(null)}
            key={v4()}
            href={"#"}
            className={` relative  min-w-[70px]      overflow-hidden       text-sm    
            ${
              [
                "rounded-t-lg items-center gap-2 px-3 inline-flex justify-center h-full text-center border-b-4 py-2 rounded-tr-lg",
                `rounded-t-lg flex items-center    w-full px-3  py-2 text-left  bg-transparent rounded-b-lg `,
                `rounded-t-lg flex items-center  py-1 px-5 mr-2 text-xs bg-black/5 w-fit text-left rounded-b-lg border-b-4 hover:-mb-1 ${
                  null == value &&
                  `${colors?.[color || 0]?.bg || "bg-black/20"}`
                }`,
                `flex items-center    px-5 mr-2 text-xs bg-black/5 py-2 w-fit text-left rounded-b-lg border-b-2 hover:-mb-1 ${
                  null == value &&
                  `${"bg-white/5"} ${colors?.[color]?.color} ${
                    colors?.[color]?.border
                  } `
                }`,
              ]?.[template || 0]
            }
            
            ${
              value === null
                ? ` font-bold ${
                    [
                      `${colors[color || 0]?.border} ${
                        colors[color || 0]?.color
                      }`,
                      "border border-white/10 shadow1 c3 bg-neutral-800",
                      `${colors[color || 0]?.border} ${
                        colors[color || 0]?.color
                      }`,
                      ` `,
                    ]?.[template || 0]
                  }   `
                : `c4 border-transparent  font-medium hover:border-gray-300 hover:text-gray-600 hover:bg-black/5`
            }`}
          >
            {[true, true, false][template || 0] === true && (
              <>
                <span
                  className={`h-full w-full  top-0 right-0 -z-1 absolute  ${
                    value === null && colors?.[color]?.bg1
                      ? colors[color]?.bg1
                      : ["bg-black/50", "", "bg-black/5"]?.[template || 0]
                  }`}
                />
                <span
                  className={`h-full  ${
                    [
                      "top-0 rounded-tr-full left-0",
                      "-top-0  -right-0 rotate-90 ",
                    ]?.[template || 0]
                  }   absolute transition-all ${
                    value === null
                      ? ["w-full", "w-[44px]", "w-full"]?.[template || 0]
                      : " w-0"
                  }  ${colors[color || 0]?.bg}`}
                  style={
                    [
                      undefined,
                      { borderRadius: "0% 100% 0% 100% / 0% 100% 0% 100%" },
                    ]?.[template]
                  }
                />
              </>
            )}

            <Icon
              icon={icfy.ux.plus}
              className={
                ["text-lg", `text-2xl  mr-2`, `text-2xl `]?.[template || 0]
              }
            />

            <span
              className={`flex items-center my-auto relative ${
                ["", "", "mx-3"]?.[template || 0]
              }`}
            >
              {children}
            </span>
          </Link>
        ) : undefined}
        {arr?.map(
          (el, i) =>
            el && (
              <Link
                onClick={() => setter(i)}
                key={v4()}
                href={el?.url || "#section" + pointer}
                as={el?.url || "#section" + pointer}
                className={` relative  min-w-[70px]      overflow-hidden       text-sm    
            ${
              [
                "hover:border-gray-300 hover:text-gray-600 hover:bg-black/5 rounded-t-lg items-center gap-2 px-3 inline-flex justify-center h-full text-center border-b-4 py-2 rounded-tr-lg",
                `hover:border-gray-300 hover:text-gray-600 hover:bg-black/5 rounded-t-lg flex items-center    w-full px-3  py-2 text-left  bg-transparent rounded-b-lg `,
                `rounded border border-white/5   flex items-center    py-2 px-5 mr-2 text-xs bg-black/20 w-fit text-left  border-b-1 hover:text-white ${
                  i == value &&
                  `${colors?.[color || 0]?.bg || "bg-black"} ${
                    colors?.[color || 0]?.border || "border-b-white/70"
                  }  border-l-whsite  text-white`
                }`,
                `hover:border-gray-300 hover:text-gray-600 hover:bg-black/5 flex items-center    px-5 mr-2 text-xs bg-black/5 py-2 w-fit text-left rounded-b-lg border-b-2 hover:-mb-1 ${
                  i == value &&
                  `${"bg-white/5"} ${colors?.[color]?.color} ${
                    colors?.[color]?.border
                  } `
                }`,
              ]?.[template || 0]
            }
            
            ${
              value === i
                ? ` font-bold ${
                    [
                      `${colors[color || 0]?.border} ${
                        colors[color || 0]?.color
                      }`,
                      "border border-white/10 shadow c3 bg-gradient-to-l hover:from-white/10 hover:to-black/30 _hover from-white/5 to-black/20",
                      `${colors[color || 0]?.border} ${
                        colors[color || 0]?.color
                      }`,
                      ` `,
                    ]?.[template || 0]
                  }   `
                : `c4 border-transparent  font-medium `
            }`}
              >
                {[true, true, false][template || 0] === true && (
                  <>
                    <span
                      className={`h-full w-full  top-0 right-0 -z-1 absolute  ${
                        value === i && colors?.[color]?.bg1
                          ? colors[color]?.bg1
                          : ["bg-black/50", "", "bg-black/5"]?.[template || 0]
                      }`}
                    />
                    <span
                      className={`h-full  ${
                        [
                          "top-0 rounded-tr-full left-0",
                          "-top-0 opacity-10 -right-0 rotate-90 ",
                        ]?.[template || 0]
                      }   absolute transition-all ${
                        value === i
                          ? ["w-full", "w-[44px]", "w-full"]?.[template || 0]
                          : " w-0"
                      }  ${colors[color || 0]?.bg}`}
                      style={
                        [
                          undefined,
                          { borderRadius: "0% 100% 0% 100% / 0% 100% 0% 100%" },
                        ]?.[template]
                      }
                    />
                  </>
                )}
                {el?.icon ? (
                  <Icon
                    icon={el?.icon}
                    className={
                      ["text-lg", `text-2xl  mr-2`, `text-2xl `]?.[
                        template || 0
                      ]
                    }
                  />
                ) : undefined}
                <span
                  className={`flex items-center my-auto relative ${
                    ["", "", "mx-3"]?.[template || 0]
                  }`}
                >
                  {el}
                </span>
                {/* //! WTF */}
                {/* {value === i && template === 1 ? (
                  <MyMainBtn
                    template={2}
                    style={"rounded-full shadow1 ml-auto"}
                    padding={" p-2"}
                  ></MyMainBtn>
                ) : undefined} */}
              </Link>
            )
        )}
      </div>
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
    <div className="flex flex-col w-full border-t-white/5 border-transparent border  ">
      {children && (
        <button
          onClick={refresh}
          className={`w-1/3 text-left py-3 px-2 border-y-1 border border-x-0 border-t-0   ${
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
