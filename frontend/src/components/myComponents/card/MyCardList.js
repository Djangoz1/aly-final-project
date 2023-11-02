import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { MyCountdown } from "../MyCountdown";
import { v4 } from "uuid";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { MyCard, MyCard1 } from "./MyCard";
import Link from "next/link";
import { icfy } from "icones";
import { motion, AnimatePresence } from "framer-motion";
import { MyMainBtn } from "../btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";

export const MyCardList = ({
  url,
  style,
  side,
  price,
  children,
  head,
  target,
  setter,
  arr,
  btn,
  color,
}) => {
  let colors = [
    { bg: "bg1", text: "c2", btn: "bg1", shadow: "rgb(171,_196,_245)" },
    { bg: "bg-red-900", text: "text-secondary", btn: "bg1" },
  ];
  let _colors = ["text-primary", "text-info", "text-error"];

  return (
    <MyCard styles={`${style}   font2  flex  h-fit      `}>
      <div className="   flex flex-col relative  justify-end  pb-8  w-fit ">
        {head?.icon && (
          <div className="text-2xl  absolute hover:scale-150 _hover shadow1 rounded-full overflow-hidden p-[1px] right-0 translate-x-1/2  bottom-0 ">
            <span className="relative w-[70px]  h-[70px] text-[80px] shadowh _hover rounded-full overflow-hidden top-0 left-0   flex">
              <span className=" w-1/2  relative overflow-hidden h-full flex items-center justify-end bg3">
                <Icon
                  icon={head?.icon}
                  className=" text-black   translate-x-1/2 "
                />
              </span>
              <span className=" w-1/2  relative overflow-hidden h-full flex items-center bgprim">
                <Icon icon={head?.icon} className=" c3    -translate-x-1/2 " />
              </span>
            </span>
          </div>
        )}
        {head?.title ? (
          <div className="mb-auto">
            <div className="flex  items-center relative   c4 hover:text-white">
              <h6 className="text-2xl font-black font2   ">{head?.title}</h6>
            </div>
            {head?.component}
          </div>
        ) : undefined}
        {!side
          ? arr?.map((el) =>
              el?.title ? (
                <div
                  key={v4()}
                  className="flex flex-col mb-8 px-10 items-center sm:flex-row"
                >
                  <div
                    className={`mr-4 flex h-12 w-12 flex-none flex-col items-center justify-center rounded-full  shadow1 bg1 ${colors[0]?.bg}`}
                  >
                    <Icon
                      icon={el?.icon}
                      className={colors[color || 0]?.text + " text-2xl"}
                    />
                  </div>
                  <div className="flex w-full flex-col items-center sm:items-start">
                    <p className="font uppercase whitespace-nowrap">
                      {el?.title}
                    </p>
                    <p className="text-center c4 md:text-start">
                      {el?.description || "Up to 100GB for works"}
                    </p>
                  </div>
                </div>
              ) : undefined
            )
          : side}
      </div>
      <div className="flex    border border-l-white/5 border-white/0 flex-1 px-[60px] py-8 bg3   ml-auto w-fit flex-col">
        <motion.div
          className="h-full"
          key={v4()}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          // exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>

        <div className="mb-4 c1 mt-auto text-left flex items-start text-3xl font-extrabold md:text-5xl">
          {price}

          <span className="text-sm  text-[#636262] ml-2">ETH</span>
        </div>
        <MyMainBtn target={target} url={url} setter={setter} style={`mb-4 `}>
          {btn?.title}
        </MyMainBtn>
        {btn?.info && <p className="c4 text-sm font-light">{btn?.info}</p>}
      </div>
    </MyCard>
  );
};
