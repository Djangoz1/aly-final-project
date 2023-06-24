"use client";

import { createContext, useContext, useReducer } from "react";
import { _getAccount } from "utils/ui-tools/auth-tools";

// Mise en place du reducer Mission
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const MissionStateContext = createContext();
export const MissionDispatchContext = createContext();

const initialState = {
  status: "idle",
  missions: [],
  mission: null,
  features: [],
  featuresId: null,
  error: null,
};

// Fonction appelé au moment du onClick

export const doMissionState = async (dispatch, cv, id) => {
  dispatch({ status: "pending" });

  try {
    let mission = await _getContractMission(cv, id);

    dispatch({ mission: mission, status: "idle", error: null });
  } catch (error) {
    dispatch({
      status: "error",
      error: "Error : Get Account",
    });
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
