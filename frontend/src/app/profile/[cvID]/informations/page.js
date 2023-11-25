"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { CVInfos } from "sections/Profile/state/CVInfos";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const cvID = params.cvID;
  console.log("state inforamtion pafe", state);
  return (
    <LayoutProfile
      controller={"informations"}
      cvID={parseInt(cvID)}
      url={"/informations"}
    >
      <>
        <CVInfos />
      </>
    </LayoutProfile>
  );
}

export default App;
