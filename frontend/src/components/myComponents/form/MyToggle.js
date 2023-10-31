import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import React from "react";
import "./style.css";
export const MyToggle = ({ style, target, children, label }) => {
  let { form } = useFormState();
  let dispatch = useFormDispatch();
  let setter = (e) => {
    let _form = form;
    _form[target] = e.target.checked;
    doInitStateForm(dispatch, _form);
  };

  return (
    <>
      <div
        className={`checkbox-wrapper-25  flex items-center ${
          form?.[target] === true ? "text-success" : "text-error"
        } ${style}`}
      >
        <input checked={form?.[target]} onChange={setter} type="checkbox" />
        <div className="text-xs   w-fit ml-4">{children}</div>
      </div>
    </>
  );
};
