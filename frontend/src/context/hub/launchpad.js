"use client";

import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import {
  stateCV,
  stateFeature,
  stateLaunchpad,
  stateMission,
} from "utils/ui-tools/state-tools";

import { _apiGet } from "utils/ui-tools/web3-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const LaunchpadStateContext = createContext();
export const LaunchpadDispatchContext = createContext();

const initialState = {
  status: "idle",
  datas: null,
  metadatas: null,
  launchpadID: null,
  owner: null,
  error: null,
};

export const doStateLaunchpad = async (dispatch, launchpadID) => {
  dispatch({ status: "pending" });
  if (launchpadID > 0) {
    let launchpad = await stateLaunchpad(launchpadID);

    if (!launchpad?.error) {
      dispatch({
        launchpadID,
        datas: launchpad.datas,
        metadatas: launchpad.metadatas,
        owner: launchpad.owner,
        status: "idle",
        error: null,
      });
    } else {
      dispatch({
        status: "error",
        error: "Error context : Hub Launchpad - State",
      });
    }
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useLaunchpadState = () => {
  const context = useContext(LaunchpadStateContext);
  if (!context)
    throw new Error("useLaunchpadState must be used in MissionProvider");
  return context;
};
export const useLaunchpadDispatch = () => {
  const context = useContext(LaunchpadDispatchContext);
  if (!context)
    throw new Error("useLaunchpadDispatch must be used in MissionProvider");

  return context;
};

// Mise en place du Provider de l'App
export const LaunchpadProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LaunchpadStateContext.Provider value={state}>
      <LaunchpadDispatchContext.Provider value={dispatch}>
        {props.children}
      </LaunchpadDispatchContext.Provider>
    </LaunchpadStateContext.Provider>
  );
};
