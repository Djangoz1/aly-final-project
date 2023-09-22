import React, { useState } from "react";
import { _form_create_profile } from "utils/ux-tools/form/profile";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MySteps } from "components/myComponents/MySteps";
import { MENUS } from "constants/menus";

export const CreateProfile = () => {
  let form = _form_create_profile({});

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
      btn={"Create profile"}
      left={<MySteps arr={MENUS.profile.create} pointer={isTarget} />}
      title={isElement.title}
      description={isElement.description}
      components={isElement.components}
      pointer={isTarget}
      handleClick={handleClick}
      total={form.length}
    />
  );
};
