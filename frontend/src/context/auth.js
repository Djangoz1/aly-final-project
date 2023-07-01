"use client";

import { createContext, useContext, useReducer } from "react";

import { _getterCV, _getterFactoryCV } from "utils/ui-tools/web3-tools";

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
  let missionsLength = parseInt(await _getterCV(address, "getMissionsLength"));
  if (missionsLength > 0) {
    let missions = [];
    for (let index = 0; index < missionsLength; index++) {
      const mission = await _getterCV(address, "getMission", [index]);
      missions.push(mission);
    }
    dispatch({ missions, status: "idle", error: null });
  } else {
    dispatch({ status: "error", error: "Error : Get CV" });
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

export const doAuthCV = async (dispatch, address) => {
  dispatch({ status: "pending" });

  let cv = await _getterFactoryCV("getCV", [address]);

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
