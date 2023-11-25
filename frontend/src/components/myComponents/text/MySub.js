import { useFormState } from "context/form";
import React, { useEffect, useState } from "react";

export const MySub = ({ style, _form, children, size }) => {
  let { form } = _form ? useFormState() : { form: undefined };

  let [isFormValue, setIsFormValue] = useState(null);
  useEffect(() => {
    form ? setIsFormValue(_form(form)) : undefined;
  }, [form]);
  return (
    <div
      className={`cursor-default font-[500] tracking-[1.2px] ${
        " uppercase " + style
      } ${size ? `text-[${size}px]` : "text-xs"}`}
    >
      {isFormValue || undefined}
      {children}
    </div>
  );
};
