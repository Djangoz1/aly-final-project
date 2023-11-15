"use client";

import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateLaunchpad,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

// Mise en place du reducer auth
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// Création des context pour state & dispatch
export const ToolsStateContext = createContext();
export const ToolsDispatchContext = createContext();

const initialState = {
  status: "idle",
  state: null,
  id: null,
  target: null,
  indexer: null,
  index: 0,
  pointer: null,
  url: null,
};

export const doPointerTools = async (dispatch, pointer) => {
  dispatch({ status: "pointer" });
  if (pointer >= 0) dispatch({ status: "idle", pointer: pointer });
};

export const doIndexTools = async (dispatch, index) => {
  dispatch({ status: "index" });
  if (index >= 0) dispatch({ status: "idle", index });
};

export const doReloadTools = async (dispatch) => {
  dispatch({ status: "reload" });
};

export const doStateIndexerTools = async (dispatch, indexer) => {
  dispatch({ status: "pending indexer" });
  dispatch({ indexer, status: "success" });
};

export const doStateProfileTools = async ({ dispatch, cvID }) => {
  dispatch({ status: "pending profile" });
  if (cvID > 0) {
    console.log("profile tools context", cvID);
    let owner = await stateCV(cvID);
    owner.details = {
      wadge: 0,
      // ! To fix
      missions: [],
      features: [],
      arbitrators: [],
      badges: [],
      disputes: [],
    };

    for (let index = 0; index < owner?.datas?.proposals?.length; index++) {
      const featureID = owner?.datas?.proposals?.[index];
      let feature = {
        datas: await _apiGet("datasOfFeature", [featureID]),
        details: await _apiGet("datasOfWork", [featureID]),
      };

      !owner?.details?.badges.includes(feature?.datas?.specification) &&
        owner?.details?.badges.push(feature?.datas?.specification);

      // * Si status === validated chercher l'arbitratorID du worker
      if (feature?.datas?.status === 2) {
        let arbitration = await _apiGet("arbitrationOfCV", [
          cvID,
          feature?.datas?.specification,
        ]);
        if (!owner?.details?.arbitrators.includes(arbitration)) {
          owner?.details?.arbitrators.push(arbitration);
        }
      }
      if (feature?.details?.workerContest || feature?.details?.ownerContest) {
        feature.datas.dispute = await _apiGet("disputeOfFeature", [featureID]);

        owner.details.disputes.push(feature.datas.dispute);
      }
      owner?.details?.features?.push(feature);
    }

    for (let index = 0; index < owner?.datas?.missions?.length; index++) {
      let missionID = owner?.datas?.missions?.[index];
      let mission = await stateMission(missionID);

      owner?.details?.missions?.push(mission);
    }
    let invites = await _apiGet("invitesOfCV", [cvID]);
    owner.details.invites = [];
    for (let index = 0; index < invites?.length; index++) {
      let feature = await stateFeature(invites[index]);
      owner.details.invites.push({
        featureID: feature?.featureID,
        title: feature?.metadatas?.title,
        domain: feature?.metadatas?.attributes?.[0]?.domain,
        specification: feature?.datas?.specification,
        status: feature?.datas?.status,
        specification: feature?.datas?.specification,
        wadge: feature?.datas?.wadge,
      });
    }
    let _pubs = await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]);
    owner.details.launchpads = { arr: [], totalRaised: 0 };

    for (let index = 0; index < owner?.datas?.launchpads?.length; index++) {
      let launchpad = await stateLaunchpad(owner?.datas?.launchpads?.[index]);
      owner.details.launchpads.arr.push({
        title: launchpad?.metadatas?.title,
        domain: launchpad?.metadatas?.attributes?.[0]?.domain,
        launchpadID: launchpad?.launchpadID,
      });
      owner.details.launchpads.totalRaised += parseInt(
        launchpad.datas.amountRaised
      );
    }

    let _state = {
      profile: owner,
      pubs: _pubs,
    };

    dispatch({
      status: "success",
      state: _state,
    });
    return _state;
  } else {
    throw new Error("Error state profile tools: Invalid cvID");
  }
};

export const doStateMissionTools = async (dispatch, missionID) => {
  dispatch({ status: "pending mission" });
  try {
    let mission = await stateMission(missionID);
    let owner = await stateCV(mission?.datas?.owner);
    owner.details = await stateDetailsCV(mission?.datas?.cvOwner);
    let features = [];

    for (let index = 0; index < mission?.datas?.features?.length; index++) {
      const featureID = mission?.datas?.features[index];
      let feature = await stateFeature(featureID);
      if (feature?.datas?.dispute) {
        mission.datas.disputes++;
      }
      features.push(feature);
    }

    let _state = {
      mission,
      owner,
      features,
    };
    dispatch({ status: "success", state: _state });
    return _state;
  } catch (error) {
    dispatch({ status: "error mission", error: { error } });
  }
};

export const doStateLaunchpadTools = async (dispatch, launchpadID) => {
  dispatch({ status: "pending launchpad" });
  try {
    let launchpad = await stateLaunchpad(launchpadID);

    let _state = {
      launchpad: {
        datas: launchpad.datas,
        launchpadID: launchpad.launchpadID,
        metadatas: launchpad.metadatas,
      },
      owner: launchpad.owner,
    };
    dispatch({ status: "success", state: _state });
    return _state;
  } catch (error) {
    dispatch({ status: "error launchpad", error: { error } });
  }
};

export const doStateCourtTools = async (dispatch, courtID) => {
  dispatch({ status: "pending" });

  try {
    let arr = await _apiGet("indexerOfCourt", [courtID]);

    let arbitrators = [];

    for (let index = 0; index < arr.length; index++) {
      const arbitratorID = arr[index];
      arbitrators.push(await _apiGet("datasOfArbitrator", [arbitratorID]));
    }

    let _state = {
      datas: {
        balance: await _apiGet("balanceOfCourt", [courtID]),
        arbitrators: arbitrators,
      },
    };

    dispatch({
      status: "success",
      state: _state,
    });
    return _state;
  } catch (error) {
    dispatch({
      status: "error",
      error: { error },
    });
  }
};

export const doStatePubsTools = async (dispatch, state, walletClient) => {
  dispatch({ status: "pending" });
  try {
    let arr = [];
    let length = await _apiGet("tokensLengthOf", [ADDRESSES["pubsHub"]]);

    for (let index = 1; index <= length; index++) {
      let pub = await statePub(index, walletClient);
      if (pub?.payable) {
        arr.push(pub);
      }
    }

    dispatch({
      status: "success",
      state: {
        ...state,
        pubs: { arr },
      },
    });
  } catch (error) {
    dispatch({ status: "error", error: { error } });
  }

  // let _state = await doStateProfileTools({ dispatch, cvID });
  // setIsState(_state);
};

export const doStateTools = async (dispatch, state, pointer) => {
  dispatch({ status: "pending" });
  if (state?.state) {
    dispatch({
      status: "init success",
      state: state.state,
      arr: state?.arr,
      target: state?.target,
      id: state?.id,
      pointer: state?.pointer,
      url: state?.url,
    });
  } else if (!state?.error) {
    dispatch({
      state: state,
      pointer: pointer && pointer,
      status: "idle",
      error: null,
    });
  } else {
    dispatch({ status: "error", error: "Error : Init state" });
  }
};

// Mise à disposition des fonctions à réutiliser dans les components
export const useToolsState = () => {
  const context = useContext(ToolsStateContext);
  if (!context) throw new Error("useToolsState must be used in ToolsProvider");
  return context;
};
export const useToolsDispatch = () => {
  const context = useContext(ToolsDispatchContext);
  if (!context)
    throw new Error("useToolsDispatch must be used in ToolsProvider");

  return context;
};

// Mise en place du Provider de l'App
export const ToolsProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ToolsStateContext.Provider value={state}>
      <ToolsDispatchContext.Provider value={dispatch}>
        {props.children}
      </ToolsDispatchContext.Provider>
    </ToolsStateContext.Provider>
  );
};
