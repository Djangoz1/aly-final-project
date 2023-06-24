"use client";

import { createContext, useContext, useReducer } from "react";
import { _getAccount } from "utils/ui-tools/auth-tools";
import {
  _getAllContractsMissionByCv,
  _getContractMissionById,
  _getFeatures,
} from "utils/ui-tools/mission-tools";

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

export const doMissionsState = async (dispatch, cv) => {
  dispatch({ status: "pending" });

  try {
    let missions = await _getAllContractsMissionByCv(cv);
    dispatch({ missions: missions, status: "idle", error: null });
  } catch (error) {
    dispatch({
      status: "error",
      error: error,
    });
  }
};

export const doMissionStateById = async (dispatch, missions, id) => {
  dispatch({ status: "pending" });

  try {
    if (id !== null) {
      let mission = await _getContractMissionById(missions, id);
      dispatch({ mission: mission, status: "idle", error: null });
    } else {
      dispatch({ mission: null, status: "idle", error: null });
    }
  } catch (error) {
    dispatch({ status: "error", error });
  }
};

export const doMissionState = async (dispatch, cv, id) => {
  dispatch({ status: "pending" });

  try {
    let mission = await _getContractMission(cv, id);

    dispatch({ mission: mission, status: "idle", error: null });
  } catch (error) {
    dispatch({
      status: "error",
      error: error,
    });
  }
};

export const doFeaturesState = async (dispatch, mission) => {
  dispatch({ status: "pending" });

  try {
    let features = await _getFeatures(mission);

    dispatch({ features: features, status: "idle", error: null });
  } catch (error) {
    dispatch({
      status: "error",
      error: error,
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
