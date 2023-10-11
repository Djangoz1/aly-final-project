"use client";

import React, { useEffect, useRef, useState } from "react";
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
  stateTools,
} from "utils/ui-tools/state-tools";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import { Viewport } from "./MyViewport";
import { MyCard1 } from "../card/MyCard";
import { LogoIc } from "components/Logo";
import { MyHeader } from "../MyHeader";
import { Header } from "sections/Layout/Header";
import { MyProgress } from "./MyProgress";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export let MyLayoutApp = ({
  id,
  url,
  menus,
  side,
  arr,
  subMenus,
  target,
  children,
  initState,
}) => {
  // const controls = useAnimation();
  // const { scrollYProgress } = useViewportScroll();

  let [isState, setIsState] = useState(null);

  // const updateScaleX = () => {
  //   controls.start({
  //     scaleX: scrollYProgress.current,
  //     transition: {
  //       stiffness: 100,
  //       damping: 30,
  //       restDelta: 0.001,
  //     },
  //   });
  // };

  // // scrollYProgress.onChange(() => {
  // //   updateScaleX();
  // // });

  let fetch = async () => {
    let stateOrigin = await stateTools({
      id,
      url,
      pointer: 0,
      target: target,
      state: initState,
      arr,
    });
    setIsState(stateOrigin);
  };

  useEffect(() => {
    if (initState && !isState && url != initState?.url) {
      fetch();

      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [id, url]);

  let dispatch = useToolsDispatch();
  let tools = useToolsState();

  return (
    <LayoutTools
      state={{
        id,
        url,
        pointer: 0,
        target: target,
        state: initState,
        arr,
      }}
    >
      {/* <MyHeader /> */}
      {children}
      {side && (
        <div className="fixed backdrop-blur bg-white/5 rounded-lg shadow translate-y-1/2 bottom-1/2 flex flex-col  w-[16vw]  max-w-[230px] justify-between  items-end right-[2vw]">
          {/* <div className="whiteglass rounded-2xl h-fit"></div> */}
          <div className="whiteglass-text p-5 flex flex-col w-full justify-end ">
            <MyMenus1 arr={subMenus} />
            <MyProgress style="progress bg1  ml-auto py-[1px] my-2 " />

            {/* <MyMenus2 arr={menus} /> */}
            {side}
          </div>
        </div>
      )}
    </LayoutTools>
  );
};
export let MyLayoutApp1 = ({
  id,
  url,
  menus,

  arr,
  subMenus,
  target,
  children,
  initState,
}) => {
  const controls = useAnimation();
  const { scrollYProgress } = useViewportScroll();

  let [isState, setIsState] = useState(null);

  const updateScaleX = () => {
    controls.start({
      scaleX: scrollYProgress.current,
      transition: {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      },
    });
  };

  scrollYProgress.onChange(() => {
    updateScaleX();
  });

  let fetch = async () => {
    let stateOrigin = await stateTools({
      id,
      url,
      pointer: 0,
      target: target,
      state: initState,
      arr,
    });
    setIsState(stateOrigin);
  };

  useEffect(() => {
    if (initState && !isState && url != initState?.url) {
      fetch();

      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [id, url]);

  let dispatch = useToolsDispatch();
  let tools = useToolsState();

  return (
    <LayoutTools
      state={{
        id,
        url,
        pointer: 0,
        target: target,
        state: initState,
        arr,
      }}
    >
      <div className="fixed bottom-[15vh] z-0 flex flex-col items-end right-[10vw]">
        {/* <div className="flex mb-10">
          <MyMenus1 arr={subMenus} />
          <div className="mx-10"></div>
          <MyMenus2 arr={menus} />
        </div> */}
        {children}
      </div>
      <Viewport
        key={v4()}
        id={`${tools?.state?.[target]?.length} ${target
          .toString()
          .toUpperCase()}`}
        index={0}
      >
        <div className="overflow-y-hidden">{arr?.[0]?.component}</div>
      </Viewport>
      <motion.div className="progress" animate={controls} />
    </LayoutTools>
  );
};
