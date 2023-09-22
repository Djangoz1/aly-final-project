import React, { useEffect, useState } from "react";
import { useAuthState } from "context/auth";

import { MyMenus } from "components/myComponents/menu/MyMenus";
import { _form_edit_profile } from "utils/ux-tools/form/profile";
import { MENUS_EDIT_PROFILE } from "constants/menus";
import { v4 as uuidv4 } from "uuid";
import { MyFormModal } from "components/myComponents/form/MyFormModal";

export const EditProfile = ({ styles }) => {
  let { metadatas } = useAuthState();
  let [isMetadatas, setIsMetadatas] = useState(null);
  let handleChange = ({ object, target, value }) => {
    let newDatas = isMetadatas;
    if (target) {
      newDatas.attributes[0][target] = value;
    } else if (object) {
      newDatas[object] = value;
    }
    console.log("new", newDatas);
    setIsMetadatas(newDatas);
  };

  let form = _form_edit_profile({ metadatas: isMetadatas, handleChange });

  let [isOpen, setIsOpen] = useState(null);
  let [isElement, setIsElement] = useState(form?.[0] || null);
  useEffect(() => {
    if (!isMetadatas) setIsMetadatas(metadatas);
  }, [isMetadatas]);

  useEffect(() => {
    if (form && isOpen >= 0) {
      setIsElement(form[isOpen]);
    }
  }, [isOpen, form]);

  return (
    <MyFormModal
      btn={"Edit profile"}
      title={"⚙️ Settings"}
      styles={{ btn: styles }}
      left={
        <MyMenus
          setter={setIsOpen}
          styles={{
            box: "flex-col w-full bg-black/10 mr-10 h-full",
            el: "px-5 text-left",
          }}
          menus={MENUS_EDIT_PROFILE}
        />
      }
      description={isElement?.description || form?.[0]?.description}
      components={isElement?.components || form?.[0]?.components}
      total={0}
    />
  );
};
