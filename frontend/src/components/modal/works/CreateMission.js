import React, { useState } from "react";

import { useAuthState } from "context/auth";

import { MySteps } from "components/myComponents/MySteps";
import { MENUS_CREATE_MISSION } from "constants/menus";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { _form_create_mission } from "utils/ux-tools/form/mission";

export const CreateMission = () => {
  let { metadatas } = useAuthState();
  let [isTarget, setIsTarget] = useState(0);
  let form = _form_create_mission({ metadatas });

  let handleClick = (target) => {
    if (isTarget >= 0 && isTarget < form?.length) {
      setIsTarget(target);
      setIsElement(form?.[target]);
    }
  };
  let [isElement, setIsElement] = useState(form?.[0]);

  return (
    <MyFormModal
      btn={"Create mission"}
      left={<MySteps arr={MENUS_CREATE_MISSION} pointer={isTarget} />}
      title={isElement.title}
      description={isElement.description}
      components={isElement.components}
      pointer={isTarget}
      handleClick={handleClick}
      total={form.length}
    />
  );
};
