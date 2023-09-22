"use client";
import { useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/modal/MyModal";
import { useMissionDispatch } from "context/hub/mission";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect } from "react";
import { ProfileMissions } from "components/profile/ProfileMissions";

export default function Page({ params }) {
  let user = useAuthState();
  let { metadatas } = useCVState();
  return (
    <LayoutProfile params={params} path={"missions"}>
      <ProfileMissions />
    </LayoutProfile>
  );
}
