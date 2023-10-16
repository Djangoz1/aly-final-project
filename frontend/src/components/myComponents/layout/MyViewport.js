"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useIsPresent,
  usePresence,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { AuthProvider, useAuthState } from "context/auth";
import { Layout } from "sections/Layout";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import { v4 } from "uuid";
import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyMenus1, MyMenus2 } from "components/myComponents/menu/MyMenus";
import {
  ToolsProvider,
  doPointerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { LayoutTools } from "sections/Layout/LayoutTools";
import { fetchMission } from "utils/works";
import {
  stateDetailsCV,
  stateFeature,
  stateMission,
} from "utils/ui-tools/state-tools";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import { ImagePin } from "components/Image/ImagePin";
import { Particle } from "../MyParticles";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export function Viewport({ index, side, particles, img, full, children, id }) {
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
      doPointerTools(dispatch, index);
      console.log("isInView pointer ...", index);
    }
  }, [isInView, isInView1]);

  return (
    <>
      {particles && particles !== true && <Particle style={particles} />}
      <section
        // style={{ overflow: "scroll" }}
        id={`section${index}`}
        className="viewport -z-1  w-[100vw] flex flex-col  font2  h-[100vh] mb-10 carr-sec"
      >
        {img && (
          <div className="absolute top-0 left-0">
            <ImagePin
              CID={img}
              styleImg={"brightness-75 w-screen h-screen "}
              style={" w-screen h-screen fixed top-0 left-0"}
            />
          </div>
        )}

        <div
          className={` flex flex-col relative  mt-[10vh] max-w-[1200px] mx-auto h-[80vh] ${
            full ? " w-[90vw]  " : "   w-[65vw]"
          } `}
        >
          <div ref={ref} className="absolute w-full py-1   top-0 "></div>
          <div ref={ref1} className="absolute  bottom-0 py-1 w-full"></div>
          {children}
        </div>
        <motion.span className="position  absolute bottom-10 right-10">
          #00<span className="c2 ">{`${id}`}</span>
        </motion.span>
        {side && (
          <div className="w-[15vw] h-[92vh] border border-white/10 border-l-0  bottom-0 left-0  absolute  z-10">
            {side}
          </div>
        )}
      </section>
      {particles && particles === true && <Particle />}
    </>
  );
}
