"use client";

import { MyHeader } from "components/myComponents/MyHeader";
import "styles/app.css";
import {
  ToolsProvider,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useEffect } from "react";
import { Header } from "./Header";
import { useAccount } from "wagmi";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { zeroAddress } from "viem";
import { doStateCV } from "context/hub/cv";

export const LayoutTools = ({ children, state }) => {
  let { address } = useAccount();
  let { cv } = useAuthState();

  let dispatch = useAuthDispatch();

  useEffect(() => {
    if (address) {
      console.log("address", address);
      doAuthCV(dispatch, address);
    }
  }, [address]);

  return (
    <>
      <Child state={state} children={children} />
      <Header />
    </>
  );
};

let Child = ({ children, state }) => {
  let dispatch = useToolsDispatch();
  let tools = useToolsState();

  useEffect(() => {
    if (
      state?.state &&
      tools.status !== "init success" &&
      tools.url !== state?.url
    ) {
      console.log("Layout becarefull je reload", state);
      doStateTools(dispatch, state);
    }
  }, [state]);
  return <>{children}</>;
};
