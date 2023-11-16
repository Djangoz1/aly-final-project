import { Icon } from "@iconify/react";
import { TextAI } from "components/myComponents/text/TextAI";
import { doInitStateForm, useFormState } from "context/form";
import { useToolsDispatch } from "context/tools";
import { icfy } from "icones";
import React, { useEffect, useState } from "react";

export const ElementResponseAI = ({
  style,
  title,
  children,
  text,
  target,
  setter,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isFormValue, setIsFormValue] = useState(false);
  let dispatch = useToolsDispatch();
  const { form } = useFormState();
  return (
    <div className="w-full h-fit  py-2 px-4 hover:bg-white/5 flex flex-col on_hover relative">
      <div className="absolute on_hover_view right-0 top-0  flex items-center">
        <button
          className={`btn btn-xs btn-ghost ${
            !isEdit ? "on_hover_view" : "text-success"
          }`}
          onClick={() => setIsEdit(!isEdit)}
        >
          <Icon icon={icfy.ux.edit} />
        </button>
        <button
          className={` btn btn-xs btn-ghost ${!isFormValue && "on_hover_view"}`}
          onClick={() => setIsFormValue(!isFormValue)}
        >
          <Icon
            icon={icfy.ux.refresh}
            className={isFormValue ? "text-error" : "text-success"}
          />
        </button>
      </div>

      <TextAI style={"font-bold underline"} text={title}></TextAI>
      {isEdit ? (
        <textarea
          className="textarea min-h-[10vh] bg-transparent p-0 m-0 w-full border-0 textarea-xs focus:bg-transparent textarea-ghost"
          value={isFormValue ? form?.[target] : text}
          onChange={(e) => {
            isFormValue
              ? doInitStateForm(dispatch, {
                  ...form,
                  [target]: e.target.value,
                })
              : setter(e.target.value);
          }}
        />
      ) : isFormValue ? (
        <TextAI
          text={`${children ? children : ""}${form?.[target]}`}
          style={"mb-4 text-xs " + style}
        ></TextAI>
      ) : text ? (
        <TextAI
          text={`${children ? children : ""}${text}`}
          style={"mb-4 text-xs " + style}
        ></TextAI>
      ) : (
        <div className="loading loading-spinner" />
      )}
    </div>
  );
};
