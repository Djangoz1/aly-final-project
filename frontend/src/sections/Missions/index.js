import { StatsOwnerList } from "components/inputs/inputsCV/owner/stats/list";

import React, { useEffect, useState } from "react";
import { _getName, _getStateOwnerMission } from "utils/ui-tools/auth-tools";

import {
  _getAllContractsMissionByFactory,
  _getContractMissionByAddress,
  // _getStateOwnerMission,
} from "utils/ui-tools/mission-tools";

export const Missions = () => {
  // const { missions, FactoryCv } = useMissionState();

  return (
    <div className="flex flex-col w-[70%]   justify-center mx-auto">
      <StatsOwnerList />
    </div>
  );
};
