"use client";

import { useAuthState } from "context/auth";
import { ProfilePubs } from "components/profile/ProfilePubs";
import { LayoutProfile } from "sections/Profile/LayoutProfile";

export default function Page({ params }) {
  let { cv } = useAuthState();

  return (
    <LayoutProfile params={params} path={"pubs"}>
      <ProfilePubs />
    </LayoutProfile>
  );
}
