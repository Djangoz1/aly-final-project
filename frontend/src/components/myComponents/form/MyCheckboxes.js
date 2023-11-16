import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import React from "react";
import { v4 as uuidv4, v4 } from "uuid";
export const MyCheckboxes = ({
  label,
  template,
  style,
  target,
  checkboxes,
}) => {
  let { form, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();
  let setter = (index) => {
    let _form = form;
    _form[target] = index;
    doInitStateForm(dispatch, _form);
    doStateFormChecked({ dispatch, pointer, form: _form, checked });
  };
  return (
    <div className="flex flex-col w-fit text-left">
      <label className="text-light font-light text-xs mb-1 uppercase ">
        {label} {checked?.[pointer]?.includes(target) && " *"}
      </label>

      <div className={"flex items-center " + ["", "rating"]?.[template || 0]}>
        {checkboxes?.map(
          (el, i) =>
            [
              <div className="flex items-center" key={v4()}>
                <p
                  className={`mr-4 whitespace-nowrap text-xs ${
                    form?.[target] === i ? "text-white" : "text-white/20"
                  }`}
                >
                  {el?.title}
                </p>
                <label
                  className={`container_check relative  ${
                    style || "mr-8 w-[34px] h-[34px]"
                  }`}
                >
                  <input
                    type="checkbox "
                    onChange={() => setter(form[target] !== i ? i : null)}
                    onClick={() => setter(form[target] !== i ? i : null)}
                    checked={form?.[target] === i ? "checked" : false}
                  />
                  {form?.[target] === i && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ionicon absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 c2 "
                      viewBox="0 0 512 512"
                    >
                      <title>Checkmark</title>
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        d="M416 128L192 384l-96-96"
                      ></path>
                    </svg>
                  )}
                  <div className={`checkmark  `}></div>
                </label>
              </div>,
              <input
                key={v4()}
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                checked={i === form?.[target] ? true : undefined}
                onChange={() => setter(i)}
              />,
            ]?.[template || 0]
        )}
      </div>
      {/* <div className="flex hover:text-white items-center text-xs mr-4">
        <input
          type="checkbox"
          className="checkbox checkbox-xs mr-1"
          onChange={() => setter(form[target] !== i ? i : null)}
          checked={form?.[target] === i ? "checked" : false}
        />
        {el?.title}
      </div> */}
    </div>
  );
};
