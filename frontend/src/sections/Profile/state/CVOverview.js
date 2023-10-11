import { MyTable } from "components/myComponents/table/MyTable";
import { MENUS_EDIT } from "constants/menus";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
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

export const CVOverview = () => {
  let { state, index, status } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);
  let [isLists, setIsLists] = useState(null);

  let infos = [
    {
      btn: "Missions",
      table: _table_missions(state?.owner?.details),
      head: HEAD_table_missions,
      setState: stateMission,

      btns: MENUS_EDIT.mission,
    },
    {
      btn: "Jobs",
      table: _table_features(state?.owner?.details?.jobs),
      head: HEAD_table_features,
      setState: stateFeature,
      arr: state?.owner?.datas?.proposals,
      btns: MENUS_EDIT.feature,
    },
    {
      btn: "Launchpads",
      table: _table_launchpad(state?.owner?.details?.launchpads),
      head: HEAD_table_launchpads,
      arr: state?.owner?.datas?.launchpads,
      setState: stateLaunchpad,
      btns: MENUS_EDIT.invite,
    },
    {
      btn: "Invitations",
      table: _table_invites(state?.owner?.details?.invites),
      head: HEAD_table_invites,
      arr: state?.owner?.details?.invitation,
      setState: stateFeature,
      btns: MENUS_EDIT.invite,
    },
  ];

  let ref = useRef(null);
  let isInView = useInView(ref);
  let dispatch = useToolsDispatch();
  let fetch = async () => {
    console.log("state", state);
    let _state = state;
    let _infos = infos;
    let element = _infos?.[isClicked];
    if (!element?.arr) {
      console.log("aborted fetch cv overview");
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
  }, [
    state?.owner?.details?.[infos?.[isClicked]?.btn.toLowerCase()],
    isClicked,
    isInView,
  ]);

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
  }, [
    state?.owner?.details?.[infos?.[isClicked]?.btn.toLowerCase()]?.length > 0,
    isLists?.[infos?.[isClicked]?.btn.toLowerCase()]?.table?.length,
    status,
    isClicked,
    isInView,
  ]);

  return (
    <>
      <div className="tabs tabs-boxed backdrop-blur  mb-1">
        {infos.map((el, i) => (
          <button
            onClick={() => setIsClicked(i)}
            key={v4()}
            className={`  tab mr-5 btn-xs ${
              isClicked === i ? "bg1 text-white" : " "
            }`}
          >
            {el.btn}
          </button>
        ))}
      </div>

      <div ref={ref} className="w-full h-full rounded-lg shadow backdrop-blur ">
        <MyTable
          list={isLists?.[`${infos?.[isClicked].btn.toLowerCase()}`]?.table}
          head={isLists?.[`${infos?.[isClicked].btn.toLowerCase()}`]?.head}
          editBtns={isLists?.[`${infos?.[isClicked].btn.toLowerCase()}`]?.btns}
        />
      </div>
    </>
  );
};
