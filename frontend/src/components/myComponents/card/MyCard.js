import { Icon } from "@iconify/react";
import { Hg, Hg1 } from "components/text/HeroGradient";
import React, { useState } from "react";
import { v4 } from "uuid";

export const MyCard = ({ head, children, icon, styles }) => {
  let [isClicked, setIsClicked] = useState(null);
  return (
    <div
      className={`relative backdrop-blur bg-white/5 py-4  px-6   z-0 h-fit  rounded-xl  box-border   font2 shadow-xl ${styles}`}
    >
      {head && (
        <h6 className="text-white text-lg items-center mb-3 flex">
          <Icon icon={head?.icon} className="text-xl mr-2" /> {head?.title}
        </h6>
      )}
      <div className="w-full h-full" onClick={() => setIsClicked(false)}>
        {children}
      </div>
    </div>
  );
};

export const MyCard1 = ({
  head,
  children,
  components,
  color,
  menus,
  setterMenu,
  styles,
  btn,
}) => {
  let colors = ["", "gb2", "gr2"];
  let _colors = ["gb2", "bg2", "gr2"];
  let [isClicked, setIsClicked] = useState(0);

  let handleChangeMenu = (index) => {
    setIsClicked(index);
    setterMenu && setterMenu(index);
  };

  let title = [
    <Hg style={"flex text-lg items-center"}>{head?.title}</Hg>,
    <Hg1 style={"flex text-lg items-center"}>{head?.title}</Hg1>,
    <Hg style={"flex text-lg items-center"}>{head?.title}</Hg>,
  ];
  return (
    <div
      className={`${styles} box-border rounded-lg shadow-inner font2 backdrop-blur  flex justify-between  right-0  py-5 px-5`}
    >
      <div className="flex flex-col relative w-full  items-start">
        <div className="flex  items-center w-full">
          <Icon icon={head?.icon} className={" text-white text-lg mr-4  "} />
          {head?.component} {title[color || 0]}
        </div>

        {menus && (
          <div className="flex w-fit rounded-full bg-white/10 ">
            {menus.map((el, i) => (
              <button
                key={v4()}
                onClick={() => handleChangeMenu(i)}
                className={`px-5 whitespace-nowrap btn rounded-full font2 normal-case  btn-xs ${
                  i === isClicked
                    ? `  border-none c1 text-white ${_colors[color]}`
                    : "btn-ghost"
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        )}
        <div
          className={`g1 py-[1px] rounded-full mt-3 mb-2 w-full ${colors[color]} transition-all `}
        ></div>
        {(children || components) && (
          <div className="flex  flex-wrap overflow-y-scroll hide-scrollbar  justify-between w-full  items-end">
            {!menus ? children : components?.[isClicked]}
            {btn && <div className="ml-auto mt-2">{btn}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export const MyCardInfos = ({ style, arr, title, children }) => {
  return (
    <MyCard styles={style}>
      {title && <div className="w-full text-sm ">{title}</div>}
      {arr?.map(
        (el) =>
          el?.title && (
            <div
              key={v4()}
              className="flex items-center relative text-left text-[10px] border py-4  border-t-0 border-x-0 border-white/10  justify-between"
            >
              <div className="w-1/2 flex items-center text-white/40">
                {el?.title}
              </div>
              <div className="w-1/2 flex items-center  ">{el?.value}</div>
            </div>
          )
      )}
      {children}
    </MyCard>
  );
};

export const MyCardList = ({ head, arr, btn, styles, color }) => {
  let colors = ["", "gb1", "gr1"];
  let _colors = ["text-primary", "text-info", "text-error"];

  return (
    <MyCard1 styles={styles} head={head} color={color} btn={btn}>
      {arr?.map((el, i) => (
        <>
          <div
            key={v4()}
            className={`flex flex-col w-1/2 mb-2    rounded-lg ${
              i % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            <div className="text-xs text-white/40 mb-1">{el?.title}</div>
            <div className="text-xs">{el?.value}</div>
          </div>
        </>
      ))}
    </MyCard1>
  );
};
