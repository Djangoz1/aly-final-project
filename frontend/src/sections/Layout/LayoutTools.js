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

export const LayoutTools = ({ children, template, state }) => {
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
    <div
      className={`h-screen  flex w-screen overflow-y-scroll overflow-x-hidden ${
        template === 0 ? "flex-row-reverse" : "flex-col"
      }`}
    >
      <Child state={state} children={children} />
      {template !== 0 ? (
        <div className="fixed top-0 left-0 w-full">
          <Header />
        </div>
      ) : (
        <></>
      )}
    </div>
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
