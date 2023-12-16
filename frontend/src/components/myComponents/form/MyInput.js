import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useEffect, useState } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";
import "./style.css";
import { Icon } from "@iconify/react";
import { icfy, icfySEND } from "icones";
import { useToolsState } from "context/tools";
import { clientPocket } from "utils/ui-tools/pinata-tools";
export let MyInput = ({
  target,
  min,

  max,
  index,
  label,
  _placeholder,
  children,
  step,
  type,
  icon,
  setter,
  styles,
  metadatas,
  result,
  color,
}) => {
  let [isLoading, setIsLoading] = useState(false);
  let { form, placeholders, superChecked, checked, pointer, disabled } =
    useFormState();
  let { refresh } = useToolsState();
  let dispatch = useFormDispatch();

  let handlePost = async () => {
    if ((metadatas || setter) && !isLoading && !disabled) {
      try {
        setIsLoading(true);
        if (metadatas) {
          await clientPocket.records.update(
            metadatas["@collectionName"],
            metadatas.id,
            { [target]: form?.[target] }
          );
        } else {
          await setter(form?.[target], form, (form) => {
            console.log("load", form);
            doInitStateForm(dispatch, { ...form, [target]: null });
          });
        }

        // await setter(form?.[target], target);
        setIsLoading(false);
        // handleChange(null);
        if (refresh) {
          refresh();
        }
      } catch ({ error }) {
        console.error(error);
      }
    }
  };

  let handleChange = async (_value) => {
    let _form = form;

    if (index >= 0) {
      _form[target][index] = _value;
    } else {
      _form[target] = _value;
    }
    doInitStateForm(dispatch, _form);

    doStateFormChecked({
      dispatch,
      pointer,
      form: _form,
      checked,
      superChecked: superChecked,
    });
  };
  let [isFocus, setIsFocus] = useState(null);

  let handleFocus = () => {
    setIsFocus(true);
  };
  let handleBlur = () => {
    setIsFocus(false);
  };

  useEffect(() => {
    if (min) {
      if (index >= 0 && parseFloat(form?.[target]?.[index]) < min) {
        handleChange(min);
      } else if (parseFloat(form?.[target]) < min) {
        handleChange(min);
      }
    }
  }, [min]);
  useEffect(() => {
    if (max) {
      if (index >= 0 && parseFloat(form?.[target]?.[index]) > max) {
        handleChange(max);
      } else if (parseFloat(form?.[target]) > max) {
        handleChange(max);
      }
    }
  }, [max]);

  return (
    <div className={` ${styles || "w-fit  c3 "}`}>
      {label !== false && (
        <label
          className={`label font-light w-fit   leading-0 text-xs mb-1  py-0  uppercase 
          ${form?.[target]?.length <= 1 && "c4"}
           ${type === "number" && form?.[target] == 0 && "c4"}
          `}
        >
          {label ? label : target}
          {checked?.[pointer]?.includes(target) && " *"}
        </label>
      )}
      <div
        className={` border  border-white/5 backdrop-blur  w-full  py-1  flex items-center h-fit rounded-lg  ${
          [
            !isFocus ? "" : "bg-white/5",
            ` ${!isFocus ? "bg-white/80" : "bg3"}`,
          ]?.[color || 0]
        }`}
      >
        {icon && !metadatas && !setter ? (
          <Icon icon={icon} className="c2 ml-2 text-2xl mr-3" />
        ) : undefined}
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type ? type : "text"}
          placeholder={_placeholder || placeholders?.[target]}
          onChange={(e) => handleChange(e.target.value)}
          min={min || null}
          max={max || null}
          step={step || null}
          value={
            index >= 0 && form?.[target]?.[index] >= 0
              ? form?.[target]?.[index]
              : form?.[target]
              ? form?.[target]
              : ""
          }
          className={` w-full ${isFocus && "border-none"} font3
          ${
            ["c3 font-medium", "c1 font-black placeholder:text-black  "]?.[
              color || 0
            ]
          } appearance-none bg-white/0  input-xs input placeholder:font-light   py-1 h-fit `}
        />
        {metadatas || setter ? (
          <div
            onClick={handlePost}
            className={`btn btn-ghost btn-xs px-2 py-0 w-fit h-fit ${
              ["c2", "c1"]?.[color || 0]
            }`}
          >
            {isLoading ? (
              <span className="loading  loading-bars  loading-xs "></span>
            ) : (
              <>
                <Icon icon={icon || icfySEND} className="text-[14px] " />
              </>
            )}
          </div>
        ) : undefined}
      </div>
      <div className="flex items-center justify-between">
        {result && (
          <div className="mt-2 flex items-center text-xs ">
            {children}
            <span className="text-sm   truncate max-w-[120px]">
              {(parseFloat(form?.[target]) / result?.value).toFixed(
                result?.fixed
              )}
            </span>
            <span className="text-xs  ml-2">{result?.text}</span>
          </div>
        )}
        {min && !result && (
          <span className="text-[8px] mt-1 flex flex-col">
            Min <span className="truncate w-12">{min}</span>
          </span>
        )}
        {max && (
          <span className="text-[8px] text-light ml-auto mt-1 flex  text-right items-end flex-col">
            Max <span className="truncate w-12">{max}</span>
          </span>
        )}
      </div>
    </div>
  );
};
