import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import React from "react";
import "./style.css";
export const MyToggle = ({ target, label }) => {
  let { form } = useFormState();
  let dispatch = useFormDispatch();
  let setter = (e) => {
    let _form = form;
    _form[target] = e.target.checked;
    doInitStateForm(dispatch, _form);
  };

  return (
    <>
      <div className="checkbox-wrapper-25 flex items-center">
        <input checked={form?.[target]} onChange={setter} type="checkbox" />
        <label className="text-xs   w-fit ml-4">{label}</label>
      </div>
    </>
  );
};
