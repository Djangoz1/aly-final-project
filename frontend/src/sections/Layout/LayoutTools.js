import "styles/app.css";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import React, { useEffect } from "react";
import { Header } from "./Header";
import { useAccount } from "wagmi";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

export const LayoutTools = ({ children, menus, template, state }) => {
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
      className={`  flex w-screen  ${
        template === 0 ? "flex-row-reverse" : "flex-col"
      }`}
    >
      <Child state={state} children={children} />
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
