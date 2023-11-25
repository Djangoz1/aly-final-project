"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { AgendasMission } from "sections/works/Missions/state/AgendasMission";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const missionID = params.missionID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutMission
      controller={"agendas"}
      missionID={missionID}
      url={"/agendas"}
    >
      <AgendasMission />
    </LayoutMission>
  );
}

export default App;
