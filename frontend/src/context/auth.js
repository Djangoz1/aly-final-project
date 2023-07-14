"use client";

import { createContext, useContext, useReducer } from "react";

import {
  _getterCV,
  _getterFactoryCV,
  _getterAccessControl,
  _getterMissionsHub,
} from "utils/ui-tools/web3-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const initialState = {
  status: "idle",
  missions: [],
  missionId: null,
  cv: null,
  error: null,
};

// Fonction appelé au moment du onClick

// *::::::::::::::: MANAGE STATE  :::::::::::::::*
export const doAuthMission = async (dispatch, address) => {
  dispatch({ status: "pending" });
  if (!address) return;
  try {
    let missions = await _getterMissionsHub("getIndexer", [address]);
    dispatch({ missions, status: "idle", error: null });
  } catch (error) {
    dispatch({ status: "error", error: { mission: error } });
  }
};

export const doAuthMissionId = async (dispatch, missions, missionId) => {
  dispatch({ status: "pending" });
  if (missions.length > missionId) {
    dispatch({ missionId: missionId, status: "idle", error: null });
  } else {
    dispatch({ status: "error", error: "Error : Get CV" });
  }
};

// *:::::::::::: -- ::::::::::::* //
// *:::::::::::: CV ::::::::::::* //
// *:::::::::::: -- ::::::::::::* //

export const doAuthCV = async (dispatch, address) => {
  dispatch({ status: "pending" });
  let cv = await _getterAccessControl("getCVByAddress", [address]);
  console.log("cv", cv);
  if (!cv?.error) {
    dispatch({ cv, status: "idle", error: null });
  } else {
    dispatch({ status: "error", error: "Error : Get CV" });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error("useAuthState must be used in AuthProvider");
  return context;
};
export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");

  return context;
};

// Mise en place du Provider de l'App
export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {props.children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
