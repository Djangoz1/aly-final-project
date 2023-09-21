"use client";
import { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";
import { useAuthState } from "context/auth";
import { stateCV } from "utils/ui-tools/state-tools";

import { ProfileHeader } from "components/profile/ProfileHeader";
import { ProfileMissions } from "../../components/profile/ProfileMissions";
import { ProfilePubs } from "components/profile/ProfilePubs";

export const LayoutProfile = ({ children }) => {
  return (
    <Layout className="h-screen flex  w-screen bg-white/90">
      <MySection styles={" flex flex-col  justify-between "}>
        <ProfileHeader />

        <div className="flex w-full  border-b-1 border-t-0 border border-white/10 border-x-0 ">
          {children}
        </div>
      </MySection>
    </Layout>
  );
};
