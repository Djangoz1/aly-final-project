import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MyCheckboxes = ({ label, target, checkboxes }) => {
  let { form, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();
  let setter = (index) => {
    let _form = form;
    _form[target] = index;
    doInitStateForm(dispatch, _form);
    doStateFormChecked({ dispatch, pointer, form: _form, checked });
  };
  return (
    <div className="flex flex-col text-left">
      <label className="text-light font-light text-xs mb-1 uppercase ">
        {label} {checked?.[pointer]?.includes(target) && " *"}
      </label>
      <div className=" flex">
        {checkboxes?.map((el, i) => (
          <div
            key={uuidv4()}
            className="flex hover:text-white items-center text-xs mr-4"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs mr-1"
              onChange={() => setter(form[target] !== i ? i : null)}
              checked={form?.[target] === i ? "checked" : false}
            />
            {el?.title}
          </div>
        ))}
      </div>
    </div>
  );
};
