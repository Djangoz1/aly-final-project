"use client";
import { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";
import { useAuthState } from "context/auth";
import { stateCV } from "utils/ui-tools/state-tools";

import { HeaderProfile } from "sections/Profile/HeaderProfile";
import { ProfileMissions } from "../../components/profile/ProfileMissions";
import { ProfilePubs } from "components/profile/ProfilePubs";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";

export const LayoutProfile = ({ params, path, children }) => {
  let user = useAuthState();

  let _cvID = params.cvID;

  let dispatch = useCVDispatch();
  let { cvID, datas, metadatas } = useCVState();

  useEffect(() => {
    if (user?.cv === _cvID && !user?.datas) {
      doStateCV(dispatch, user);
    } else {
      doStateCV(dispatch, _cvID);
    }
  }, [_cvID, user?.cv]);
  return (
    <Layout className="h-screen flex  w-screen bg-white/90">
      <MySection styles={" flex flex-col  justify-between "}>
        <HeaderProfile path={path} />

        <div className="flex w-full  border-b-1 border-t-0 border border-white/10 border-x-0 ">
          {children}
        </div>
      </MySection>
    </Layout>
  );
};
