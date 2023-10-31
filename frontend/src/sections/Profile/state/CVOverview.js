import { MyTable } from "components/myComponents/table/MyTable";
import { MENUS_EDIT, MENUS_ID } from "constants/menus";
import {
  doIndexTools,
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useInView } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  stateDispute,
  stateFeature,
  stateLaunchpad,
  stateMission,
} from "utils/ui-tools/state-tools";
import {
  HEAD_table_features,
  HEAD_table_invites,
  _table_features,
  _table_invites,
} from "utils/states/tables/feature";

import {
  HEAD_table_missions,
  _table_missions,
} from "utils/states/tables/mission";
import { v4 } from "uuid";
import {
  HEAD_table_launchpads,
  _table_launchpad,
} from "utils/states/tables/launchpad";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doAuthCV, useAuthState } from "context/auth";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";
import { MyCard } from "components/myComponents/card/MyCard";
import {
  HEAD_table_arbitrators,
  _table_arbitrators,
} from "utils/states/tables/escrow";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";

export const CVOverview = () => {
  let { state, index, status } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);
  let [isLists, setIsLists] = useState(null);

  let { cv } = useAuthState();
  let ref = useRef(null);
  let isInView = useInView(ref);
  let dispatch = useToolsDispatch();
  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);

    doStateProfileTools({ dispatch, cvID: state?.profile?.cvID });
  };
  let [isArbitratorsState, setIsArbitratorsState] = useState(null);

  let fetchDisputes = async () => {
    let disputes = [];
    for (
      let index = 0;
      index < state?.profile?.details?.arbitrators?.length;
      index++
    ) {
      let arbitrator = state?.profile?.details?.arbitrators?.[index];
      for (let index = 0; index < arbitrator?.disputes.length; index++) {
        let dispute = await stateDispute(
          arbitrator?.disputes?.[index].disputeID
        );
        dispute.datas.allowance = arbitrator?.disputes?.[index]?.allowance;
        disputes.push(dispute);
      }
    }
    setIsArbitratorsState(disputes);
  };

  useEffect(() => {
    if (
      !isArbitratorsState &&
      ((!state?.front?.target && state?.indexOverview === 4) ||
        state?.front?.target === "dispute")
    ) {
      fetchDisputes();
    }
  }, [state?.front?.target, state?.indexOverview]);

  const components = {
    launchpad: <div>Launchpad</div>,
    feature: state?.front?.target === "feature" && (
      <MissionFeatures featureID={state?.front?.props?.[0]} />
    ),
    mission: state?.front?.target === "mission" && (
      <MissionProfile missionID={state?.front?.props?.[0]} />
    ),
    dispute: state?.front?.target === "dispute" && (
      <FeatureDispute disputeID={state?.front?.props?.[0]} />
    ),
  };

  let infos = [
    {
      btn: "Missions",
      table: _table_missions(state?.profile?.details),
      head: HEAD_table_missions,
      setState: stateMission,
      url: "#section2",
      // btns: MENUS_EDIT.mission,
    },
    {
      btn: "Jobs",
      table: _table_features(state?.profile?.details?.jobs),
      head: HEAD_table_features,
      setState: stateFeature,
      arr: state?.profile?.datas?.proposals,
      // btns: MENUS_EDIT.feature,
    },
    {
      btn: "Launchpads",
      table: _table_launchpad(state?.profile?.details?.launchpads),
      head: HEAD_table_launchpads,
      arr: state?.profile?.datas?.launchpads,
      setState: stateLaunchpad,
      // btns: MENUS_EDIT.invite,
    },
    {
      btn: "Invites",
      table: _table_invites(state?.profile?.details?.invites),
      head: HEAD_table_invites,
      arr: state?.profile?.details?.invites,
      setState: stateFeature,
      editBtns: [
        {
          title: "Accept job",
          setter: (featureID) => {
            fetchDisputes();
            handlePost("acceptJob", [featureID]);
          },
        },
        {
          title: "Decline job",
          setter: (featureID) => {
            fetchDisputes();
            handlePost("declineJob", [featureID]);
          },
          style: "btn-xs btn-error btn-outline ml-2",
        },
      ],
    },
    {
      btn: "Arbitrators",
      table: _table_arbitrators(isArbitratorsState),
      head: HEAD_table_arbitrators,
      arr: isArbitratorsState,
      setState: stateDispute,
      editBtns: [
        {
          title: "Accept",
          setter: (disputeID) => handlePost("acceptArbitration", [disputeID]),
          style: " c2",
        },
        {
          title: "Refuse",
          setter: (disputeID) => handlePost("refuseArbitration", [disputeID]),
          style: "text-error ml-2",
        },
      ],
    },
  ];

  let fetch = async () => {
    let _state = state;
    let _infos = infos;
    let element = _infos?.[state?.indexOverview];

    if (!element?.arr) {
      return;
    }
    let target = element.btn.toLowerCase();
    if (!_state?.profile?.details?.[target]?.length >= 0) {
      _state.profile.details[`${target}`] = [];
    }

    for (let index = 0; index < element?.arr?.length; index++) {
      const id = element?.arr?.[index];
      let el = await element?.setState(id);
      _state.profile.details[target].push(el);
    }

    doStateTools(dispatch, _state);
  };

  useMemo(() => {
    let target = infos?.[state?.indexOverview]?.btn.toLowerCase();
    if (!isLists?.[target] && state?.profile?.details && isInView) {
      console.log("Fetch CV Overview ...", state);

      fetch();
    }
  }, [state?.indexOverview]);

  useEffect(() => {
    let target = infos?.[state?.indexOverview]?.btn.toLowerCase();

    if (
      (!isLists?.[target] ||
        isLists?.[target]?.table?.length !== isLists?.[target]?.arr?.length) &&
      state?.profile?.details?.[target]?.length >= 0
    ) {
      setIsLists({
        ...isLists,
        [target]: infos?.[state?.indexOverview],
      });
    }
  }, [status, isInView]);

  return (
    <>
      {components?.[state?.front?.target] || (
        <>
          <MyMenusTabs
            style={"w-full rounded-none bgprim"}
            color={1}
            setter={(i) =>
              doStateTools(dispatch, { ...state, indexOverview: i })
            }
            value={state?.indexOverview}
            arr={infos}
            target={"btn"}
          >
            Gallery
          </MyMenusTabs>
          {state?.indexOverview >= 0 &&
          isLists?.[`${infos?.[state?.indexOverview].btn.toLowerCase()}`]
            ?.table ? (
            <MyCard styles={"h-full  rounded-t-none w-full "}>
              <div
                ref={ref}
                className="w-full h-full rounded-lg shadow backdrop-blur "
              >
                <MyTable
                  list={
                    isLists?.[
                      `${infos?.[state?.indexOverview].btn.toLowerCase()}`
                    ]?.table
                  }
                  head={
                    isLists?.[
                      `${infos?.[state?.indexOverview].btn.toLowerCase()}`
                    ]?.head
                  }
                  btns={infos?.[state?.indexOverview]?.btns}
                  editBtns={infos?.[state?.indexOverview]?.editBtns}
                />
              </div>
            </MyCard>
          ) : (
            <MyModal
              styles={{
                btn: "btn-ghost ml-1 w-fit h-fit overflow-scroll hide-scrollbar",
              }}
              btn={
                <ImagePin
                  style={"h-[70vh] w-[35vw]"}
                  CID={state?.profile?.metadatas?.attributes?.[0]?.cvImg}
                />
              }
              modal={
                <ImagePin
                  style={"h-[90vh] w-[80vw] "}
                  CID={state?.profile?.metadatas?.attributes?.[0]?.cvImg}
                />
              }
            />
          )}
        </>
      )}
    </>
  );
};
