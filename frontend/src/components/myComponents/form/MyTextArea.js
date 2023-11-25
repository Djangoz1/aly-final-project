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

export const MyTextArea = ({ label, metadatas, target, setter, styles }) => {
  let { form, placeholders, pointer, modal, checked } = useFormState();
  let [value, setValue] = useState(null);
  let dispatch = useFormDispatch();
  let [isFocus, setIsFocus] = useState(null);

  let handleFocus = () => {
    setIsFocus(true);
  };
  let handleBlur = () => {
    setIsFocus(false);
  };

  useEffect(() => {
    if (target && !value) setValue(form?.[target]);
  }, [target, modal]);

  let handlePost = async () => {
    if (setter) {
      setter(form?.target);
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
    <div className={`flex w-full flex-col  ${form?.[target] && "text-white"}`}>
      {!label?.no && (
        <label className="text-light font-light text-xs mb-1 uppercase ">
          {label || target} {checked?.[pointer]?.includes(target) && " *"}
        </label>
      )}
      <div className="w-full h-full relative">
        <textarea
          onChange={(e) => handleChange(e.target.value)}
          value={value || undefined}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`textarea font2 bg-gradient-to-bl from-zinc-900 to-white/5 w-full   font-light ${
            !isFocus ? "" : "shadow1"
          }  ${styles || "min-h-[10vh] max-h-[30vh]"}`}
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
    </div>
  );
};
