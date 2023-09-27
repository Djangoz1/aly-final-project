"use client";
import { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";

import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import { HeaderMission } from "./HeaderMission";

export const LayoutMission = ({ path, children, id }) => {
  let dispatch = useMissionDispatch();

  let { mission, owner } = useMissionState();

  useEffect(() => {
    if (mission?.missionID !== id) {
      doStateMission(dispatch, id);
    }
  }, [id]);

  return (
    <Layout className="h-screen flex  w-screen bg-white/90">
      <MySection styles={" flex flex-col  justify-between "}>
        <HeaderMission
          path={path}
          owner={owner}
          metadatas={mission?.metadatas}
          datas={mission?.datas}
        />

        <div className="flex w-full  border-b-1 border-t-0 border border-white/10 border-x-0 ">
          {children}
        </div>
      </MySection>
    </Layout>
  );
};
