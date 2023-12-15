import { Icon } from "@iconify/react";
import { MyBtnLoading, MyBtnPost } from "components/btn/MyBtnPost";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";
import { icfySEND } from "icones";
import React, { useEffect, useState } from "react";
import { MyMainBtn } from "../btn/MyMainBtn";
import { clientPocket } from "utils/ui-tools/pinata-tools";

export const MyTextArea = ({
  rows,
  label,
  metadatas,
  target,
  setter,
  styles,
}) => {
  let { form, placeholders, pointer, modal, checked } = useFormState();
  let [value, setValue] = useState(null);
  let dispatch = useFormDispatch();

  useEffect(() => {
    if (target && !value) setValue(form?.[target]);
  }, [target, modal]);

  let handlePost = async () => {
    if (setter) {
      setter(form?.[target], form);
    } else if (metadatas) {
      await clientPocket.records.update(
        metadatas["@collectionName"],
        metadatas.id,
        { [target]: form[target] }
      );
    }
  };

  let handleChange = (_value) => {
    setValue(_value);
    let _form = form;

    _form[target] = _value;
    doInitStateForm(dispatch, form);

    if (_value?.length === 0) {
      doStateFormDisabled(dispatch, true);
    } else {
      doStateFormChecked({ dispatch, pointer, form, checked });
    }
  };

  return (
    <div
      className={`flex  w-full relative  flex-col  ${
        form?.[target] && "text-white"
      }`}
    >
      {!label?.no && label !== false && (
        <label className="text-light font-light text-xs mb-1 uppercase ">
          {label || target} {checked?.[pointer]?.includes(target) && " *"}
        </label>
      )}
      <textarea
        rows={rows || undefined}
        onChange={(e) => handleChange(e.target.value)}
        value={value || undefined}
        className={`textarea backdrop-blur font2 border focus:bg-white/5 border-white/5 bg-white/0    font-light  ${
          styles || "min-h-[10vh] max-h-[40vh] "
        }`}
        placeholder={placeholders?.[target]}
      ></textarea>
      {setter || metadatas ? (
        <MyMainBtn
          icon={icfySEND}
          template={1}
          setter={handlePost}
          style={"absolute btn-xs top-2 right-2   text-2xl c2"}
        ></MyMainBtn>
      ) : undefined}
    </div>
  );
};
