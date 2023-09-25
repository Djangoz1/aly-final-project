"use client";
import { useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";

import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";

import { HEAD_table_missions, _table_missions } from "utils/works/mission";
import { MyTable } from "components/myComponents/table/MyTable";
import { stateDetailsCV } from "utils/ui-tools/state-tools";
import { MENUS_EDIT } from "constants/menus";

export default function Page({ params }) {
  let user = useAuthState();

  let state,
    { cvID } = useCVState();
  let [isDetails, setIsDetails] = useState(null);
  let details = async () => {
    setIsDetails(await stateDetailsCV(cvID));
  };
  useEffect(() => {
    if (!isDetails && cvID && cvID > 0) details();
  }, [cvID]);

  return (
    <LayoutProfile params={params} path={"missions"}>
      <MyTable
        state={state}
        list={_table_missions(state, isDetails)}
        head={HEAD_table_missions}
        editBtns={MENUS_EDIT.mission}
      />
    </LayoutProfile>
  );
}
