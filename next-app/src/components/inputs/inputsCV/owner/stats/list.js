import { useEffect, useState } from "react";
import { StatOwnerCV, StatOwnerMission } from "./element";
import { _getStateOwnerMission } from "utils/ui-tools/auth-tools";
import { useMissionState } from "context/authMissions";
import { _getAllContractsMissionByFactory } from "utils/ui-tools/mission-tools";
import { BtnWorkerJoinFeature } from "./btn";
import { useAuthState } from "context/auth";
import { ObjStatsOwner } from "./obj";

export const StatsOwnerList = ({}) => {
  const [ownersList, setOwnersList] = useState();

  const { addres, cv } = useAuthState();
  const { missions } = useMissionState();

  const getAllOwnerCv = async () => {
    const arr = [];

    if (missions) {
      const addresses = await _getAllContractsMissionByFactory();
      for (let index = 0; index < addresses.length; index++) {
        const state = await _getStateOwnerMission(addresses[index]);
        arr.push(state);
      }
    }
    setOwnersList(arr);
  };

  useEffect(() => {
    if (missions) {
      getAllOwnerCv();
    }
  }, [missions]);
  return (
    <div className=" flex flex-col ">
      {ownersList?.map((obj, index) => (
        <div className="flex items-center" key={obj?.cvAddress}>
          <ObjStatsOwner obj={obj} />
          {obj?.cvAddress !== cv?.address && (
            <BtnWorkerJoinFeature cvAddress={obj?.cvAddress} />
          )}
        </div>
      ))}
    </div>
  );
};
