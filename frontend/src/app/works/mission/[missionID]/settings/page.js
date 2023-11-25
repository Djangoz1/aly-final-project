"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { EditProfile } from "sections/Form/forms/edit/EditProfile";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { _table_missions } from "utils/states/tables/mission";
import { _table_arbitrators } from "utils/states/tables/escrow";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { EditMission } from "sections/Form/forms/edit/EditMission";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  return (
    <LayoutMission
      controller={"edit"}
      missionID={params.missionID}
      url={"/settings"}
    >
      <EditMission />
    </LayoutMission>
  );
}

export default App;
