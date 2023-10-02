import { Icon } from "@iconify/react";
import { Hg, Hg1 } from "components/text/HeroGradient";
import React, { useState } from "react";
import { v4 } from "uuid";

export const MyCard = ({ head, children, icon, styles }) => {
  let [isClicked, setIsClicked] = useState(null);
  return (
    <div
      className={`relative bg-zinc-900 py-4 px-6   z-0 h-fit  rounded-xl  box-border   font2 shadow-xl ${styles}`}
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
  styles,
  btn,
}) => {
  let colors = ["", "gb1", "gr1"];
  let _colors = ["gb2", "gb2", "gr2"];
  let [isClicked, setIsClicked] = useState(0);

  let title = [
    <Hg style={"flex text-lg items-center"}>{head?.title}</Hg>,
    <Hg1 style={"flex text-lg items-center"}>{head?.title}</Hg1>,
    <Hg style={"flex text-lg items-center"}>{head?.title}</Hg>,
  ];
  return (
    <div
      className={`${styles} rounded-lg shadow-inner font2 bg-zinc-900 flex justify-between  right-0  py-5 px-5`}
    >
      <div className="flex flex-col relative w-full  items-start">
        <div className="flex  items-center w-full">
          <Icon icon={head?.icon} className={" text-white text-lg mr-4  "} />
          {head?.component} {title[color || 0]}
        </div>

        <div
          className={`g1 py-[1px] rounded-full mt-3 mb-2 w-full ${_colors[color]} transition-all `}
        ></div>

        {menus && (
          <div className="flex w-fit rounded-full bg-white/10 mb-5">
            {menus.map((el, i) => (
              <button
                key={v4()}
                onClick={() => setIsClicked(i)}
                className={`px-5 whitespace-nowrap btn rounded-full font2 normal-case  btn-xs ${
                  i === isClicked
                    ? ` g1 border-none text-white ${_colors[color]}`
                    : "btn-ghost"
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        )}
        <div className="flex  flex-wrap justify-between w-full  items-end">
          {!menus ? children : components[isClicked]}
          {btn && <div className="ml-auto mt-2">{btn}</div>}
        </div>
      </div>
    </div>
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
