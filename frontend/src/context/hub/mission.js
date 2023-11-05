"use client";

import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import {
  stateCV,
  stateFeature,
  stateMission,
} from "utils/ui-tools/state-tools";

import { _apiGet } from "utils/ui-tools/web3-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const MissionStateContext = createContext();
export const MissionDispatchContext = createContext();

const initialState = {
  status: "idle",
  features: [],
  mission: null,
  missionID: null,
  owner: null,
  error: null,
};

export const doStateMission = async (dispatch, missionID) => {
  dispatch({ status: "pending" });

  let mission = await stateMission(missionID);
  let features = [];
  for (let index = 0; index < mission?.datas?.features.length; index++) {
    const featureID = mission?.datas?.features[index];
    let feature = await stateFeature(featureID);
    features.push(feature);
  }

  let uri = await _apiGet("tokenURIOf", [
    mission?.datas?.owner,
    ADDRESSES["cvsHub"],
  ]);
  let owner = await fetchJSONByCID({ id: uri, table: "accounts" });

  if (!mission?.error) {
    dispatch({
      missionID,
      mission,
      features,
      owner,
      status: "idle",
      error: null,
    });
  } else {
    dispatch({ status: "error", error: "Error context : Hub Mission - State" });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useMissionState = () => {
  const context = useContext(MissionStateContext);
  if (!context)
    throw new Error("useMissionState must be used in MissionProvider");
  return context;
};
export const useMissionDispatch = () => {
  const context = useContext(MissionDispatchContext);
  if (!context)
    throw new Error("useMissionDispatch must be used in MissionProvider");

  return context;
};

// Mise en place du Provider de l'App
export const MissionProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MissionStateContext.Provider value={state}>
      <MissionDispatchContext.Provider value={dispatch}>
        {props.children}
      </MissionDispatchContext.Provider>
    </MissionStateContext.Provider>
  );
};
