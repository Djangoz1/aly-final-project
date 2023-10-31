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
    <MyCard styles={`${style} overflow-hidden   flex  h-fit      `}>
      <div className="   flex flex-col relative  justify-end py-8 lg:pl-10 w-fit pr-20">
        {head?.title ? (
          <div className="mb-auto">
            {head?.component}
            <div className="flex items-center">
              {head?.icon && (
                <Icon icon={head?.icon} className="text-2xl mr-3" />
              )}
              <h6 className="text-2xl uppercase c2">{head?.title}</h6>
            </div>
          </div>
        ) : undefined}
        {!side
          ? arr?.map((el) =>
              el?.title ? (
                <div
                  key={v4()}
                  className="flex flex-col mb-8 items-center sm:flex-row"
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
