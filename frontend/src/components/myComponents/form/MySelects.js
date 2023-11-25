import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useToolsState } from "context/tools";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { MyInput } from "./MyInput";
export const MySelects = ({ selects, styles }) => {
  let { form, placeholders, checked, pointer } = useFormState();
  let formState = useFormState();
  let dispatch = useFormDispatch();
  console.log("form", form);
  let setter = (target, index, el) => {
    let _form = form;

    _form[target] = index;
    doInitStateForm(dispatch, _form);
    doStateFormChecked({ dispatch, pointer, form, checked });
    if (el?.setter) {
      el?.setter(el?.arr?.[index]);
    }
  };
  console.log("select", selects);
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {selects?.map(
        (el, i) =>
          el?.target && (
            <MySelect
              target={el?.target}
              label={el?.label}
              arr={el?.arr}
              styles={styles}
              setter={() => setter(el?.target, i, el)}
              key={uuidv4()}
            ></MySelect>
          )
      )}
    </div>
  );
};
export const MySelect = ({ arr, target, label, setter, styles }) => {
  let { form, placeholders, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();
  let { refresh } = useToolsState();
  let handleChange = async (index) => {
    let _form = form;

    _form[target] = index;
    doInitStateForm(dispatch, _form);
    doStateFormChecked({ dispatch, pointer, form, checked });
    if (setter) {
      await setter({ value: arr?.[index], index: parseInt(index) });
      if (refresh) {
        await refresh();
      }
    }
  };
  return (
    <div
      className={`flex hover:text-white flex-col mr-10 ${
        form?.[target] && "text-white"
      } ${styles}`}
    >
      {label !== false ? (
        <label className="text-light font-light text-xs mb-1 uppercase ">
          {label} {label && checked?.[pointer]?.includes(target) && " *"}
        </label>
      ) : undefined}
      <select
        className=" bg-gradient-to-bl rounded-lg border-white/5 border  from-zinc-900 to-transparent    py-2 h-fit font-light select-xs  w-full max-w-xs"
        onChange={(e) => handleChange(e.target.value)}
        value={form?.[target] !== null ? form?.[target] : ""}
      >
        <option value={""} disabled>
          {placeholders?.[target]}
        </option>
        {arr?.map((el, i) => (
          <option value={`${i}`} key={uuidv4()}>
            {el}
          </option>
        ))}
      </select>
    </div>
  );
};
