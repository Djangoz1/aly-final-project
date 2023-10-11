import { Icon } from "@iconify/react";
import { LogoIc } from "components/Logo";
import { Pub } from "components/Pub";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfy } from "icones";
import React, { useEffect, useRef } from "react";
import { stateCV, stateDetailsCV, statePub } from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const MissionPubs = () => {
  let { state } = useToolsState();

  let ref = useRef(null);
  const isInView = useInView(ref);

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    let _state = state;

    _state.owner.details =
      state?.owner?.details ||
      (await stateDetailsCV(_state?.mission?.datas?.cvOwner));

    _state.pubs = [];

    let _pubs = await _apiGet("pubsOfMission", [
      parseInt(state?.mission?.missionID),
    ]);
    _state.followers = [];

    for (let index = 0; index < _pubs.length; index++) {
      const pubID = _pubs[index];

      let pubState = await statePub(pubID);
      let owner = await stateCV(pubState?.owner);
      _state.pubs.push({ pub: pubState, owner });
    }

    doStateTools(dispatch, _state);
  };

  useEffect(() => {
    if (isInView && !state?.pubs) {
      console.log("Fetch pubs ...");
      fetch();
    }
  }, [isInView]);

  return (
    <>
      <div
        ref={ref}
        className="backdrop-blur  overflow-y-scroll hide-scrollbar rounded-lg shadow  h-full w-full"
      >
        {state?.pubs?.map((el) => (
          <Pub
            styles={{ clamp: "3", size: "10px" }}
            id={el?.pub?.pubID}
            state={el?.pub}
            _owner={el?.owner}
            key={v4()}
          />
        ))}
      </div>
    </>
  );
};
