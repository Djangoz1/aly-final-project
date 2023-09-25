import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MySelects = ({ selects, styles }) => {
  let { form, placeholders, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();

  let setter = (target, index) => {
    let _form = form;
    _form[target] = index;
    doInitStateForm(dispatch, _form);
  };
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {selects?.map((el) => (
        <div
          key={uuidv4()}
          className={`flex hover:text-white flex-col mr-10 ${
            form?.[el?.target] && "text-white"
          }`}
        >
          <label className="text-light font-light text-xs mb-1 uppercase ">
            {el?.label} {checked?.[pointer]?.includes(el?.target) && " *"}
          </label>
          <select
            className="select font-light select-xs select-bordered w-full max-w-xs"
            onChange={(e) => setter(el?.target, e.target.value)}
            value={
              form?.[el?.target] !== null ? form?.[el?.target]?.toString() : ""
            }
          >
            <option value={""} disabled>
              {placeholders?.[el?.target]}
            </option>
            {el?.arr?.map((op, i) => (
              <option value={`${i}`} key={uuidv4()}>
                {op?.[el?.target1] || op}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
