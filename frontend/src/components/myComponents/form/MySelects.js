import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MySelects = ({ selects, styles }) => {
  let { form, placeholders, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();

  let setter = (target, index, el) => {
    let _form = form;

    _form[target] = index;
    doInitStateForm(dispatch, _form);
    doStateFormChecked({ dispatch, pointer, form, checked });
    if (el?.setter) {
      el?.setter(el?.arr?.[index]);
    }
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
            {el?.label}{" "}
            {el?.label && checked?.[pointer]?.includes(el?.target) && " *"}
          </label>
          <select
            className="select font-light select-xs select-bordered w-full max-w-xs"
            onChange={(e) => setter(el?.target, e.target.value, el)}
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
