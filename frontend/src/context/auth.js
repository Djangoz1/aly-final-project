"use client";

import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { stateCV, stateDetailsCV } from "utils/ui-tools/state-tools";

import { _apiGet } from "utils/ui-tools/web3-tools";

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
  metadatas: null,
  datas: null,
  error: null,
};

export const doAuthCV = async (dispatch, address) => {
  dispatch({ status: "pending" });
  console.log("owner1", await _apiGet("ownerOfToken", [1, ADDRESSES.cvsHub]));
  console.log("owner2", address);
  let cvID = parseInt(await _apiGet("cvOf", [address]));
  console.log(cvID);
  let state = await stateCV(cvID);
  let details = await stateDetailsCV(cvID);
  if (!state?.error) {
    dispatch({
      cv: cvID,
      details,
      metadatas: state?.metadatas,
      datas: state?.datas,
      status: "idle",
      error: null,
    });
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
