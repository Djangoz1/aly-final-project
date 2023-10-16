import { MyTable } from "components/myComponents/table/MyTable";
import { MENUS_EDIT, MENUS_ID } from "constants/menus";
import {
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { MyBtnPost } from "components/myComponents/btn/MyBtnPost";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doAuthCV } from "context/auth";

export const CVOverview = () => {
  let { state, index, status } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);
  let [isLists, setIsLists] = useState(null);
  let ref = useRef(null);
  let isInView = useInView(ref);
  let dispatch = useToolsDispatch();
  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);

    doStateProfileTools({ dispatch, cvID: state?.owner?.cvID });
  };
  let infos = [
    {
      btn: "Missions",
      table: _table_missions(state?.owner?.details),
      head: HEAD_table_missions,
      setState: stateMission,

      // btns: MENUS_EDIT.mission,
    },
    {
      btn: "Jobs",
      table: _table_features(state?.owner?.details?.jobs),
      head: HEAD_table_features,
      setState: stateFeature,
      arr: state?.owner?.datas?.proposals,
      // btns: MENUS_EDIT.feature,
    },
    {
      btn: "Launchpads",
      table: _table_launchpad(state?.owner?.details?.launchpads),
      head: HEAD_table_launchpads,
      arr: state?.owner?.datas?.launchpads,
      setState: stateLaunchpad,
      // btns: MENUS_EDIT.invite,
    },
    {
      btn: "Invites",
      table: _table_invites(state?.owner?.details?.invites),
      head: HEAD_table_invites,
      arr: state?.owner?.details?.invites,
      setState: stateFeature,
      editBtns: [
        {
          title: "Accept job",
          setter: (featureID) => handlePost("acceptJob", [featureID]),
        },
        {
          title: "Decline job",
          setter: (featureID) => handlePost("declineJob", [featureID]),
          style: "btn-xs btn-error btn-outline ml-2",
        },
      ],
    },
  ];

  let fetch = async () => {
    let _state = state;
    let _infos = infos;
    let element = _infos?.[isClicked];

    if (!element?.arr) {
      console.log("aborted fetch cv overview", element);
      return;
    }
    let target = element.btn.toLowerCase();
    if (!_state?.owner?.details?.[target]?.length >= 0) {
      _state.owner.details[`${target}`] = [];
    }

    for (let index = 0; index < element?.arr?.length; index++) {
      const id = element?.arr?.[index];
      let el = await element?.setState(id);
      _state.owner.details[target].push(el);
    }

    doStateTools(dispatch, _state);
  };

  useEffect(() => {
    let target = infos?.[isClicked]?.btn.toLowerCase();
    if (!isLists?.[target] && state?.owner?.details && isInView) {
      console.log("Fetch CV Overview ...", state);

      fetch();
    }
  }, [isClicked, isInView]);

  useEffect(() => {
    let target = infos?.[isClicked]?.btn.toLowerCase();

    if (
      (!isLists?.[target] ||
        isLists?.[target]?.table?.length !== isLists?.[target]?.arr?.length) &&
      state?.owner?.details?.[target]?.length >= 0 &&
      isInView
    ) {
      console.log(
        "list state CV Overview ...",
        state?.owner?.details?.[target]
      );

      setIsLists({
        ...isLists,
        [target]: infos?.[isClicked],
      });
    }
  }, [status, isClicked, isInView]);

  console.log("list", isLists);

  return (
    <>
      <MyMenusTabs
        setter={setIsClicked}
        value={isClicked}
        arr={infos}
        target={"btn"}
      />

      <div ref={ref} className="w-full h-full rounded-lg shadow backdrop-blur ">
        <MyTable
          list={isLists?.[`${infos?.[isClicked].btn.toLowerCase()}`]?.table}
          head={isLists?.[`${infos?.[isClicked].btn.toLowerCase()}`]?.head}
          btns={infos?.[isClicked]?.btns}
          editBtns={infos?.[isClicked]?.editBtns}
        />
      </div>
    </>
  );
};
