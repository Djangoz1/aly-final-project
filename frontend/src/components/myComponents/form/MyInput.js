import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useEffect, useState } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";
import "./style.css";
export let MyInput = ({
  target,
  min,
  max,
  index,
  label,
  step,
  type,
  styles,
}) => {
  let { form, placeholders, superChecked, checked, pointer, disabled } =
    useFormState();
  let dispatch = useFormDispatch();

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
    <div className={` ${styles || "w-fit mr-5"}`}>
      <label
        className={`label font-light leading-0 text-xs mb-1  py-0  uppercase 
          ${form?.[target]?.length > 1 && "text-white"}
           ${type === "number" && form?.[target] > 0 && "text-white"}
          `}
      >
        {label ? label : target}
        {checked?.[pointer]?.includes(target) && " *"}
      </label>
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
        className={` input rounded-lg input-xs font-light bg-transparent py-2 h-fit ${
          !isFocus ? "shadow1" : "shadow2"
        }`}
      />
      <div className="flex items-center justify-between">
        {min && (
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
