"use client";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";

import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";

import { HEAD_table_missions, _table_missions } from "utils/works/mission";
import { MyTable } from "components/myComponents/table/MyTable";
import { stateDetailsCV, stateFeature } from "utils/ui-tools/state-tools";
import { MENUS_EDIT } from "constants/menus";
import {
  HEAD_table_invites,
  _table_invites,
  _table_jobs,
} from "utils/works/feature";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";
import {
  HEAD_table_features,
  _table_features,
} from "utils/ux-tools/table/feature";

export default function Page({ params }) {
  let user = useAuthState();
  let { cvID, datas } = useCVState();
  let { isConnected, address } = useAccount();
  let [isFeatures, setIsFeatures] = useState(null);
  let dispatchCV = useCVDispatch();
  let dispatchAuth = useAuthDispatch();
  let fetchFeature = async () => {
    let invites = [];
    let jobs = [];
    for (let index = 0; index < datas?.invitation?.length; index++) {
      const featureID = datas?.invitation?.[index];
      let feature = await stateFeature(featureID);
      invites.push(feature);
    }
    for (let index = 0; index < datas?.proposals?.length; index++) {
      const featureID = datas?.proposals?.[index];
      let feature = await stateFeature(featureID);
      jobs.push(feature);
    }
    setIsFeatures({ jobs, invites });
  };
  console.log(datas);
  useEffect(() => {
    if (
      (cvID && datas?.invitation?.length > 0) ||
      (cvID && datas?.proposals?.length > 0)
    ) {
      fetchFeature();
    }
  }, [cvID, datas?.invitation?.length, datas?.proposals?.length]);

  MENUS_EDIT.invite[1].setter = async (id) => {
    if (isConnected) await _apiPost("acceptJob", [id]);
    doStateCV(dispatchCV, cvID);
    doAuthCV(dispatchAuth, address);
  };

  return (
    <LayoutProfile params={params} path={"jobs"}>
      <div className="flex flex-col w-full mt-5">
        <h6 className="text-white text-xl mb-3 ">Invitations</h6>
        <MyTable
          list={_table_invites(isFeatures?.invites)}
          head={HEAD_table_invites}
          editBtns={MENUS_EDIT.invite}
        />
        <h6 className="text-white text-xl mb-3 ">Jobs</h6>
        <MyTable
          list={_table_features(isFeatures?.jobs)}
          head={HEAD_table_features}
          editBtns={MENUS_EDIT.feature}
        />
      </div>
    </LayoutProfile>
  );
}
