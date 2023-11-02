import {
  doInitStateForm,
  doStateFormChecked,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useEffect } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

export const CodeEditor = ({ target, value, style, isForm }) => {
  let formState = isForm && useFormState();
  let dispatch = isForm && useFormDispatch();
  const handleCodeChange = (editor, data, _value) => {
    if (!value) {
      let _form = formState?.form;

      _form[target] = _value;

      _form.code = true;

      doInitStateForm(dispatch, _form);

      doStateFormChecked({
        dispatch,
        pointer: formState?.pointer,
        form: _form,
        checked: formState?.checked,
        superChecked: formState?.superChecked,
      });
    }
  };

  return (
    <div className={"w-full   " + style}>
      <CodeMirror
        value={value ? value : formState?.form?.[target]}
        onBeforeChange={handleCodeChange}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
          readOnly: value ? true : false,
        }}
      />
    </div>
  );
};
