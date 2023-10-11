"use client";

import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { stateCV } from "utils/ui-tools/state-tools";

import { _apiGet } from "utils/ui-tools/web3-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const ToolsStateContext = createContext();
export const ToolsDispatchContext = createContext();

const initialState = {
  status: "idle",
  state: null,
  id: null,
  target: null,
  index: 0,
  pointer: null,
  url: null,
};

export const doPointerTools = async (dispatch, pointer) => {
  dispatch({ status: "pointer" });
  if (pointer >= 0) dispatch({ status: "idle", pointer: pointer });
};

export const doIndexTools = async (dispatch, index) => {
  dispatch({ status: "index" });
  if (index >= 0) dispatch({ status: "idle", index });
};

export const doReloadTools = async (dispatch) => {
  dispatch({ status: "reload" });
};

export const doStateTools = async (dispatch, state, pointer) => {
  dispatch({ status: "pending" });
  if (state?.state) {
    dispatch({
      status: "init success",
      state: state.state,
      arr: state?.arr,
      target: state?.target,
      id: state?.id,
      pointer: state?.pointer,
      url: state?.url,
    });
  } else if (!state?.error) {
    dispatch({
      state: state,
      pointer: pointer && pointer,
      status: "idle",
      error: null,
    });
  } else {
    dispatch({ status: "error", error: "Error : Init state" });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useToolsState = () => {
  const context = useContext(ToolsStateContext);
  if (!context) throw new Error("useToolsState must be used in ToolsProvider");
  return context;
};
export const useToolsDispatch = () => {
  const context = useContext(ToolsDispatchContext);
  if (!context)
    throw new Error("useToolsDispatch must be used in ToolsProvider");

  return context;
};

// Mise en place du Provider de l'App
export const ToolsProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ToolsStateContext.Provider value={state}>
      <ToolsDispatchContext.Provider value={dispatch}>
        {props.children}
      </ToolsDispatchContext.Provider>
    </ToolsStateContext.Provider>
  );
};
