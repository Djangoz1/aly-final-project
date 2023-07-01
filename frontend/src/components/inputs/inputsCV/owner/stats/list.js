import { useEffect, useState } from "react";
import { StatOwnerCV, StatOwnerMission } from "./element";
import {
  _getStateOwnerByCv,
  _getStateOwnerMission,
} from "utils/ui-tools/auth-tools";

import { _getAllContractsMissionByFactory } from "utils/ui-tools/mission-tools";
import { BtnWorkerJoinFeature } from "./btn";
import { useAuthState } from "context/auth";
import { ObjStatsOwner } from "./obj";
import Link from "next/link";
// import { _getAllCVs } from "utils/ui-tools/cv-tools";

export const StatsOwnerList = ({}) => {
  const [ownersList, setOwnersList] = useState();

  const { cv, missions } = useAuthState();

  const getAllOwnerCv = async () => {
    const arr = [];

    const addresses = await _getAllContractsMissionByFactory();

    for (let index = 0; index < addresses.length; index++) {
      const state = await _getStateOwnerMission(addresses[index]);
      arr.push(state);
    }

    setOwnersList(arr);
  };

  useEffect(() => {
    getAllOwnerCv();
    if (missions) {
    }
  }, [missions]);
  return (
    <div className=" flex flex-col ">
      {ownersList?.map((obj, index) => (
        <Link href={`profile/cv/${obj?.cvAddress}`} key={obj?.cvAddress}>
          <ObjStatsOwner obj={obj} />
        </Link>
      ))}
    </div>
  );
};
