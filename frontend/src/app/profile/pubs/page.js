"use client";

import { useAuthState } from "context/auth";
import { ProfilePubs } from "components/profile/ProfilePubs";
import { LayoutProfile } from "sections/Profile/LayoutProfile";

export default function Page() {
  let { cv } = useAuthState();

  return (
    <LayoutProfile>
      <ProfilePubs />
    </LayoutProfile>
  );
}
