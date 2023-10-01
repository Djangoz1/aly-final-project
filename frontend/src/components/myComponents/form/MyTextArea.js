import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";
import React, { useEffect, useState } from "react";

export const MyTextArea = ({ label, target, styles }) => {
  let { form, placeholders, pointer, modal, checked } = useFormState();
  let [value, setValue] = useState(null);
  let dispatch = useFormDispatch();

  useEffect(() => {
    if (target && !value) setValue(form?.[target]);
  }, [target, modal]);

  let setter = (_value) => {
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
      className={`flex flex-col text-left ${form?.[target] && "text-white"}`}
    >
      <label className="text-light font-light text-xs mb-1 uppercase ">
        {label || target} {checked?.[pointer]?.includes(target) && " *"}
      </label>
      <textarea
        onChange={(e) => setter(e.target.value)}
        value={value || undefined}
        className={`textarea font2 font-light textarea-bordered ${
          styles || "max-h-[30vh]"
        }`}
        placeholder={placeholders?.[target]}
      ></textarea>
    </div>
  );
};