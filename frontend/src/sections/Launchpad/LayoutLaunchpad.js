import { MySection } from "components/myComponents/MySection";
import {
  LaunchpadProvider,
  doStateLaunchpad,
  useLaunchpadDispatch,
  useLaunchpadState,
} from "context/hub/launchpad";
import React, { useEffect } from "react";
import { Layout } from "sections/Layout";
import { HeaderLaunchpad } from "./HeaderLaunchpad";

export const LayoutLaunchpad = ({ children, id }) => {
  return (
    <LaunchpadProvider>
      <Child children={children} id={id} />
    </LaunchpadProvider>
  );
};

const Child = ({ children, id }) => {
  let dispatch = useLaunchpadDispatch();

  let { metadatas } = useLaunchpadState();
  useEffect(() => {
    if (id > 0) {
      doStateLaunchpad(dispatch, id);
    }
  }, [id]);

  return (
    <>
      <Layout banniere={metadatas?.attributes?.[0]?.banniere}>
        <MySection styles={"flex flex-col"}>
          <HeaderLaunchpad />
          {children}
        </MySection>
      </Layout>
    </>
  );
};
