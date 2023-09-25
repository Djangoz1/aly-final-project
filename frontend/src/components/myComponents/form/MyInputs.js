import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
export const MyInputs = React.memo(({ inputs, styles }) => {
  let { checked, pointer, form } = useFormState();
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {inputs?.map((el) => (
        <div className="flex hover:text-white flex-col mr-5" key={uuidv4()}>
          <label
            className={`font-light text-xs mb-1 uppercase 
           ${form?.[el?.target]?.length > 1 && "text-white"}
           ${el?.type === "number" && form?.[el?.target] > 0 && "text-white"}
          `}
          >
            {el?.label} {checked?.[pointer]?.includes(el?.target) && " *"}
          </label>
          <Element target={el?.target} type={el?.type} />
        </div>
      ))}
    </div>
  );
});

let Element = React.memo(({ target, type }) => {
  let { form, placeholders, checked, pointer, disabled } = useFormState();
  let dispatch = useFormDispatch();
  let [value, setValue] = useState("");

  const handleFocus = () => {
    let _form = form;
    if (_form[target] !== null) {
      // Vous pouvez ajouter d'autres actions à exécuter lorsque le focus entre ici
      _form[target] = null;
      doInitStateForm(dispatch, _form);
      doStateFormChecked({ dispatch, pointer, form: _form, checked });
    }
  };

  const handleBlur = (e) => {
    let _value = e.target.value;
    // Vous pouvez ajouter d'autres actions à exécuter lorsque le focus quitte ici
    if (_value?.length > 2 || type === "number") {
      let _form = form;
      _form[target] = _value;
      doInitStateForm(dispatch, _form);
      doStateFormChecked({ dispatch, pointer, form: _form, checked });
    }
  };

  // Fonction pour activer le focus sur l'input

  return (
    <input
      type={type ? type : "text"}
      className={`input input-xs font-light  mr-1 ${
        form?.[target]?.length > 1 && "text-white "
      }${type === "number" && form?.[target] > 0 && "text-white "}`}
      placeholder={placeholders?.[target]}
      onChange={(e) => setValue(e.target.value)}
      value={form?.[target] ? form[target] : value}
      onFocus={handleFocus} // Déclenché lorsque le focus entre
      onBlur={handleBlur} // Déclenché lorsque le focus quitte
    />
  );
});
