import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
export const MyInputsFile = ({ inputs, styles }) => {
  let { form } = useFormState();
  let dispatch = useFormDispatch();
  let setter = (target, file) => {
    let _form = form;

    _form[target] = file;
    doInitStateForm(dispatch, _form);
  };
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {inputs?.map((el) => (
        <div
          key={uuidv4()}
          className={`flex hover:text-white flex-col mr-5 ${
            form?.[el?.target] && "text-white"
          }`}
        >
          <label className="text-light font-light text-xs mb-1 uppercase ">
            {el?.label || el?.target}
          </label>
          <input
            type="file"
            onChange={(e) => setter(el?.target, e.target.files[0])}
            className="file-input font-light file-input-xs file-input-bordered w-fit"
          />
        </div>
      ))}
    </div>
  );
};
