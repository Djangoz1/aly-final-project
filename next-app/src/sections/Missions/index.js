import { StatsOwnerList } from "components/inputs/inputsCV/owner/stats/list";

import { useMissionState } from "context/authMissions";

import React, { useEffect, useState } from "react";
import { _getName, _getStateOwnerMission } from "utils/ui-tools/auth-tools";

import {
  _getAllContractsMissionByFactory,
  _getContractMissionByAddress,
  // _getStateOwnerMission,
} from "utils/ui-tools/mission-tools";

export const Missions = () => {
  const { missions, FactoryCv } = useMissionState();

  let [missionsContract, setMissionsContract] = useState(null);

  const getAllMissions = async () => {
    const arr = [];
    // for (let index = 0; index < missions.length; index++) {
    //   const missionAddr = missions[index];
    //   const _mission = await _getContractMissionByAddress(missionAddr);
    //   arr.push(_mission);
    // }
    if (missions) {
      const addresses = await _getAllContractsMissionByFactory();
      for (let index = 0; index < addresses.length; index++) {
        const state = await _getStateOwnerMission(addresses[index]);
        arr.push(state);
      }
    }

    console.log(arr);
  };

  useEffect(() => {
    if (missions) {
      getAllMissions();
    }
  }, [missions]);

  return (
    <div className="flex flex-col w-[70%]   justify-center mx-auto">
      <StatsOwnerList missionsContract={missionsContract} />
    </div>
  );
};
