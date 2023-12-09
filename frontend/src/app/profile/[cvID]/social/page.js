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

import { _apiGet } from "utils/ui-tools/web3-tools";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { LayoutSocial } from "sections/Layout/layouts/LayoutSocial";

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
        <LayoutSocial
          pubs={
            state?.pubs?.length > 0
              ? [
                  ...state?.pubs?.reverse()?.map((el) => {
                    return {
                      metadatas: el?.metadatas,
                      owner: state?.profile?.metadatas,
                    };
                  }),
                ]
              : null
          }
          owner={state?.profile}
        />
      </>
    </LayoutProfile>
  );
}

export default App;
