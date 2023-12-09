"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyETHER,
  icfyIMG,
  icfyMISSION,
  icfySEARCH,
  icfyTIME,
} from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { v4 } from "uuid";

import { MyCardFolder } from "components/myComponents/card/MyCardFolder";

import { MySub } from "components/myComponents/text/MySub";
import { LayoutLaunchpad } from "sections/Layout/layouts/LayoutLaunchpad";
import { ethers } from "ethers";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MyChart } from "components/myComponents/box/MyChart";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCard } from "components/myComponents/card/MyCard";
import { StateLaunchpadInfos } from "sections/Launchpad/state/StateLaunchpadInfos";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { Logo } from "components/Logo";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Pub } from "components/Pub";
import { controllers } from "utils/controllers";
import { useFormState } from "context/form";
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
