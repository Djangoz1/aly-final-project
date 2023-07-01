import { useEffect, useState } from "react";
import { StatOwnerCV, StatOwnerMission } from "./element";
import {
  _getStateOwnerByCv,
  _getStateOwnerMission,
} from "utils/ui-tools/auth-tools";

import { v4 as uuid } from "uuid";

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
    let addrOwner = [];
    const addresses = await _getAllContractsMissionByFactory();

    for (let index = 0; index < addresses.length; index++) {
      const state = await _getStateOwnerMission(addresses[index]);
      if (!addrOwner.includes(state?.cvAddress)) {
        arr.push(state);
        addrOwner.push(state?.cvAddress);
      }
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
        <Link href={`profile/cv/${obj?.cvAddress}`} key={uuid()}>
          <ObjStatsOwner obj={obj} />
        </Link>
      ))}
    </div>
  );
};
