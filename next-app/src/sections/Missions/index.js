import { InputNumber } from "components/inputs";
import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { useAuthState } from "context/auth";
import React, { useState } from "react";
import { _createContractMission } from "utils/ui-tools/mission-tools";

export const CreationMission = () => {
  const { factoryMission, factoryCv, cv } = useAuthState();
  let [mission, setFeatures] = useState({
    amount: 0,
    features: [],
    address: "",
  });
  const increment = () => {
    const _mission = { ...mission };
    _mission.amount = mission.amount + 10;
    setFeatures(_mission);
  };
  const decrement = () => {
    const _mission = { ...mission };
    _mission.amount = mission.amount + 10;
    setFeatures(_mission);
  };

  const handleCreateMission = async () => {
    const value = 200;
    const tx = await _createContractMission(factoryCv, 200);
    console.log(tx);
  };
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <label className="label ">Amount :</label>
        <div className="flex">
          <InputNumber
            value={mission.amount}
            increment={increment}
            decrement={decrement}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreateMission}>
          Create a mission
        </button>
      </div>
    </div>
  );
};
