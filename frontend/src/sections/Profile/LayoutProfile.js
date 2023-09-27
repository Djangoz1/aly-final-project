"use client";
import { useEffect, useState } from "react";

import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";
import { useAuthState } from "context/auth";
import { stateCV } from "utils/ui-tools/state-tools";

import { HeaderProfile } from "sections/Profile/HeaderProfile";

import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useAccount } from "wagmi";

export const LayoutProfile = ({ params, path, children }) => {
  let user = useAuthState();

  let _cvID = params.cvID;

  let dispatch = useCVDispatch();
  let { cvID, datas, metadatas } = useCVState();
  let { address } = useAccount();

  useEffect(() => {
    if (user?.cv === _cvID && !user?.datas) {
      doStateCV(dispatch, user);
    } else {
      doStateCV(dispatch, _cvID);
    }
  }, [_cvID, user?.cv, address]);

  return (
    <Layout
      banniere={metadatas?.attributes?.[0]?.banniere}
      className="h-screen flex  w-screen bg-white/90"
    >
      <MySection styles={" flex flex-col  justify-between "}>
        <HeaderProfile path={path} />
        <div className="flex w-full  border-b-1 border-t-0 border border-white/10 border-x-0 ">
          {children}
        </div>
      </MySection>
    </Layout>
  );
};
