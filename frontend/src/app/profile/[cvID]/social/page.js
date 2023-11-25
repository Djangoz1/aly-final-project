"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet } from "utils/ui-tools/web3-tools";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutProfile
      controller={"pubs"}
      cvID={cvID}
      target={"profile"}
      url={"/social"}
    >
      <>
        <MyLayoutHeader
          username={state?.profile?.metadatas?.username}
          image={state?.profile?.metadatas?.avatar}
          cvID={state?.profile?.cvID}
          banniere={state?.profile?.metadatas?.banniere}
          metadatas={state?.profile?.metadatas}
        />
        <CVProfile />
      </>
    </LayoutProfile>
  );
}

export default App;
