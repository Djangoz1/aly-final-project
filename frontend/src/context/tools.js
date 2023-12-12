"use client";

import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ADDRESSES } from "constants/web3";
import { createContext, useContext, useReducer } from "react";
import { controllers } from "utils/controllers";
import { clientPocket } from "utils/ui-tools/pinata-tools";
import {
  stateArbitrator,
  stateCV,
  stateDetailsCV,
  stateDispute,
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

export const doStateToolsLaunchpad = async ({
  dispatch,
  state,
  launchpadID,
  target,
}) => {
  dispatch({ status: "pending profile " + target });
  if (launchpadID > 0) {
    let launchpad = await stateLaunchpad(launchpadID);
    console.log("launchpad", launchpad);
    let owner = { cvID: launchpad.owner.cvID, metadatas: launchpad.owner };
    launchpad = {
      datas: launchpad.datas,
      launchpadID: launchpad.launchpadID,
      metadatas: launchpad.metadatas,
    };

    console.log("taaaarget", target);
    console.log("launchpad tools", launchpad);
    let _controllers = {
      social: async () => {
        return await controllers.get.pub.list({ launchpad });
      },
    };
    console.log("controllers state", state);
    let _state = {
      owner,
      memory: [target],
      launchpad,
      gallery: null,
      social: null,
      escrows: null,
      features: null,
    };
    if (_controllers[target]) {
      _state[target] = await _controllers[target]();
    }

    dispatch({
      status: "success",
      state: _state,
      url: "/launchpad/" + launchpadID,
    });
    return _state;
  } else {
    throw new Error("Error state launchpad tools: Invalid launchpadID");
  }
};

export const doStateToolsRefresh = async ({ dispatch, func }) => {
  dispatch({ status: "pending  " });
  dispatch({ status: "success ", refresh: func });
};

export const doStateToolsMission = async ({
  dispatch,
  state,
  missionID,
  target,
}) => {
  dispatch({ status: "pending profile " + target });
  if (missionID > 0) {
    let mission = await stateMission(missionID);

    let owner = await controllers.get.profile.item({
      cvID: mission?.datas?.owner,
    });

    let _state = {
      owner,
      memory: [target],
      mission,
      gallery: state?.gallery || null,
      agendas: state?.agendas || null,
      escrows: state?.escrows || null,
      features: state?.features || null,
    };

    let _controllers = {
      features: async () => {
        let features = [];
        for (let index = 0; index < mission?.datas?.features?.length; index++) {
          const featureID = mission?.datas?.features[index];
          features.push(await stateFeature(featureID));
        }
        let result = await clientPocket.records.getList("features", 1, 50, {
          filter: `deployedID = 0 && missionID = "${mission?.metadatas?.id}"`,
        });

        let _features = result.items.map((el) => ({ metadatas: el }));
        features.push(..._features);

        return features;
      },

      pubs: async () => {
        return await controllers.get.pub.list({ mission: mission });
      },
      escrows: async () => {
        let features = _state?.features;
        if (!_state?.features) {
          features = await _controllers.features();
        }

        return features?.filter((el) => el?.datas?.dispute);
      },
      overview: async () => {
        _state.features = await _controllers.features();
        _state.pubs = await _controllers.pubs();
      },
      agendas: async () => {
        let events = [];
        let toDo = [];
        if (!_state?.features) {
          _state.features = await _controllers.features();
        }
        for (let index = 0; index < _state?.features?.length; index++) {
          const feature = _state?.features?.[index];

          let start = new Date(parseInt(feature?.datas?.startedAt) * 1000);
          let end = new Date(start);
          end.setDate(start.getDate() + feature.datas?.estimatedDays);
          let event = {
            start: start,
            end: end,
            index,
            days: feature?.datas?.estimatedDays,
            title: feature?.metadatas?.title,
          };
          events.push(event);

          if (feature?.details?.dispute?.datas?.timers?.createdAt) {
            let start = new Date(parseInt(feature?.datas?.startedAt) * 1000);
            let end = new Date(start);
            end.setDate(
              start.getDate() +
                feature.details?.dispute?.datas?.reclamationPeriod
            );
            let event = {
              start: start,
              end: end,
              index,
              days: feature?.details?.dispute?.datas?.reclamationPeriod,
              title: `Court - ${feature?.metadatas?.title}`,
              backgroundColor: "red",
              color: "white",
            };

            events.push(event);
          }
          let result = await clientPocket.records.getList("toDo", 1, 50, {
            filter: `featureID = "${feature?.metadatas?.id}"`,
          });
          if (result?.items?.length) {
            toDo.push({ list: result.items, index });
          }
        }

        return { events, toDo };
      },
      gallery: async () => {
        let records = await clientPocket.records.getList("gallery", 1, 50, {
          filter: `missionID = "${mission?.metadatas?.id}"`,
        });
        return records.items;
      },
    };

    if (_controllers[target]) {
      _state[target] = await _controllers[target]();
    }

    dispatch({
      status: "success",
      state: _state,
      url: "/mission/" + missionID,
    });
    return state;
  } else {
    throw new Error("Error state mission tools: Invalid missionID");
  }
};
export const doStateToolsProfile = async ({
  dispatch,
  state,
  cvID,
  target,
}) => {
  dispatch({ status: "pending profile " + target });
  if (cvID > 0) {
    // console.log("owner profile", cvID);

    let owner = await controllers.get.profile.item({ cvID });
    let _state = {
      profile: owner,
      memory: [],
      pubs: null,
      gallery: null,
      missions: null,
      details: null,
      features: null,
      jobs: null,
      arbitrators: null,
    };
    let _controllers = {
      pubs: async () =>
        await controllers.get.pub.list({ userID: owner?.metadatas?.id }),

      missions: async () => {
        let missions = [];
        for (let index = 0; index < owner?.datas?.missions?.length; index++) {
          let missionID = owner?.datas?.missions?.[index];
          let mission = await stateMission(missionID);

          missions?.push({ ...mission, missionID: missionID });
        }

        return missions;
      },
      launchpads: async () => {
        let launchpads = [];
        for (let index = 0; index < owner?.datas?.launchpads?.length; index++) {
          const launchpadID = owner?.datas?.launchpads[index];
          let launchpad = await stateLaunchpad(launchpadID);
          launchpads.push({ ...launchpad, launchpadID });
        }
        return launchpads;
      },
      messages: async () => {
        let messages = await controllers.get.message.list({
          userID: owner?.metadatas?.id,
        });

        let followers = await controllers.get.follower.list({
          userID: owner?.metadatas?.id,
          expand: "followID",
        });
        return {
          lists: messages,
          followers,
        };
      },
      features: async () => {
        let _features = await _apiGet("indexerOfToken", [
          cvID,
          ADDRESSES["featuresHub"],
        ]);
        let features = [];

        for (let index = 0; index < _features.length; index++) {
          features.push(await stateFeature(_features[index]));
        }
        return features;
      },
      jobs: async () => {
        let jobs = [];
        for (let index = 0; index < owner?.datas?.proposals?.length; index++) {
          const featureID = owner?.datas?.proposals?.[index];
          jobs.push(await stateFeature(featureID));
        }
        return jobs;
      },
      invitations: async () => {
        let invitations = [];
        for (
          let index = 0;
          index < owner?.datas?.invitations?.length;
          index++
        ) {
          const featureID = owner?.datas?.invitations?.[index];
          invitations.push(await stateFeature(featureID));
        }
        return invitations;
      },
      arbitrators: async () => {
        let arbitrators = [];
        for (
          let index = 0;
          index < owner?.datas?.arbitrators?.length;
          index++
        ) {
          let arbitrator = owner?.datas?.arbitrators?.[index];
          arbitrators.push(await stateArbitrator(arbitrator));
        }
        return arbitrators;
      },
      overview: async () => {
        _state.features = await _controllers.features();
        _state.profile = {
          ..._state.profile,
          details: await stateDetailsCV({
            cvID,
            ..._state.profile.datas,
            id: _state.profile.metadatas.id,
          }),
        };
      },
      notifications: async () => {
        let notifications = [];
        for (let index = 0; index < owner?.datas?.features?.length; index++) {
          let feature = await stateFeature(owner?.datas?.features?.[index]);

          if (feature.details?.demands?.length > 0) {
            notifications.push(feature);
          }
        }
        let invitations = [];
        for (
          let index = 0;
          index < owner?.datas?.invitations?.length;
          index++
        ) {
          const featureID = owner.datas?.invitations[index];

          invitations.push(
            await controllers.get.feature.item({
              featureID,
              withOwner: true,
              expand: "missionID",
            })
          );
        }
        return { demands: notifications, invitations };
      },
    };

    _state?.memory.push(target);

    if (_controllers[target]) {
      let result = await _controllers[target]();
      if (result) _state[target] = result;
    }

    dispatch({
      status: "success",
      state: _state,
      url: "/profile/" + cvID,
    });
    return _state;
  } else {
    throw new Error("Error state profile tools: Invalid cvID");
  }
};

export const doStateLaunchpadTools = async (dispatch, launchpadID) => {
  dispatch({ status: "pending launchpad" });
  try {
    let launchpad = await stateLaunchpad(launchpadID);

    let state = {
      launchpad: {
        datas: launchpad.datas,
        launchpadID: launchpad.launchpadID,
        metadatas: launchpad.metadatas,
      },
      owner: launchpad.owner,
    };
    dispatch({ status: "success", state: state });
    return state;
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

    let state = {
      datas: {
        balance: await _apiGet("balanceOfCourt", [courtID]),
        arbitrators: arbitrators,
      },
    };

    dispatch({
      status: "success",
      state: state,
    });
    return state;
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

  // let state = await doStateProfileTools({ dispatch, cvID });
  // setIsState(state);
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
