"use client";

import { createContext, useContext, useReducer } from "react";
import { _getAccount } from "utils/auth-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const initialState = {
  status: "idle",
  address: null,
  cvContract: null,
  error: null,
};

// Fonction appelé au moment du onClick

export const doAuthSigner = async (dispatch) => {
  dispatch({ status: "pending" });

  try {
    let address = await _getAccount();

    dispatch({ address: address, status: "idle", error: null });
  } catch (error) {
    dispatch({
      address: address,
      status: "error",
      error: "Error : Get Account",
    });
  }
};

export const doAuthCV = async (dispatch) => {
  dispatch({ status: "pending" });
  try {
    console.log("test", cv);
    let cv = await _getContractFactoryCV();
    dispatch({ cvContract: cv, status: "idle", error: null });
  } catch (error) {
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
