import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useViewportScroll } from "framer-motion";

import { v4 } from "uuid";
import { MyMenus1 } from "components/myComponents/menu/MyMenus";
import {
  doStateToolsRefresh,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { LayoutTools } from "sections/Layout/LayoutTools";

import { stateTools } from "utils/ui-tools/state-tools";
import { Viewport } from "./MyViewport";

import { Logo, LogoIc } from "components/Logo";

export let MyLayoutApp = ({
  id,
  url,
  background,

  notLoad,

  template,
  arr,
  menus,
  target,
  children,
  initState,
}) => {
  let [isState, setIsState] = useState(null);
  let dispatch = useToolsDispatch();
  let tools = useToolsState();
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
    if (!notLoad && initState && !isState && url != initState?.url) {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [id, url]);

  return (
    <LayoutTools
      template={template}
      menus={menus}
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
      {background !== false ? (
        <div className="fixed -z-1 w-screen top-0   left-0 h-screen magicpattern"></div>
      ) : (
        <></>
      )}
      {children}
    </LayoutTools>
  );
};
