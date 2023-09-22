import React, { useEffect, useState } from "react";

import { useAuthState } from "context/auth";

import { _form_create_feature } from "utils/ux-tools/form/feature";
import { MENUS_CREATE_FEATURE } from "constants/menus";
import { MySteps } from "components/myComponents/MySteps";
import { MyFormModal } from "components/myComponents/form/MyFormModal";

export const CreateFeature = () => {
  let { metadatas } = useAuthState();
  let form = _form_create_feature({ metadatas });

  let [isTarget, setIsTarget] = useState(0);

  let [isElement, setIsElement] = useState(form?.[0]);

  let handleClick = (target) => {
    if (isTarget >= 0 && isTarget < form?.length) {
      setIsTarget(target);
      setIsElement(form?.[target]);
    }
  };

  return (
    <MyFormModal
      left={<MySteps arr={MENUS_CREATE_FEATURE} pointer={isTarget} />}
      btn={"Create feature"}
      title={isElement.title}
      description={isElement.description}
      components={isElement.components}
      pointer={isTarget}
      handleClick={handleClick}
      total={form.length}
    />
  );
};
