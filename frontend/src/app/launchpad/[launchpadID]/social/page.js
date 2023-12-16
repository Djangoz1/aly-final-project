"use client";

import { useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { LayoutLaunchpad } from "sections/Layout/layouts/LayoutLaunchpad";
import { LayoutForm } from "sections/Form/LayoutForm";
import { LayoutSocial } from "sections/Layout/layouts/LayoutSocial";

function App({ params }) {
  const { cv, metadatas } = useAuthState();

  const { state, status, pointer } = useToolsState();

  const launchpadID = params.launchpadID;

  return (
    <LayoutLaunchpad
      controller={"social"}
      launchpadID={launchpadID}
      url={"/social"}
    >
      <LayoutForm
        stateInit={{
          form: { target: "pubPage", search: null, description: null },
          allowed: true,
          placeholders: {
            search: "Search everything ...",
            description: "What's happening ...",
          },
        }}
      >
        <LayoutSocial
          launchpad={state?.launchpad}
          owner={state?.owner}
          launchpadHash={state?.launchpad?.metadatas?.id}
          pubs={state?.social}
        />
        {/* <Page /> */}
      </LayoutForm>
    </LayoutLaunchpad>
  );
}

export default App;
