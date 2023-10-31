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
import { icfy } from "icones";
export let MyInput = ({
  target,
  min,
  max,
  index,
  label,
  children,
  step,
  type,
  icon,
  setter,
  styles,
  result,
}) => {
  let [isLoading, setIsLoading] = useState(false);
  let { form, placeholders, superChecked, checked, pointer, disabled } =
    useFormState();
  let dispatch = useFormDispatch();

  let handlePost = async () => {
    if (setter && !isLoading && !disabled) {
      setIsLoading(true);
      await setter(form?.[target], target);
      setIsLoading(false);
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
    <div className={` ${styles || "w-fit mr-5 c3 "}`}>
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
        className={`bg-zinc-900 appearance-none w-full  py-1  flex items-center h-fit rounded-lg input-xs ${
          !isFocus ? "" : ""
        }`}
      >
        {icon && !setter ? (
          <Icon icon={icon} className="c2 ml-2 text-2xl mr-3" />
        ) : undefined}
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type ? type : "text"}
          placeholder={placeholders?.[target]}
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
          className={` c3 w-full ${
            isFocus && "border-success/20"
          }   appearance-none input-ghost input-xs input font-light  py-1 h-fit `}
        />
        {icon && setter ? (
          <div
            onClick={handlePost}
            className="btn btn-ghost btn-xs px-2 py-0 c2    w-fit h-fit"
          >
            {isLoading ? (
              <span className="loading  loading-bars  loading-xs "></span>
            ) : (
              <>
                <Icon icon={icon} className="text-[14px] " />
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
