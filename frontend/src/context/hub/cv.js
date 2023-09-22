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
export const CVStateContext = createContext();
export const CVDispatchContext = createContext();

const initialState = {
  status: "idle",
  cvID: null,
  datas: null,
  metadatas: null,
  error: null,
};

export const doStateCV = async (dispatch, cvID) => {
  dispatch({ status: "pending" });

  let req = await stateCV(cvID);

  if (!req?.error) {
    dispatch({
      cvID: cvID,
      datas: req?.datas,
      metadatas: req?.metadatas,

      status: "idle",
      error: null,
    });
  } else {
    dispatch({ status: "error", error: "Error context : Hub Mission - State" });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useCVState = () => {
  const context = useContext(CVStateContext);
  if (!context) throw new Error("useCVState must be used in CVProvider");
  return context;
};
export const useCVDispatch = () => {
  const context = useContext(CVDispatchContext);
  if (!context) throw new Error("useCVDispatch must be used in CVProvider");

  return context;
};

// Mise en place du Provider de l'App
export const CVProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CVStateContext.Provider value={state}>
      <CVDispatchContext.Provider value={dispatch}>
        {props.children}
      </CVDispatchContext.Provider>
    </CVStateContext.Provider>
  );
};
