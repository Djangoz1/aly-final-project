import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useEffect } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";

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
    <div className="flex flex-col mr-5">
      <label
        className={`font-light text-left text-xs mb-1 uppercase 
           ${form?.[target]?.length > 1 && "text-white"}
           ${type === "number" && form?.[target] > 0 && "text-white"}
          `}
      >
        {label ? label : target}
        {checked?.[pointer]?.includes(target) && " *"}
      </label>
      <input
        type={type ? type : "text"}
        className={`input min-w-[120px] w-fit input-xs font-light  mr-1 ${
          form?.[target]?.length > 1 && "text-white "
        }
      ${type === "number" && form?.[target] > 0 && "text-white "}
      ${
        type === "number" && index && form?.[target][index] > 0 && "text-white "
      }
      ${styles}
      `}
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
      />
    </div>
  );
};
