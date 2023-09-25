import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import React from "react";

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
      <input
        type="checkbox"
        className="toggle toggle-sm toggle-primary "
        checked={form?.[target]}
        onChange={setter}
      />
      <label className="text-xs  w-fit ml-4">{label}</label>
    </>
  );
};
