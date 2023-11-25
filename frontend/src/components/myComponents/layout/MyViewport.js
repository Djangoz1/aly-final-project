"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  AnimatePresence,
  useInView,
  useIsPresent,
  usePresence,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";

import { v4 } from "uuid";

import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { ImagePin } from "components/Image/ImagePin";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export function Viewport({
  index,
  side,
  particles,
  fixed,
  img,
  full,
  background,
  children,
  id,
}) {
  const ref = useRef(null);

  const ref1 = useRef(null);
  const isInView1 = useInView(ref1);

  const isInView = useInView(ref);

  const { scrollYProgress } = useViewportScroll();
  const y = useParallax(scrollYProgress, 300);
  let { state, status, target, pointer } = useToolsState();
  // const isInView = useInView(ref);

  const dispatch = useToolsDispatch();

  useEffect(() => {
    if (isInView && isInView1 && status !== "pointer" && pointer != index) {
      console.log("isInView pointer ...", index);
      doPointerTools(dispatch, index);
      console.log("isInView pointer ...", index);
    }
  }, [isInView, isInView1]);

  const images = [
    "https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a26e_Background%20Hero.svg",

    "https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f68133fc5cb4e29ed28fa_Get%20Started%20BG.svg",
    "https://assets.website-files.com/646f65e37fe0275cfb808405/646f683b1e3793b739a1c34c_Pricing%20BG%20(1).svg",
    "https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f68133fc5cb4e29ed28fa_Get%20Started%20BG.svg",
    "https://assets.website-files.com/646f65e37fe0275cfb808405/646f683b1e3793b739a1c34c_Pricing%20BG%20(1).svg",
  ];

  return (
    <>
      <section
        // style={{ overflow: "scroll" }}
        id={`section${index}`}
        className="viewport -z-1  w-[100vw] flex flex-col  font2  h-[100vh] mb-10 carr-sec"
      >
        {!background
          ? img?.image
            ? img?.image
            : images?.[index] &&
              !img?.no && (
                <img
                  src={images?.[index]}
                  alt=""
                  className="absolute inset-[0%] -z-[5] inline-block h-full w-full object-cover"
                />
              )
          : undefined}
        {background ? (
          <div
            src={images?.[index]}
            alt=""
            className=" bg-black absolute inset-[0%] -z-[5] inline-block h-full w-full object-cover"
          />
        ) : undefined}

        {img && !img?.image && (
          <div className="absolute top-0 left-0">
            <ImagePin
              CID={img}
              styleImg={"brightness-75 w-screen h-screen "}
              style={" w-screen h-screen fixed top-0 left-0"}
            />
          </div>
        )}

        <div
          className={` flex  flex-col relative  mt-[10vh]   ${
            full
              ? " w-screen  h-screen overflow-y-scroll overflow-x-hidden hide-scrollbar px-10"
              : "  max-w-[1600px] w-[65vw] h-[80vh] mx-auto  "
          } `}
        >
          <div ref={ref} className="absolute w-full py-1   top-0 "></div>
          <div ref={ref1} className="absolute  bottom-0 py-1 w-full"></div>
          {!fixed ? children : undefined}
        </div>

        {side && (
          <div className="w-[15vw] h-[92vh] backdrop-blur  rounded-tr-lg overflow-hidden shadow1 bottom-0 left-0  absolute  z-10">
            {side}
          </div>
        )}
      </section>

      {fixed && (
        <AnimatePresence>
          <motion.div
            className="h-screen z-100 w-screen fixed py-20 top-0 left-0"
            key={v4()}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
