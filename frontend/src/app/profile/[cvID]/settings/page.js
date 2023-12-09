"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { EditProfile } from "sections/Form/forms/edit/EditProfile";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  return (
    <LayoutProfile
      controller={"edit"}
      cvID={params.cvID}
      target={"profile"}
      url={"/settings"}
    >
      <EditProfile />
    </LayoutProfile>
  );
}

export default App;
