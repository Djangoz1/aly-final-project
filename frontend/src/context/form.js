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
export const FormStateContext = createContext();
export const FormDispatchContext = createContext();

const initialState = {
  status: "wait init",
  form: null,
  modal: false,
  placeholders: null,
  pointer: 0,
  disabled: true,
  checked: [],
  superChecked: [],
};

export const doStateFormDisabled = (dispatch, disabled) => {
  dispatch({ status: "pending" });
  dispatch({
    status: "success",
    disabled,
  });
};

export const doStateFormModal = (dispatch, bool) => {
  dispatch({ status: "pending" });
  if (!bool) {
    dispatch({ ...initialState });
  } else {
    dispatch({ status: "success", modal: bool });
  }
};

export const doStateFormPointer = (dispatch, pointer) => {
  dispatch({ status: "pending" });
  dispatch({
    status: "success",
    pointer,
  });
};

export const doStateFormRefresh = (dispatch) => {
  dispatch({ status: "pending" });
  dispatch({
    status: "wait init",
    form: null,
    modal: false,
    placeholders: null,
    pointer: 0,
    disabled: true,
    checked: [],
    superChecked: [],
  });
};

export const doStateFormChecked = ({
  dispatch,
  pointer,
  form,
  checked,
  superChecked,
}) => {
  let disabled = false;
  let _checked = checked;

  function isFunction(param) {
    return typeof param === "function";
  }

  if (
    superChecked !== null &&
    superChecked !== undefined &&
    isFunction(superChecked)
  ) {
    if (superChecked?.(form)?.[pointer]?.length > 0) {
      _checked = superChecked?.(form, pointer);
    }
  }

  for (let index = 0; index < _checked?.[pointer]?.length; index++) {
    let value = _checked?.[pointer]?.[index];
    if (superChecked && value?.bool !== undefined) {
      disabled = value.bool === false ? true : false;

      if (value?.bool === false) {
        break;
      }
    } else {
      let value = form[_checked[pointer][index]];
      if (value === null) {
        disabled = true;
      }
    }
  }

  dispatch({ status: "success", disabled });
};

export const doInitStateForm = async (dispatch, form) => {
  dispatch({ status: "pending" });

  if (form?.form) {
    dispatch({
      status: "success",
      form: { ...form?.form, aiAssisted: true, ratingAi: 3 },
      placeholders: {
        ...form?.placeholders,
        chatAI: "Write something to Aly ...",
        feedbacks: "What do you think about Aly",
      },
      checked: form?.checked,
      superChecked: form?.superChecked,
      pointer: 0,
    });
  } else {
    dispatch({
      status: "success",
      form: form,
    });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useFormState = () => {
  const context = useContext(FormStateContext);
  if (!context) throw new Error("useFormState must be used in FormProvider");
  return context;
};
export const useFormDispatch = () => {
  const context = useContext(FormDispatchContext);
  if (!context) throw new Error("useFormDispatch must be used in FormProvider");

  return context;
};

// Mise en place du Provider de l'App
export const FormProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {props.children}
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  );
};
