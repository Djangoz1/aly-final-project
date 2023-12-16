import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useToolsState } from "context/tools";
import React from "react";
import { v4 as uuidv4, v4 } from "uuid";
import { MyInput } from "./MyInput";
import { MyMainBtn } from "../btn/MyMainBtn";
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
export const MySelect = ({
  arr,
  style,
  template,
  target,
  label,
  _withError,
  setter,
  styles,
}) => {
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

  return [
    <div className={`flex items-center gap-2 ${style || "flex-wrap"}`}>
      {(() =>
        Array.isArray(form?.[target])
          ? [
              ...arr,
              ...form?.[target]?.filter((el, _i) => typeof el === "string"),
            ]
          : arr)()?.map((el, i) => (
        <MyMainBtn
          _refresh={false}
          style={"font-light  backdrop-blur  btn-sm px-3 py-2 "}
          color={
            Array.isArray(form?.[target])
              ? form?.[target]?.includes(i) || form?.[target]?.includes(el)
                ? 0
                : 2
              : arr?.length === 2 && _withError !== false
              ? form?.[target] == i
                ? i === 0
                  ? 3
                  : 4
                : 2
              : form?.[target] == i
              ? 0
              : 2
          }
          icon={false}
          key={v4()}
          setter={() =>
            handleChange(
              Array.isArray(form?.[target])
                ? form?.[target]?.includes(i) || form?.[target]?.includes(el)
                  ? form?.[target]?.filter((_el) => _el !== i && _el !== el)
                  : [...form?.[target], i]
                : form?.[target] == i
                ? null
                : i
            )
          }
        >
          {el}
        </MyMainBtn>
      ))}
    </div>,
    <div
      className={`flex hover:text-white flex-col  ${
        form?.[target] && "text-white"
      } ${styles}`}
    >
      {label !== false ? (
        <label className="text-light font-light text-xs mb-1 uppercase ">
          {label !== false ? label || target : ""}{" "}
          {label && checked?.[pointer]?.includes(target) && " *"}
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
        {arr?.map(
          (el, i) =>
            el && (
              <option value={`${i}`} key={uuidv4()}>
                {el}
              </option>
            )
        )}
      </select>
    </div>,
  ]?.[template || 0];
};
