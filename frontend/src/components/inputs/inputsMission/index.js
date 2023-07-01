import { InputNumber } from "components/inputs";
import { ADDR_FACTORY_MISSION } from "constants/web3";

import {
  doAuthMission,
  doAuthMissionId,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
// import {
//   doMissionStateById,
//   useMissionDispatch,
//   useMissionState,
// } from "context/authMissions";
import React, { useEffect, useState } from "react";
import { _createContractMission } from "utils/ui-tools/mission-tools";
import { _setterCV, _setterMISSION } from "utils/ui-tools/web3-tools";

export const CreationMission = () => {
  const { factoryMission, factoryCv, cv } = useAuthState();

  let [amount, setAmount] = useState(0);
  const dispatch = useAuthDispatch();

  const handleCreateMission = async () => {
    const value = 200;
    await _setterCV(cv, "buyMission", [ADDR_FACTORY_MISSION, value]);
    doAuthMission(dispatch, cv);
  };
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <label className="label ">Amount :</label>
        <div className="flex">
          <InputNumber value={amount} setter={setAmount} />
        </div>
        <button className="btn btn-primary" onClick={handleCreateMission}>
          Create a mission
        </button>
      </div>
    </div>
  );
};

export const ListMission = () => {
  const { missions, missionId } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleClick = (_index) => {
    doAuthMissionId(dispatch, missions, _index);
  };

  return (
    <div className="tabs w-fit tabs-boxed">
      <a
        onClick={() => handleClick(null)}
        className={`tab tab-sm tab-success tab-lifted ${
          missionId === null && "tab-active"
        }`}
      >
        Create mission
      </a>
      {missions.map((mission, index) => (
        <a
          key={mission}
          onClick={() => handleClick(index)}
          className={`tab tab-sm tab-lifted ${
            index === missionId && "tab-active"
          }`}
        >
          Mission #{index}
        </a>
      ))}
    </div>
  );
};
